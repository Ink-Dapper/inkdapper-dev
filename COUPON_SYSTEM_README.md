# Coupon System Implementation

This document describes the comprehensive coupon system implemented for the Inkdapper e-commerce platform.

## Features

### 🎫 Coupon Management
- **Batch Creation**: Create multiple coupon codes at once (1-100 codes per batch)
- **Flexible Discount Types**: Percentage-based or fixed amount discounts
- **Validity Control**: Set start and end dates for coupon validity
- **Usage Limits**: Configure maximum usage per coupon
- **Minimum Order Requirements**: Set minimum order amounts for coupon eligibility
- **Maximum Discount Caps**: Limit maximum discount amount for percentage-based coupons

### 🔐 Security & Validation
- **Unique Codes**: Automatically generated unique coupon codes
- **User Tracking**: Track which users have used specific coupons
- **Expiration Handling**: Automatic validation of coupon expiration dates
- **Duplicate Prevention**: Users can only use each coupon once
- **Product/Category Specific**: Apply coupons to specific products or categories

### 📊 Admin Dashboard
- **Comprehensive Statistics**: View total coupons, active coupons, expired coupons, and total usage
- **Search & Filter**: Search coupons by code and filter by status
- **Bulk Operations**: Create, activate/deactivate, and delete coupons
- **Real-time Updates**: Live updates of coupon statistics and usage

### 🛒 User Experience
- **Easy Application**: Simple coupon code input on product pages
- **Real-time Validation**: Instant feedback on coupon validity
- **Visual Feedback**: Clear display of applied discounts
- **Order Integration**: Seamless integration with cart and checkout process

## Database Schema

### Coupon Model
```javascript
{
  code: String (unique, uppercase),
  discountType: 'percentage' | 'fixed',
  discountValue: Number,
  minOrderAmount: Number,
  maxDiscount: Number,
  validFrom: Date,
  validUntil: Date,
  usageLimit: Number,
  usedCount: Number,
  isActive: Boolean,
  description: String,
  applicableProducts: [Product IDs],
  applicableCategories: [Category Names],
  usedBy: [{
    userId: ObjectId,
    usedAt: Date,
    orderId: ObjectId
  }],
  createdAt: Date,
  createdBy: ObjectId (Admin ID)
}
```

## API Endpoints

### User Endpoints
- `POST /api/coupon/validate` - Validate and apply coupon code

### Admin Endpoints
- `POST /api/coupon/create-batch` - Create multiple coupon codes
- `GET /api/coupon/all` - Get all coupons with pagination
- `GET /api/coupon/stats` - Get coupon statistics
- `GET /api/coupon/:id` - Get specific coupon details
- `PUT /api/coupon/:id` - Update coupon details
- `DELETE /api/coupon/:id` - Delete coupon
- `PATCH /api/coupon/:id/toggle` - Toggle coupon active status

## Frontend Components

### CouponSection Component
- **Location**: `frontend/src/components/CouponSection.jsx`
- **Features**:
  - Coupon code input with validation
  - Real-time feedback on coupon application
  - Visual display of applied coupons
  - Sample coupon suggestions
  - Remove coupon functionality

### CartTotal Component Updates
- **Location**: `frontend/src/components/CartTotal.jsx`
- **Updates**:
  - Added coupon discount display
  - Updated total calculation to include coupon discounts
  - Enhanced savings information display

### Admin Coupons Page
- **Location**: `admin/src/pages/Coupons.jsx`
- **Features**:
  - Dashboard with statistics cards
  - Coupon management table
  - Batch creation modal
  - Search and filter functionality
  - Pagination support

## Setup Instructions

### 1. Backend Setup
1. Ensure MongoDB is running
2. The coupon model and routes are automatically included
3. Run the initial coupon generation script:

```bash
cd backend
node scripts/generateInitialCoupons.js
```

### 2. Frontend Setup
1. The coupon components are automatically included
2. Coupon functionality is integrated into the ShopContext
3. Product pages now include the coupon section

