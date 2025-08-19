import Coupon from "../models/couponModel.js";
import userModel from "../models/userModel.js";

// Generate random coupon codes
const generateCouponCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create multiple coupon codes (Admin)
const createCouponBatch = async (req, res) => {
  try {
    const {
      count = 10,
      discountType,
      discountValue,
      minOrderAmount = 0,
      maxDiscount = null,
      validFrom,
      validUntil,
      usageLimit = null,
      description = '',
      applicableProducts = [],
      applicableCategories = []
    } = req.body;

    // Validate required fields
    if (!discountType || !discountValue || !validFrom || !validUntil) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: discountType, discountValue, validFrom, validUntil"
      });
    }
    
    // Validate discount type
    if (!['percentage', 'fixed'].includes(discountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type. Must be 'percentage' or 'fixed'"
      });
    }
    
    // Validate discount value
    const discountValueNum = parseFloat(discountValue);
    if (isNaN(discountValueNum) || discountValueNum < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount value. Must be a positive number"
      });
    }
    
    if (discountType === 'percentage' && discountValueNum > 100) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%"
      });
    }
    
    // Validate dates
    const validFromDate = new Date(validFrom);
    const validUntilDate = new Date(validUntil);
    const now = new Date();
    
    if (isNaN(validFromDate.getTime()) || isNaN(validUntilDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format for validFrom or validUntil"
      });
    }
    
    if (validFromDate >= validUntilDate) {
      return res.status(400).json({
        success: false,
        message: "ValidUntil date must be after ValidFrom date"
      });
    }
    
    if (validFromDate < now) {
      return res.status(400).json({
        success: false,
        message: "ValidFrom date cannot be in the past"
      });
    }

    const coupons = [];
    const existingCodes = new Set();

    // Generate unique coupon codes
    for (let i = 0; i < count; i++) {
      let code;
      let attempts = 0;
      
      do {
        code = generateCouponCode();
        attempts++;
        if (attempts > 100) {
          return res.status(400).json({
            success: false,
            message: "Unable to generate unique coupon codes. Please try again."
          });
        }
      } while (existingCodes.has(code));

      existingCodes.add(code);

      const coupon = new Coupon({
        code,
        discountType,
        discountValue: discountValueNum,
        minOrderAmount: parseFloat(minOrderAmount) || 0,
        maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
        validFrom: validFromDate,
        validUntil: validUntilDate,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        description,
        applicableProducts,
        applicableCategories,
        createdBy: req.userId === 'admin' ? null : req.userId
      });

      coupons.push(coupon);
    }

    // Save all coupons
    const savedCoupons = await Coupon.insertMany(coupons);

    res.json({
      success: true,
      message: `${count} coupon codes created successfully`,
      coupons: savedCoupons
    });

  } catch (error) {
    console.error("Error creating coupon batch:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: `Validation error: ${validationErrors.join(', ')}`
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate coupon code generated. Please try again."
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

// Test endpoint
const testCoupon = async (req, res) => {
  res.json({ success: true, message: "Coupon controller is working" });
};

// Validate and apply coupon
const validateCoupon = async (req, res) => {
  try {
    console.log('validateCoupon called with:', { body: req.body, userId: req.userId });
    const { code, orderAmount, productIds = [] } = req.body;
    const userId = req.userId;

    if (!code || !orderAmount) {
      console.log('Missing required fields:', { code, orderAmount });
      return res.status(400).json({
        success: false,
        message: "Coupon code and order amount are required"
      });
    }

    // Simple test - just check if coupon exists
    console.log('Searching for coupon with code:', code.toUpperCase());
    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      console.log('Coupon not found');
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code. Please check the code and try again."
      });
    }

    console.log('Coupon found, returning success');
    res.json({
      success: true,
      message: "Coupon found successfully",
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: 100, // Test value
        finalAmount: orderAmount - 100,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get available coupons for users
const getAvailableCoupons = async (req, res) => {
  try {
    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      validFrom: { $lte: now },
      validUntil: { $gte: now }
    }).select('code description discountType discountValue minOrderAmount maxDiscount');

    res.json({
      success: true,
      coupons
    });
  } catch (error) {
    console.error("Error fetching available coupons:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all coupons (Admin)
const getAllCoupons = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.code = { $regex: search, $options: 'i' };
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const skip = (page - 1) * limit;
    
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Coupon.countDocuments(query);

    res.json({
      success: true,
      coupons,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCoupons: total,
        hasNext: skip + coupons.length < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single coupon (Admin)
const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findById(id)
      .populate('applicableProducts', 'name price')
      .populate('usedBy.userId', 'name email');

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    res.json({
      success: true,
      coupon
    });

  } catch (error) {
    console.error("Error fetching coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update coupon (Admin)
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.code;
    delete updateData.usedCount;
    delete updateData.usedBy;
    delete updateData.createdAt;
    delete updateData.createdBy;

    const coupon = await Coupon.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    res.json({
      success: true,
      message: "Coupon updated successfully",
      coupon
    });

  } catch (error) {
    console.error("Error updating coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete coupon (Admin)
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    
    const coupon = await Coupon.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    res.json({
      success: true,
      message: "Coupon deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Toggle coupon status (Admin)
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Coupon ID is required"
      });
    }

    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found"
      });
    }

    // Toggle the status
    coupon.isActive = !coupon.isActive;
    
    // Save the updated coupon
    const updatedCoupon = await coupon.save();

    res.json({
      success: true,
      message: `Coupon ${updatedCoupon.isActive ? 'activated' : 'deactivated'} successfully`,
      coupon: updatedCoupon
    });

  } catch (error) {
    console.error("Error toggling coupon status:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while toggling coupon status"
    });
  }
};

// Get coupon statistics (Admin)
const getCouponStats = async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });
    const expiredCoupons = await Coupon.countDocuments({
      validUntil: { $lt: new Date() }
    });
    
    const totalUsage = await Coupon.aggregate([
      {
        $group: {
          _id: null,
          totalUsed: { $sum: "$usedCount" }
        }
      }
    ]);

    // Get most used coupons
    const mostUsedCoupons = await Coupon.find({ usedCount: { $gt: 0 } })
      .sort({ usedCount: -1 })
      .limit(6)
      .select('code discountType discountValue usedCount isActive validFrom validUntil');

    const recentCoupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('code discountType discountValue isActive createdAt');

    res.json({
      success: true,
      stats: {
        totalCoupons,
        activeCoupons,
        expiredCoupons,
        totalUsage: totalUsage[0]?.totalUsed || 0,
        mostUsedCoupons
      },
      recentCoupons
    });

  } catch (error) {
    console.error("Error fetching coupon stats:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export {
  createCouponBatch,
  validateCoupon,
  testCoupon,
  getAvailableCoupons,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  getCouponStats
};

