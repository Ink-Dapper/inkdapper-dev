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

// Check existing coupons
const checkCoupons = async () => {
  try {
    const coupons = await Coupon.find({}).select('code discountType discountValue minOrderAmount isActive validFrom validUntil');
    
    console.log(`\nFound ${coupons.length} coupons in database:`);
    console.log('=====================================');
    
    coupons.forEach((coupon, index) => {
      console.log(`${index + 1}. Code: ${coupon.code}`);
      console.log(`   Type: ${coupon.discountType}`);
      console.log(`   Value: ${coupon.discountValue}`);
      console.log(`   Min Order: ₹${coupon.minOrderAmount}`);
      console.log(`   Active: ${coupon.isActive}`);
      console.log(`   Valid From: ${coupon.validFrom}`);
      console.log(`   Valid Until: ${coupon.validUntil}`);
      console.log('   ---');
    });
    
    // Check for specific coupon
    const specificCoupon = await Coupon.findOne({ code: 'SLTVFBSQ' });
    if (specificCoupon) {
      console.log('\n✅ SLTVFBSQ coupon found!');
      console.log(specificCoupon);
    } else {
      console.log('\n❌ SLTVFBSQ coupon NOT found');
    }
    
  } catch (error) {
    console.error('Error checking coupons:', error);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await checkCoupons();
  mongoose.connection.close();
  console.log('\nScript completed successfully!');
};

runScript().catch(console.error);
