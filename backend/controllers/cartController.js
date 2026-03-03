import userModel from "../models/userModel.js";
import { uploadFile } from "../services/storageService.js";
import { v4 as uuidv4 } from "uuid";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId; // Get userId from authenticated user
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: "Item ID and size are required" });
    }
    
    const userData = await userModel.findById(userId);
    
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    
    const cartData = userData.cartData || {};

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    
    res.json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.log('Error in addToCart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// add custom products to user cart
const addToCartCustom = async (req, res) => {
  try {
    const { imageId, size, views, gender, imageValue, customQuantity } = req.body;
    const userId = req.userId; // Get userId from authenticated user

    const reviewImageCustom =
      req.files.reviewImageCustom && req.files.reviewImageCustom[0];

    const images = [reviewImageCustom].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map((item) =>
        uploadFile(item.buffer, item.originalname, item.mimetype, 'custom')
      )
    );

    const customItem = {
      _id: imageId,
      size,
      name: "Custom" + " " + imageValue + "-" + Math.floor(Math.random() * 10),
      views,
      gender,
      imageValue,
      reviewImageCustom: imagesUrl,
      quantity: customQuantity,
      price: 699
    };

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User  not found" });
    }

    const customData = userData.customData || {};
    const index = Object.keys(customData).length;
    customData[index] = customItem;

    await userModel.findByIdAndUpdate(userId, { customData }, { new: true });

    res.json({
      success: true,
      message: "Custom item added to cart",
      customData,
    });
  } catch (error) {
    console.error("Error adding custom item to cart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get user custom data
const getUserCustomData = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId);
    
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const customData = userData.customData || {};

    res.json({ success: true, customData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId; // Get userId from authenticated user
    
    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    
    if (!itemId || !size || quantity === undefined) {
      return res.status(400).json({ success: false, message: "Item ID, size, and quantity are required" });
    }
    
    const userData = await userModel.findById(userId);
    
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }
    
    const cartData = userData.cartData || {};

    // Initialize item if it doesn't exist
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // If quantity is 0 or less, remove the size
    if (quantity <= 0) {
      delete cartData[itemId][size];
      // If no sizes left for this item, remove the item entirely
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log('Error in updateCart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// update custom quantity in the cart
const updateCustom = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId; // Get userId from authenticated user
    const userData = await userModel.findById(userId);
    const customData = userData.customData || {}; // Initialize customData if it's undefined

    // Check if the item exists
    if (customData[itemId] && customData[itemId][size]) {
      customData[itemId][size] = quantity;
      await userModel.findByIdAndUpdate(userId, { customData });
      res.json({ success: true, message: "Custom quantity updated" });
    } else {
      res.json({ success: false, message: "Custom item not found" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId);
    
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  addToCart,
  updateCart,
  getUserCart,
  addToCartCustom,
  getUserCustomData,
  updateCustom
};
