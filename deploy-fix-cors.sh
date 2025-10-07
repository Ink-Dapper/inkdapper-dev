#!/bin/bash

# InkDapper CORS and Deployment Fix Script
# This script fixes CORS issues and ensures proper deployment

echo "🚀 Starting InkDapper deployment fix..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Checking project structure..."

# 1. Fix Backend CORS Issues
print_status "Fixing backend CORS configuration..."

# Check if backend server.js exists
if [ -f "backend/server.js" ]; then
    print_status "Backend server.js found, CORS should be configured"
else
    print_error "Backend server.js not found!"
    exit 1
fi

# 2. Build Frontend
print_status "Building frontend..."
cd frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    pnpm install
fi

# Build the project
print_status "Building frontend for production..."
pnpm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build successful!"
else
    print_error "Frontend build failed!"
    exit 1
fi

cd ..

# 3. Build Backend
print_status "Building backend..."
cd backend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    pnpm install
fi

cd ..

# 4. Create Nginx Configuration for MIME Types
print_status "Creating Nginx configuration for proper MIME types..."

cat > nginx-inkdapper.conf << 'EOF'
# InkDapper Nginx Configuration
# This configuration fixes MIME type issues and CORS

server {
    listen 80;
    server_name www.inkdapper.com inkdapper.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.inkdapper.com inkdapper.com;
    
    # SSL Configuration (replace with your actual SSL paths)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # CORS headers for all responses
    add_header Access-Control-Allow-Origin "https://www.inkdapper.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Handle preflight requests
    location / {
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
        
        # Serve frontend files
        root /var/www/inkdapper-dev/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Proper MIME types for JavaScript modules
        location ~* \.(js|mjs)$ {
            add_header Content-Type "application/javascript; charset=utf-8";
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
        
        # Proper MIME types for CSS
        location ~* \.css$ {
            add_header Content-Type "text/css; charset=utf-8";
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
        
        # Proper MIME types for images
        location ~* \.(png|jpg|jpeg|gif|svg|webp|ico)$ {
            add_header Content-Type "image/$1";
            add_header Cache-Control "public, max-age=31536000, immutable";
        }
        
        # Gzip compression
        gzip on;
        gzip_vary on;
        gzip_min_length 1024;
        gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    }
}

# API Server Configuration
server {
    listen 80;
    server_name api.inkdapper.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.inkdapper.com;
    
    # SSL Configuration (replace with your actual SSL paths)
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # CORS headers for API
    add_header Access-Control-Allow-Origin "https://www.inkdapper.com" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin" always;
    add_header Access-Control-Allow-Credentials "true" always;
    
    # Handle preflight requests
    location / {
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
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

print_status "Nginx configuration created: nginx-inkdapper.conf"

# 5. Create PM2 Configuration
print_status "Creating PM2 configuration for backend..."

cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'inkdapper-backend',
    script: 'backend/server.js',
    cwd: '/var/www/inkdapper-dev',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
      DEBUG_LOGS: 'false'
    },
    error_file: './logs/backend-error.log',
    out_file: './logs/backend-out.log',
    log_file: './logs/backend-combined.log',
    time: true
  }]
};
EOF

print_status "PM2 configuration created: ecosystem.config.js"

# 6. Create deployment instructions
print_status "Creating deployment instructions..."

cat > DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# InkDapper Deployment Instructions

## CORS and MIME Type Fix Deployment

### 1. Backend Deployment
```bash
# Navigate to project directory
cd /var/www/inkdapper-dev

# Install dependencies
cd backend && pnpm install && cd ..

# Start backend with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save
pm2 startup
```

### 2. Frontend Deployment
```bash
# Build frontend
cd frontend && pnpm run build && cd ..

# Copy built files to web directory
sudo cp -r frontend/dist/* /var/www/html/
```

### 3. Nginx Configuration
```bash
# Copy nginx configuration
sudo cp nginx-inkdapper.conf /etc/nginx/sites-available/inkdapper

# Enable the site
sudo ln -s /etc/nginx/sites-available/inkdapper /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 4. SSL Certificate Setup
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d www.inkdapper.com -d inkdapper.com -d api.inkdapper.com
```

### 5. Verify Deployment
```bash
# Check backend health
curl https://api.inkdapper.com/health

# Check frontend
curl -I https://www.inkdapper.com

# Check CORS
curl -H "Origin: https://www.inkdapper.com" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.inkdapper.com/api/product/list
```

### 6. Troubleshooting
- Check PM2 logs: `pm2 logs inkdapper-backend`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Check backend logs: `tail -f logs/backend-combined.log`
- Test CORS: Use browser dev tools or curl commands above

### 7. Environment Variables
Make sure these are set in your production environment:
- NODE_ENV=production
- PORT=4000
- MONGODB_URI=your_mongodb_connection_string
- CLOUDINARY_CLOUD_NAME=your_cloudinary_name
- CLOUDINARY_API_KEY=your_cloudinary_key
- CLOUDINARY_API_SECRET=your_cloudinary_secret
EOF

print_status "Deployment instructions created: DEPLOYMENT_INSTRUCTIONS.md"

# 7. Create logs directory
mkdir -p logs

print_status "Created logs directory"

# 8. Final status
print_status "Deployment fix preparation complete!"
print_warning "Next steps:"
echo "1. Review and update nginx-inkdapper.conf with your SSL certificate paths"
echo "2. Follow the instructions in DEPLOYMENT_INSTRUCTIONS.md"
echo "3. Deploy to your VPS server"
echo "4. Test the health endpoint: https://api.inkdapper.com/health"

print_status "Script completed successfully! 🎉"
