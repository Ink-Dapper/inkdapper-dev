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
    const { imageId, size, views, gender, imageValue, customQuantity, aiDesignUrl, designFolder } = req.body;
    const userId = req.userId; // Get userId from authenticated user

    const reviewImageCustomFile =
      req.files && req.files.reviewImageCustom && req.files.reviewImageCustom[0];
    const rawDesignFile =
      req.files && req.files.rawDesignImage && req.files.rawDesignImage[0];

    // Use the folder sent from frontend (e.g. "cart"), default to "cart"
    const storageFolder = designFolder || 'cart';

    let finalImageUrls = [];

    // Upload original design file if provided (user-uploaded image in upload mode)
    let rawDesignUrl = null;
    if (rawDesignFile) {
      rawDesignUrl = await uploadFile(rawDesignFile.buffer, rawDesignFile.originalname, rawDesignFile.mimetype, 'ai-designs');
    }

    if (reviewImageCustomFile) {
      // Store in cart/ folder so all cart design images are grouped together
      const url = await uploadFile(reviewImageCustomFile.buffer, reviewImageCustomFile.originalname, reviewImageCustomFile.mimetype, storageFolder);
      finalImageUrls = [url];
    } else if (aiDesignUrl) {
      // Fallback: download AI URL server-side, store in cart/ folder
      try {
        const response = await fetch(aiDesignUrl);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const filename = `cart-ai-${imageId || uuidv4()}.png`;
        const url = await uploadFile(buffer, filename, 'image/png', storageFolder);
        finalImageUrls = [url];
      } catch (err) {
        console.error('Failed to save AI image to MinIO, using original URL:', err.message);
        finalImageUrls = [aiDesignUrl];
      }
    }

    const customItem = {
      _id: imageId,
      size,
      name: "Custom" + " " + imageValue + "-" + Math.floor(Math.random() * 10),
      views,
      gender,
      imageValue,
      reviewImageCustom: finalImageUrls,
      aiDesignUrl: aiDesignUrl || null,
      rawDesignUrl: rawDesignUrl || null,
      quantity: customQuantity,
      price: 699
    };

    const userData = await userModel.findById(userId).lean();
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Use plain object copy to avoid Mongoose wrapper stripping fields
    const customData = userData.customData ? { ...userData.customData } : {};
    const index = Object.keys(customData).length;
    customData[index] = customItem;

    console.log('[addToCartCustom] saving customItem:', JSON.stringify(customItem));
    await userModel.findByIdAndUpdate(userId, { $set: { customData } }, { new: true });

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
    const userData = await userModel.findById(userId).lean();

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

// update or delete custom item in the cart
const updateCustom = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;
    const userData = await userModel.findById(userId).lean();
    const customData = userData.customData || {};

    console.log('[updateCustom] received itemId:', itemId, '| size:', size, '| quantity:', quantity);
    console.log('[updateCustom] customData keys:', Object.keys(customData));
    Object.keys(customData).forEach(k => {
      console.log(`  [${k}] _id=${customData[k]._id} (${typeof customData[k]._id}) size=${customData[k].size}`);
    });

    // Find the numeric index where _id and size match
    const indexKey = Object.keys(customData).find(
      (k) => String(customData[k]._id) === String(itemId) && customData[k].size === size
    );

    console.log('[updateCustom] indexKey found:', indexKey);

    if (indexKey === undefined) {
      return res.json({ success: false, message: "Custom item not found" });
    }

    if (Number(quantity) <= 0) {
      // Remove the item and re-index sequentially
      delete customData[indexKey];
      const reIndexed = {};
      Object.values(customData).forEach((item, i) => { reIndexed[i] = item; });
      await userModel.findByIdAndUpdate(userId, { $set: { customData: reIndexed } });
      res.json({ success: true, message: "Custom item removed" });
    } else {
      customData[indexKey].quantity = Number(quantity);
      await userModel.findByIdAndUpdate(userId, { $set: { customData } });
      res.json({ success: true, message: "Custom quantity updated" });
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
