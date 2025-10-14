# VPS Deployment Configuration Guide

## Issue: Products not showing on live VPS server

### Problem Analysis
The frontend is trying to connect to `https://api.inkdapper.com` but this might not be the correct URL for your VPS setup.

### Solutions

#### 1. Check Your Actual VPS API URL
Your VPS might be configured differently. Common configurations:

**Option A: API on same domain**
```
Frontend: https://www.inkdapper.com
API: https://www.inkdapper.com/api
```

**Option B: API on subdomain**
```
Frontend: https://www.inkdapper.com
API: https://api.inkdapper.com/api
```

**Option C: API on different port**
```
Frontend: https://www.inkdapper.com
API: https://www.inkdapper.com:4000/api
```

#### 2. Environment Variable Fix
Create a `.env.production` file in the frontend directory:

```bash
# For Option A (same domain)
VITE_API_URL=https://www.inkdapper.com

# For Option B (subdomain)
VITE_API_URL=https://api.inkdapper.com

# For Option C (different port)
VITE_API_URL=https://www.inkdapper.com:4000
```

#### 3. Test API Endpoints
Test these URLs in your browser or curl:

```bash
# Test basic connectivity
curl https://api.inkdapper.com/api/test

# Test product endpoint
curl https://api.inkdapper.com/api/product/list

# Alternative URLs to test
curl https://www.inkdapper.com/api/test
curl https://inkdapper.com/api/test
```

#### 4. Nginx Configuration Check
Make sure your Nginx is properly configured to proxy API requests:

```nginx
# Example Nginx configuration
server {
    listen 443 ssl;
    server_name www.inkdapper.com;
    
    # Frontend static files
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy
    location /api {
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

#### 5. Quick Fix Commands

**Step 1: Check if backend is running**
```bash
ssh your-vps-user@your-vps-ip
pm2 list
# or
ps aux | grep node
```

**Step 2: Check backend logs**
```bash
pm2 logs server.js
# or
tail -f /path/to/your/backend/logs/app.log
```

**Step 3: Test backend directly**
```bash
curl http://localhost:4000/api/test
curl http://localhost:4000/api/product/list
```

**Step 4: Check Nginx status**
```bash
sudo systemctl status nginx
sudo nginx -t
```

#### 6. Emergency Fallback
If nothing else works, temporarily modify the frontend to use the same domain:

1. Edit `frontend/src/utils/axios.js`
2. Change the production API URL to use the same domain:
```javascript
const productionAPI = window.location.origin; // Use same domain
```

#### 7. Debugging Steps
1. Open browser dev tools on your live site
2. Check Network tab for failed API requests
3. Look for CORS errors in Console
4. Check if the API endpoint is accessible directly

### Expected Console Output
When working correctly, you should see:
```
🔍 Testing API connection...
✅ API connection successful: {success: true, message: "Backend server is running!"}
🔄 Fetching products from API...
✅ Loaded X products from API
```

### Common Issues
1. **CORS errors**: Backend not configured for your domain
2. **404 errors**: API endpoint not accessible
3. **Timeout errors**: Backend not running or slow response
4. **SSL errors**: Certificate issues with API domain
