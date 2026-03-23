import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import { createNotification } from "./notificationController.js";

// Load environment variables from .env file
dotenv.config();

const currency = "inr";
const DeliveryCharge = 100;

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── AiSensy WhatsApp Integration ────────────────────────────────────────────

// Send WhatsApp message via AiSensy API
const sendWhatsAppMessage = async (phone, templateParams, campaignName) => {
  try {
    const countryCode = process.env.PHONE_COUNTRY_CODE || "91";
    const destination = `${countryCode}${phone}`;

    const payload = {
      apiKey: process.env.AISENSY_API_KEY,
      campaignName: campaignName || process.env.AISENSY_CAMPAIGN_NAME,
      destination,
      userName: templateParams[0] || "Customer",
      templateParams,
      source: "order-confirmation",
      media: {},
      buttons: [],
      carouselCards: [],
      location: {},
    };

    const response = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    if (response.ok) {
      console.log(`WhatsApp message sent to ${destination}:`, result);
    } else {
      console.error("AiSensy error:", result);
    }
  } catch (err) {
    console.error("WhatsApp send error:", err.message);
    // Don't fail the order if WhatsApp fails
  }
};

// Build AiSensy template params for order confirmation
// templateParams maps to your AiSensy template variables {{1}}, {{2}}, etc.
const buildWhatsAppTemplateParams = (user, orderData, paymentMethod) => {
  const itemLines = orderData.items
    .map(
      (item, i) =>
        `${i + 1}. ${item.name || "Custom Design"} | Size: ${item.size} | Qty: ${item.quantity} | ₹${item.price * item.quantity}`
    )
    .join("\n");

  const deliveryAddress = orderData.address
    ? `${orderData.address.street || ""}, ${orderData.address.city || ""}, ${orderData.address.state || ""} - ${orderData.address.zipcode || ""}`.replace(/^,\s*/, "").trim()
    : "As per registered address";

  return [
    user.name,                                                                        // {{1}} Customer name
    itemLines,                                                                        // {{2}} Order items
    paymentMethod,                                                                    // {{3}} Payment method
    `₹${orderData.amount}`,                                                          // {{4}} Total amount
    new Date(orderData.expectedDeliveryDate).toLocaleDateString("en-IN"),            // {{5}} Delivery date
    deliveryAddress,                                                                  // {{6}} Delivery address
  ];
};

