//import wishlistModel from '../models/wishlistModel.js';
import userModel from "../models/userModel.js";

// add products to user wishlist
const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    const userData = await userModel.findById(userId);
    const wishlistData = await userData.wishlistData;

    if (wishlistData[itemId]) {
      wishlistData[itemId] += 1;
    } else {
      wishlistData[itemId] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { wishlistData });
    res.json({ success: true, message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// wishlist user cart
const updateWishlist = async (req, res) => {
  try {
    const { userId, itemId, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let wishlistData = await userData.wishlistData;

    if (quantity <= 0) {
      delete wishlistData[itemId];
    } else {
      wishlistData[itemId] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { wishlistData });
    res.json({ success: true, message: "Wishlist updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserWishlist = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId);
    
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    const wishlistData = userData.wishlistData || {};

    res.json({ success: true, wishlistData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for  removing products
const removeWishlist = async (req, res) => {};

export { addToWishlist, updateWishlist, getUserWishlist, removeWishlist };
