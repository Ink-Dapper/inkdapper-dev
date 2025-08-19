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

// Fix coupon dates
const fixCouponDates = async () => {
  try {
    const now = new Date();
    console.log('Current time:', now);
    
    // Find coupons with future validFrom dates
    const futureCoupons = await Coupon.find({
      validFrom: { $gt: now }
    });
    
    console.log(`Found ${futureCoupons.length} coupons with future validFrom dates`);
    
    if (futureCoupons.length > 0) {
      // Update all coupons to have validFrom as current time
      const result = await Coupon.updateMany(
        { validFrom: { $gt: now } },
        { 
          $set: { 
            validFrom: now,
            validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          }
        }
      );
      
      console.log(`Updated ${result.modifiedCount} coupons`);
    }
    
    // Show all coupons after fix
    const allCoupons = await Coupon.find({}).select('code validFrom validUntil isActive');
    console.log('\nAll coupons after fix:');
    allCoupons.forEach(coupon => {
      console.log(`${coupon.code}: ${coupon.validFrom} to ${coupon.validUntil} (Active: ${coupon.isActive})`);
    });
    
  } catch (error) {
    console.error('Error fixing coupon dates:', error);
  }
};

// Run the script
const runScript = async () => {
  await connectDB();
  await fixCouponDates();
  mongoose.connection.close();
  console.log('\nScript completed successfully!');
};

runScript().catch(console.error);
