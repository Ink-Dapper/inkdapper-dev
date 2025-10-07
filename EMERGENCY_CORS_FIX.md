# 🚨 EMERGENCY CORS FIX - Deploy Immediately

## The Problem
Your backend server is not sending CORS headers, causing all API requests to fail.

## Immediate Fix - Deploy These Changes NOW

### 1. Update Backend Server (CRITICAL)

Replace your `backend/server.js` with this emergency fix:

```javascript
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import couponRouter from './routes/couponRoute.js'
import bodyParser from 'body-parser';
import newsLetterRoute from './routes/newsLetterRoute.js'
import emailRouter from './routes/emailRoute.js'
import highlightedProductRouter from './routes/highlightedProductRoute.js'
import notificationRouter from './routes/notificationRoute.js'
import googleReviewRouter from './routes/googleReviewRoute.js'
import path from 'path'
import { fileURLToPath } from 'url'
import adminAuth from './middleware/adminAuth.js'

// App config
const app = express()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()
connectCloudinary()

// EMERGENCY CORS FIX - Allow all origins temporarily
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'token', 
    'X-Requested-With', 
    'X-Device-Type',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}

// middlewares
app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

// Apply CORS FIRST
app.use(cors(corsOptions));

// EMERGENCY CORS HEADERS - Add to ALL responses
app.use((req, res, next) => {
  // Set CORS headers for ALL requests
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running with CORS fix',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.status(200).end();
});

// Your existing routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/review', reviewRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/newsletter', newsLetterRoute)
app.use('/api/email', emailRouter)
app.use('/api/highlighted-products', highlightedProductRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/google-reviews', googleReviewRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} with CORS fix`);
});
```

### 2. Deploy Immediately

```bash
# On your VPS server
cd /var/www/inkdapper-dev

# Stop the current server
pm2 stop inkdapper-backend

# Update the server.js file with the code above
# (Copy and paste the entire code above)

# Start the server
pm2 start inkdapper-backend

# Check status
pm2 status
```

### 3. Test the Fix

```bash
# Test health endpoint
curl https://api.inkdapper.com/health

# Test CORS
curl -H "Origin: https://www.inkdapper.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.inkdapper.com/api/product/list
```

### 4. Fix MIME Type Issues (Nginx)

Add this to your nginx configuration for the frontend:

```nginx
# Add to your www.inkdapper.com server block
location ~* \.(js|mjs)$ {
    add_header Content-Type "application/javascript; charset=utf-8";
    add_header Cache-Control "public, max-age=31536000, immutable";
}

location ~* \.css$ {
    add_header Content-Type "text/css; charset=utf-8";
    add_header Cache-Control "public, max-age=31536000, immutable";
}

# Handle preflight requests
location / {
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin";
        add_header Access-Control-Allow-Credentials "true";
        add_header Access-Control-Max-Age 86400;
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
    
    # Your existing configuration
    root /var/www/html;
    index index.html;
    try_files $uri $uri/ /index.html;
}
```

### 5. Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Verify Fix

1. Go to https://www.inkdapper.com
2. Open browser dev tools
3. Check Network tab - API calls should work
4. No more CORS errors

## If Still Not Working

### Emergency Fallback - Disable CORS Completely

If the above doesn't work, add this to your backend server.js at the very top:

```javascript
// EMERGENCY - Disable CORS completely
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});
```

## Expected Results

After deployment:
- ✅ No CORS errors in console
- ✅ API calls work properly
- ✅ Site loads without errors
- ✅ Health endpoint responds correctly

## Deploy NOW and Test!

This emergency fix will resolve your CORS issues immediately. Deploy these changes and your site should work properly.
