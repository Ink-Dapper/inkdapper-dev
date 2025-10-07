# Deployment Guide for API Fixes

## Overview
This guide ensures that the API fixes work correctly in both development and production environments without affecting the live server.

## Changes Made

### 1. Fixed Double `/api/` URL Issue
- **Problem**: URLs like `/api/api/order/place` were causing 404 errors
- **Solution**: Updated API calls to use relative paths that work with axios baseURL configuration

### 2. Environment-Aware API Configuration
- **Development**: Uses Vite proxy (`/api` → `http://localhost:4000/api`)
- **Production**: Uses full URL (`https://api.inkdapper.com/api`)

### 3. Created API Helper Utility
- Centralized API calls in `frontend/src/utils/apiHelper.js`
- Consistent error handling across all API calls
- Environment-aware endpoint management

## Files Modified

### Core Configuration
- `frontend/src/config/api.js` - API configuration
- `frontend/src/utils/axios.js` - Axios instance configuration
- `frontend/src/utils/apiHelper.js` - **NEW** - Centralized API helper

### Components Fixed
- `frontend/src/pages/PlaceOrder.jsx` - Order placement
- `frontend/src/pages/Orders.jsx` - Order display
- `frontend/src/components/Slider.jsx` - Banner slider
- `frontend/src/components/ProfileListItems.jsx` - Profile orders
- `frontend/src/pages/OrderDetails.jsx` - Order details
- `frontend/src/pages/Custom.jsx` - Custom products
- `frontend/src/components/ShippedProgress.jsx` - Shipping progress
- `frontend/src/components/ProductReviewSection.jsx` - Product reviews

## Deployment Steps

### 1. Pre-Deployment Checklist
- [ ] Backend server is running on port 4000 (development) or configured for production
- [ ] Database is connected and accessible
- [ ] All API endpoints are working correctly

### 2. Environment Variables
Ensure these are set correctly:

**Development (.env.local):**
```env
VITE_API_URL=  # Leave empty to use Vite proxy
```

**Production (.env.production):**
```env
VITE_API_URL=https://api.inkdapper.com  # Your actual API domain
```

### 3. Build and Deploy
```bash
# Build for production
npm run build

# Deploy to your VPS
# (Use your existing deployment script)
```

### 4. Post-Deployment Verification

#### Test These Functionalities:
- [ ] **Homepage**: Banner slider loads correctly
- [ ] **Orders Page**: Displays orders (or "No Orders Yet" message)
- [ ] **Place Order**: Can place both COD and Razorpay orders
- [ ] **Thank You Page**: Shows after order completion
- [ ] **Order Details**: Individual order pages work
- [ ] **Profile**: Order history displays correctly
- [ ] **Custom Products**: Custom order submissions work
- [ ] **Product Reviews**: Review submissions work

#### Check Browser Console:
- [ ] No 404 errors for API calls
- [ ] No CORS errors
- [ ] Successful API responses logged

## How It Works

### Development Environment
```
Frontend (localhost:5173) 
  ↓ /api/order/place
Vite Proxy 
  ↓ http://localhost:4000/api/order/place
Backend Server (localhost:4000)
```

### Production Environment
```
Frontend (your-domain.com) 
  ↓ https://api.inkdapper.com/api/order/place
Backend Server (api.inkdapper.com)
```

## Rollback Plan
If issues occur after deployment:

1. **Immediate Rollback**: Revert to previous deployment
2. **Check Environment Variables**: Ensure `VITE_API_URL` is set correctly
3. **Verify Backend**: Ensure backend server is accessible
4. **Check Network**: Verify API endpoints are reachable

## Troubleshooting

### Common Issues:

1. **404 Errors Still Occurring**
   - Check if backend server is running
   - Verify API endpoints exist on backend
   - Check network connectivity

2. **CORS Errors**
   - Ensure backend CORS is configured for your domain
   - Check if credentials are being sent correctly

3. **Environment Issues**
   - Verify `import.meta.env.DEV` is working correctly
   - Check if `VITE_API_URL` is being read properly

## Benefits of This Solution

✅ **Backward Compatible**: Works with existing backend API structure  
✅ **Environment Aware**: Automatically adapts to dev/prod environments  
✅ **Error Resilient**: Graceful fallbacks for failed API calls  
✅ **Maintainable**: Centralized API management  
✅ **No Breaking Changes**: Existing functionality preserved  

## Support
If you encounter any issues during deployment, check:
1. Browser console for errors
2. Network tab for failed requests
3. Backend server logs
4. Environment variable configuration
