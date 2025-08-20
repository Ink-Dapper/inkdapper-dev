# CORS Fix for Inkdapper VPS Deployment

This document provides a comprehensive guide to fix the CORS (Cross-Origin Resource Sharing) issues you're experiencing with your Inkdapper application.

## Issues Identified

1. **CORS Policy Errors**: Frontend at `https://www.inkdapper.com` cannot access API at `https://api.inkdapper.com`
2. **MIME Type Errors**: JSX files being served with incorrect MIME type
3. **API Configuration Conflicts**: Multiple axios configurations causing conflicts

## Files Modified

### Backend Changes (`backend/server.js`)
- ✅ Enhanced CORS configuration with proper origin validation
- ✅ Added explicit preflight request handling
- ✅ Fixed MIME type headers for JSX/JS/CSS files
- ✅ Added security headers
- ✅ Improved error handling

### Frontend Changes
- ✅ **`frontend/src/utils/axios.js`**: Updated to use production API URL and proper CORS headers
- ✅ **`frontend/src/config/api.js`**: Simplified to avoid conflicts

## Quick Fix Instructions

### Option 1: Manual Deployment

1. **Update Backend Server**:
   ```bash
   # SSH into your VPS
   ssh your-username@your-vps-ip
   
   # Navigate to your project
   cd /path/to/your/project
   
   # Backup current server.js
   cp backend/server.js backend/server.js.backup
   
   # Update server.js with the new code (copy from this repo)
   # Then restart your server
   pm2 restart server.js
   ```

2. **Update Frontend**:
   ```bash
   # Update the axios configuration files
   # Then rebuild frontend
   cd frontend
   npm run build
   ```

### Option 2: Using the Deployment Script

1. **Update the deployment script**:
   ```bash
   # Edit deploy-to-vps.sh and update these variables:
   VPS_HOST="your-vps-ip-or-domain"
   VPS_USER="your-username"
   PROJECT_PATH="/path/to/your/project"
   BACKUP_PATH="/path/to/backup"
   ```

2. **Run the deployment script**:
   ```bash
   chmod +x deploy-to-vps.sh
   ./deploy-to-vps.sh
   ```

## Testing the Fix

### 1. Test CORS Configuration
```bash
# Test preflight request
curl -H "Origin: https://www.inkdapper.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.inkdapper.com/api/test

# Test actual API call
curl -H "Origin: https://www.inkdapper.com" \
     -H "Content-Type: application/json" \
     https://api.inkdapper.com/api/test
```

### 2. Test from Browser Console
```javascript
// Test in browser console at https://www.inkdapper.com
fetch('https://api.inkdapper.com/api/test', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

## Key Changes Explained

### 1. Enhanced CORS Configuration
```javascript
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'https://www.inkdapper.com', 
      'https://inkdapper.com',
      // ... other allowed origins
    ];
    
    const isAllowed = allowedOrigins.includes(origin) ||
                     /^https:\/\/.*\.inkdapper\.com$/.test(origin);
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours
}
```

### 2. Fixed MIME Types
```javascript
app.use((req, res, next) => {
  if (req.url.endsWith('.jsx')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.type('text/css');
  }
  next();
});
```

### 3. Unified API Configuration
```javascript
const getBaseURL = () => {
  const isDevelopment = import.meta.env.DEV;
  const productionAPI = 'https://api.inkdapper.com';
  
  return isDevelopment ? '/api' : productionAPI;
};
```

## Troubleshooting

### If CORS errors persist:

1. **Check server logs**:
   ```bash
   pm2 logs server.js
   ```

2. **Verify CORS headers**:
   ```bash
   curl -I -H "Origin: https://www.inkdapper.com" https://api.inkdapper.com/api/test
   ```

3. **Check nginx configuration** (if using nginx):
   ```bash
   # Make sure nginx isn't stripping CORS headers
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Common Issues:

1. **Server not restarting properly**: Check if PM2 is running the correct process
2. **Cache issues**: Clear browser cache and CDN cache
3. **DNS issues**: Verify domain resolution

## Security Considerations

- ✅ CORS is properly configured to only allow specific origins
- ✅ Security headers are added (X-Content-Type-Options, X-Frame-Options, etc.)
- ✅ Credentials are properly handled
- ✅ Error handling prevents information leakage

## Monitoring

After deployment, monitor these endpoints:
- `https://api.inkdapper.com/api/test` - Basic connectivity
- `https://api.inkdapper.com/api/product/list` - Product API
- `https://api.inkdapper.com/api/review/get` - Review API

## Support

If you continue to experience issues:

1. Check the server logs for detailed error messages
2. Verify your domain configuration
3. Test with the provided curl commands
4. Ensure your VPS firewall allows the necessary ports

---

**Note**: Make sure to test thoroughly in a staging environment before deploying to production.
