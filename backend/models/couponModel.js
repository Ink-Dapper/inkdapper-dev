import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'fixed'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  maxDiscount: {
    type: Number,
    default: null
  },
  validFrom: {
    type: Date,
    required: true
  },
  validUntil: {
    type: Date,
    required: true
  },
  usageLimit: {
    type: Number,
    default: null
  },
  usedCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  },
  applicableProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  applicableCategories: [{
    type: String
  }],
  usedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    usedAt: {
      type: Date,
      default: Date.now
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }
});

// Index for faster queries
couponSchema.index({ validUntil: 1 });
couponSchema.index({ isActive: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validUntil &&
         (this.usageLimit === null || this.usedCount < this.usageLimit);
};

// Method to check if user can use this coupon
couponSchema.methods.canBeUsedBy = function(userId) {
  return !this.usedBy.some(usage => usage.userId.toString() === userId.toString());
};

// Method to calculate discount amount
couponSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.minOrderAmount) {
    return 0;
  }

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = (orderAmount * this.discountValue) / 100;
  } else {
    discount = this.discountValue;
  }

  // Apply max discount limit if set
  if (this.maxDiscount && discount > this.maxDiscount) {
    discount = this.maxDiscount;
  }

  return Math.min(discount, orderAmount); // Can't discount more than order amount
};

const Coupon = mongoose.model('Coupon', couponSchema);

export default Coupon;

