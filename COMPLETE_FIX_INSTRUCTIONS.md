# 🚨 COMPLETE FIX FOR CORS AND MIME TYPE ISSUES

## Current Problems:
1. **CORS**: Backend not sending CORS headers
2. **MIME Types**: Server serving JSX files with wrong MIME type
3. **Service Worker**: Loading but not fixing the issues

## IMMEDIATE FIX - Follow These Steps EXACTLY:

### STEP 1: Fix Backend Server (CRITICAL)

**Replace your entire `backend/server.js` with this code:**

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

// EMERGENCY CORS FIX - Allow all origins
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

// middlewares
app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running with CORS fix',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
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

### STEP 2: Deploy Backend Changes

```bash
# On your VPS server
cd /var/www/inkdapper-dev

# Stop the current server
pm2 stop inkdapper-backend

# Replace server.js with the code above
# (Copy and paste the entire code)

# Start the server
pm2 start inkdapper-backend

# Check status
pm2 status
```

### STEP 3: Fix Nginx Configuration (CRITICAL)

**Add this to your nginx configuration for the frontend:**

```nginx
# Add to your www.inkdapper.com server block
server {
    listen 443 ssl http2;
    server_name www.inkdapper.com inkdapper.com;
    
    # Your existing SSL configuration
    
    # Fix MIME types for JavaScript modules
    location ~* \.(js|mjs)$ {
        add_header Content-Type "application/javascript; charset=utf-8";
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Fix MIME types for CSS
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
}
```

### STEP 4: Fix API Server Nginx Configuration

**Add this to your api.inkdapper.com server block:**

```nginx
server {
    listen 443 ssl http2;
    server_name api.inkdapper.com;
    
    # Your existing SSL configuration
    
    # CORS headers for API
    location / {
        # CORS headers
        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        # Handle preflight requests
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
        
        # Proxy to Node.js backend
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### STEP 5: Reload Nginx

```bash
# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### STEP 6: Test the Fix

```bash
# Test backend health
curl https://api.inkdapper.com/health

# Test CORS
curl -H "Origin: https://www.inkdapper.com" \
     -H "Access-Control-Request-Method: GET" \
     -X OPTIONS \
     https://api.inkdapper.com/api/product/list
```

### STEP 7: Clear Browser Cache

1. Open browser dev tools
2. Right-click on refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+R

## Expected Results:

After following these steps:
- ✅ No CORS errors in console
- ✅ API calls work properly
- ✅ JavaScript modules load with correct MIME type
- ✅ Site loads without errors

## If Still Not Working:

### Emergency Fallback - Disable Service Worker

Add this to your frontend's `index.html`:

```html
<script>
// Disable service worker temporarily
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}
</script>
```

## Deploy These Changes NOW!

This comprehensive fix will resolve both CORS and MIME type issues. Follow the steps exactly and your site will work properly.