//Gateway initialization
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing Order using COD Method
const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
      expectedDeliveryDate: expectedDeliveryDate,
    };

    const newOrder = await new orderModel(orderData).save();

    await userModel.findByIdAndUpdate(userId, { cartData: {}, customData: {} });
    // Add credit points logic
    const creditPointsToAdd = items.length * 5;
    await userModel.findByIdAndUpdate(userId, {
      $inc: { creditPoints: creditPointsToAdd },
    });

    // Send email with order details
    const user = await userModel.findById(userId);
    const mailOptions = {
      from: "inkdapper@gmail.com",
      to: user.email,
      subject: "Order Confirmation",
      html: `
        <p>Your order has been placed successfully.<br> <span style="font-weight: bold; font-size: 18px; margin-top: 10px;">Order details:</span></p>
        <div>
          ${orderData.items
            .map(
              (item) => `
            <div style="margin-bottom: 20px;">
              <img src="${item.isCustom ? (Array.isArray(item.reviewImageCustom) ? item.reviewImageCustom[0] : (item.reviewImageCustom || '')) : (Array.isArray(item.image) ? item.image[0] : (item.image || ''))}" alt="${item.name || 'Custom Design'}" style="width: 100px; height: 100px; object-fit: cover; margin-left: 15px;" /> <br>
              <ul style="list-style-type: none; padding: 0;">
                <li><strong>Product Name:</strong> ${item.name} </li>
                <li><strong>Size:</strong> ${item.size} </li>
                <li><strong>Quantity:</strong> ${item.quantity}</li>
                <li><strong>Price:</strong> ${item.price}</li>
                <li><strong>Order Date:</strong> ${new Date(orderData.date).toLocaleDateString()}</li>
                <li><strong>Expected Delivery Date:</strong> ${new Date(orderData.expectedDeliveryDate).toLocaleDateString()}</li>
                <li style="margin-top: 10px; bottom-border: 1px solid #000;padding-top: 10px;"><strong>Total Price:</strong> ${item.price * item.quantity}</li>
              </ul>
            </div>
          `
            )
            .join("")}
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    // Send WhatsApp confirmation message via AiSensy
    if (user.phone) {
      const templateParams = buildWhatsAppTemplateParams(user, orderData, "Cash on Delivery");
      await sendWhatsAppMessage(user.phone, templateParams);
    }

    // Create admin notification for new COD order
    try {
      await createNotification(
        `New COD order placed (Order ID: ${newOrder._id})`,
        newOrder._id
      );
    } catch (notifError) {
      console.error("Failed to create COD order notification:", notifError);
      // Don't fail the order placement if notification creation fails
    }

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing Order using Stripe Method
const placeOrderStripe = async (req, res) => {};

// Placing Order using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const { items, amount, address } = req.body;

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: userId.toString(),
    };

    await razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        return res.json({ success: false, message: err.message });
      }
      return res.json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
      address,
    } = req.body;

    if (!razorpay_order_id) {
      return res.json({ success: false, message: "Order ID is required" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

      const orderData = {
        userId,
        items,
        address,
        amount,
        paymentMethod: "Razorpay",
        payment: true,
        date: Date.now(),
        expectedDeliveryDate: expectedDeliveryDate,
      };

      const newOrder = await new orderModel(orderData).save();

      await userModel.findByIdAndUpdate(userId, { cartData: {}, customData: {} });

      const creditPointsToAdd = items.length * 5;
      await userModel.findByIdAndUpdate(userId, {
        $inc: { creditPoints: creditPointsToAdd },
      });

      // Send email with order details
      const user = await userModel.findById(userId);
      const mailOptions = {
        from: "inkdapper@gmail.com",
        to: user.email,
        subject: "Order Confirmation",
        html: `
          <p>Your order has been placed successfully.<br> <span style="font-weight: bold; font-size: 18px; margin-top: 10px;">Order details:</span></p>
          <div>
            ${orderData.items
              .map(
                (item) => `
              <div style="margin-bottom: 20px;">
                <img src="${item.isCustom ? (Array.isArray(item.reviewImageCustom) ? item.reviewImageCustom[0] : (item.reviewImageCustom || '')) : (Array.isArray(item.image) ? item.image[0] : (item.image || ''))}" alt="${item.name || 'Custom Design'}" style="width: 100px; height: 100px; object-fit: cover; margin-left: 15px;" /> <br>
                <ul style="list-style-type: none; padding: 0;">
                  <li><strong>Product Name:</strong> ${item.name} </li>
                  <li><strong>Size:</strong> ${item.size} </li>
                  <li><strong>Quantity:</strong> ${item.quantity}</li>
                  <li><strong>Price:</strong> ${item.price}</li>
                  <li><strong>Order Date:</strong> ${new Date(orderData.date).toLocaleDateString()}</li>
                  <li><strong>Expected Delivery Date:</strong> ${new Date(orderData.expectedDeliveryDate).toLocaleDateString()}</li>
                  <li style="margin-top: 10px; bottom-border: 1px solid #000;padding-top: 10px;"><strong>Total Price:</strong> ${item.price * item.quantity}</li>
                  <li><strong>Payment Method:</strong> Razorpay</li>
                </ul>
              </div>
            `
              )
              .join("")}
          </div>
        `,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      // Send WhatsApp confirmation message via AiSensy
      if (user.phone) {
        const templateParams = buildWhatsAppTemplateParams(user, orderData, "Razorpay (Prepaid)");
        await sendWhatsAppMessage(user.phone, templateParams);
      }

      // Create admin notification for successful Razorpay order
      try {
        await createNotification(
          `New prepaid order placed via Razorpay (Order ID: ${newOrder._id})`,
          newOrder._id
        );
      } catch (notifError) {
        console.error("Failed to create Razorpay order notification:", notifError);
        // Don't fail the order placement if notification creation fails
      }

      res.json({ success: true, message: "Payment Successful", orderInfo });
    } else {
      res.json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// All order data from admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from auth middleware
    const { orderId, returnOrderStatus, returnReason, cancelReason } = req.body;
    
    // If orderId is provided, update the order (for return/cancel operations)
    if (orderId) {
      const returned = await orderModel.findByIdAndUpdate(orderId, {
        returnOrderStatus,
        returnReason,
        cancelReason,
      });
    }
    
    // Get all orders for the user
    const orders = await orderModel.find({ userId });
    console.log('User ID:', userId, 'Orders found:', orders.length);
    res.json({ success: true, message: "Orders retrieved successfully", orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User Details for Profiles
const userDetails = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status, deliveryDate } = req.body;

    let updateData = { status, deliveryDate };

    if (status === "Delivered") {
      const returnDate = new Date(deliveryDate);
      returnDate.setDate(returnDate.getDate() + 7);
      updateData.returnDate = returnDate;
    }

    await orderModel.findByIdAndUpdate(orderId, updateData);
    console.log(updateData.returnDate);
    res.json({
      success: true,
      message: "Status Updated",
      returnDate: updateData.returnDate,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to get credit points
const clearCreditPoints = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId);
    
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const creditPoints = userData.creditPoints || 0;

    await userModel.findByIdAndUpdate(userId, { creditPoints: 0 });
    res.json({ success: true, message: "Cleared Credit Points", creditPoints });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Count returned orders
const countReturnedOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    const count = await orderModel.countDocuments({
      userId,
      returnOrderStatus: "Return Confirmed",
    });
    res.json({ success: true, count });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  userDetails,
  clearCreditPoints,
  countReturnedOrders,
  verifyRazorpay,
};