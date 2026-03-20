import mongoose from 'mongoose';
import Coupon from '../models/couponModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Generate random coupon codes
const generateCouponCode = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Create initial coupon codes
const createInitialCoupons = async () => {
  try {
    // Check if coupons already exist
    const existingCoupons = await Coupon.countDocuments();
    if (existingCoupons > 0) {
      console.log('Coupons already exist. Skipping initial creation.');
      return;
    }

    const coupons = [
      {
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        minOrderAmount: 500,
        maxDiscount: 200,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        usageLimit: 100,
        description: 'Welcome discount - 20% off on orders above ₹500'
      },
      {
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        minOrderAmount: 300,
        maxDiscount: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
        usageLimit: 200,
        description: 'Save 10% on orders above ₹300'
      },
      {
        code: 'FIRST50',
        discountType: 'fixed',
        discountValue: 50,
        minOrderAmount: 200,
        maxDiscount: 50,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        usageLimit: 500,
        description: 'Flat ₹50 off on orders above ₹200'
      },
      {
        code: 'FLASH25',
        discountType: 'percentage',
        discountValue: 25,
        minOrderAmount: 1000,
        maxDiscount: 500,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        usageLimit: 50,
        description: 'Flash sale - 25% off on orders above ₹1000'
      },
      {
        code: 'NEWUSER100',
        discountType: 'fixed',
        discountValue: 100,
        minOrderAmount: 500,
        maxDiscount: 100,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        usageLimit: 100,
        description: 'New user special - ₹100 off on orders above ₹500'
      }
    ];

    // Generate 5 additional random coupon codes
    for (let i = 0; i < 5; i++) {
      const randomCode = generateCouponCode();
      const discountType = Math.random() > 0.5 ? 'percentage' : 'fixed';
      const discountValue = discountType === 'percentage' 
        ? Math.floor(Math.random() * 30) + 5 // 5-35%
        : Math.floor(Math.random() * 200) + 50; // ₹50-250

      coupons.push({
        code: randomCode,
        discountType,
        discountValue,
        minOrderAmount: Math.floor(Math.random() * 500) + 100, // ₹100-600
        maxDiscount: discountType === 'percentage' ? Math.floor(Math.random() * 300) + 100 : discountValue,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + (Math.floor(Math.random() * 60) + 30) * 24 * 60 * 60 * 1000), // 30-90 days
        usageLimit: Math.floor(Math.random() * 200) + 50, // 50-250
        description: `Random coupon - ${discountType === 'percentage' ? `${discountValue}% off` : `₹${discountValue} off`}`
      });
    }

    // Insert all coupons
    const createdCoupons = await Coupon.insertMany(coupons);
    
    console.log(`Successfully created ${createdCoupons.length} initial coupon codes:`);
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code}: ${coupon.description}`);
    });

    console.log('\nInitial coupon codes created successfully!');
  } catch (error) {
    console.error('Error creating initial coupons:', error);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await createInitialCoupons();
  mongoose.connection.close();
  console.log('Script completed successfully!');
};

runScript().catch(console.error);