### 3. Admin Setup
1. Access the admin dashboard
2. Navigate to "Coupons" in the sidebar
3. Create your first batch of coupon codes

## Usage Examples

### Creating Coupon Codes
1. **Login to Admin Dashboard**
2. **Navigate to Coupons**
3. **Click "Create Coupons"**
4. **Fill in the form**:
   - Number of coupons: 10
   - Discount type: Percentage
   - Discount value: 15
   - Minimum order: 500
   - Valid from: Today
   - Valid until: 30 days from now
   - Usage limit: 100
   - Description: "15% off on orders above ₹500"

### Applying Coupons (Users)
1. **Add items to cart**
2. **Go to product page**
3. **Click "Have a code?"**
4. **Enter coupon code** (e.g., "WELCOME20")
5. **Click "Apply"**
6. **See discount applied to cart total**

## Sample Coupon Codes

The system comes with these pre-generated coupon codes:

- **WELCOME20**: 20% off on orders above ₹500 (max ₹200)
- **SAVE10**: 10% off on orders above ₹300 (max ₹100)
- **FIRST50**: Flat ₹50 off on orders above ₹200
- **FLASH25**: 25% off on orders above ₹1000 (max ₹500)
- **NEWUSER100**: Flat ₹100 off on orders above ₹500

Plus 5 additional random coupon codes for testing.

## Validation Rules

### Coupon Validation
1. **Code Exists**: Coupon code must exist in database
2. **Active Status**: Coupon must be active
3. **Valid Date Range**: Current date must be within validity period
4. **Usage Limit**: Coupon usage must not exceed limit
5. **User Eligibility**: User must not have used this coupon before
6. **Minimum Order**: Order amount must meet minimum requirement
7. **Product Eligibility**: Products must be eligible for coupon (if specified)

### Discount Calculation
- **Percentage Discount**: `discount = min(orderAmount * percentage, maxDiscount)`
- **Fixed Discount**: `discount = min(fixedAmount, orderAmount)`
- **Final Amount**: `finalAmount = orderAmount - discount`

## Security Features

1. **Authentication Required**: Users must be logged in to apply coupons
2. **Admin Authorization**: Only admins can create/manage coupons
3. **Usage Tracking**: Each coupon usage is tracked with user and order details
4. **Duplicate Prevention**: Users cannot use the same coupon multiple times
5. **Validation**: All coupon data is validated before processing

## Future Enhancements

### Planned Features
- **Email Integration**: Send coupon codes via email campaigns
- **Analytics Dashboard**: Detailed coupon performance analytics
- **Bulk Import**: Import coupon codes from CSV files
- **Scheduled Coupons**: Automatically activate/deactivate coupons
- **Referral Coupons**: Generate coupons for referral programs
- **Loyalty Integration**: Integrate with customer loyalty programs

### Technical Improvements
- **Caching**: Implement Redis caching for better performance
- **Rate Limiting**: Add rate limiting for coupon validation
- **Webhooks**: Add webhook support for coupon events
- **API Versioning**: Implement API versioning for future updates

## Troubleshooting

### Common Issues

1. **Coupon Not Applying**
   - Check if user is logged in
   - Verify coupon code is correct
   - Ensure order meets minimum amount
   - Check coupon validity dates

2. **Admin Cannot Create Coupons**
   - Verify admin authentication
   - Check database connection
   - Ensure proper permissions

3. **Coupon Statistics Not Updating**
   - Refresh the admin page
   - Check for JavaScript errors
   - Verify API endpoints are working

### Debug Mode
Enable debug logging by setting environment variable:
```bash
DEBUG_COUPONS=true
```

## Support

For technical support or questions about the coupon system:
1. Check the console logs for error messages
2. Verify all API endpoints are accessible
3. Ensure database connections are working
4. Review the validation rules and requirements

---

**Note**: This coupon system is designed to be scalable and maintainable. All code follows best practices and includes comprehensive error handling and validation.

