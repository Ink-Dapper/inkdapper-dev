# Quick CORS Fix for Live Site

## Immediate Steps to Fix CORS Issues

### 1. Update Backend Server (Already Done)
The backend/server.js has been updated with enhanced CORS configuration.

### 2. Deploy Backend Changes
```bash
# On your VPS server
cd /var/www/inkdapper-dev

# Pull the latest changes
git pull origin main

# Restart the backend
pm2 restart inkdapper-backend

# Check if it's running
pm2 status
```

### 3. Test Backend Health
```bash
# Test the health endpoint
curl https://api.inkdapper.com/health

# Should return:
# {
#   "success": true,
#   "message": "Server is running",
#   "timestamp": "2024-01-XX...",
#   "environment": "production",
#   "cors": {
#     "origin": "https://www.inkdapper.com",
#     "allowed": true
#   }
# }
```

### 4. Update Nginx Configuration (If Using Nginx)
Add these lines to your nginx configuration for the API server:

```nginx
# Add to your api.inkdapper.com server block
location / {
    # CORS headers
    add_header Access-Control-Allow-Origin "https://www.inkdapper.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Handle preflight requests
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "https://www.inkdapper.com";
        add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD";
        add_header Access-Control-Allow-Headers "Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin";
        add_header Access-Control-Allow-Credentials "true";
        add_header Access-Control-Max-Age 86400;
        add_header Content-Length 0;
        add_header Content-Type text/plain;
        return 204;
    }
    
    # Your existing proxy configuration
    proxy_pass http://localhost:4000;
    # ... rest of your proxy config
}
```

### 5. Fix MIME Type Issues
Add this to your frontend nginx configuration:

```nginx
# Add to your www.inkdapper.com server block
location ~* \.(js|mjs)$ {
    add_header Content-Type "application/javascript; charset=utf-8";
}

location ~* \.css$ {
    add_header Content-Type "text/css; charset=utf-8";
}
```

### 6. Restart Services
```bash
# Restart nginx
sudo systemctl reload nginx

# Restart backend
pm2 restart inkdapper-backend
```

### 7. Verify Fix
1. Open browser dev tools
2. Go to https://www.inkdapper.com
3. Check Network tab - API calls should work
4. No more CORS errors in console

### 8. If Still Having Issues
Check these:
- Backend is running: `pm2 status`
- Backend logs: `pm2 logs inkdapper-backend`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Test health endpoint: `curl https://api.inkdapper.com/health`

## Emergency Fallback
If the above doesn't work, temporarily allow all origins in backend/server.js:

```javascript
// TEMPORARY - Replace corsOptions with:
const corsOptions = {
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With', 'X-Device-Type', 'Accept', 'Origin']
};
```

Then restart: `pm2 restart inkdapper-backend`
