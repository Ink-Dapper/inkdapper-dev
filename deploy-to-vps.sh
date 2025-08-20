#!/bin/bash

# Deployment script for Inkdapper VPS
# This script will help deploy the CORS fixes to your VPS server

echo "🚀 Starting Inkdapper VPS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
VPS_HOST="your-vps-ip-or-domain"
VPS_USER="your-username"
PROJECT_PATH="/path/to/your/project"
BACKUP_PATH="/path/to/backup"

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

# Check if SSH key is available
check_ssh() {
    print_status "Checking SSH connection..."
    if ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_HOST exit 2>/dev/null; then
        print_status "SSH connection successful"
    else
        print_error "SSH connection failed. Please check your SSH key and VPS credentials."
        exit 1
    fi
}

# Backup current deployment
backup_current() {
    print_status "Creating backup of current deployment..."
    ssh $VPS_USER@$VPS_HOST "mkdir -p $BACKUP_PATH/$(date +%Y%m%d_%H%M%S)"
    ssh $VPS_USER@$VPS_HOST "cp -r $PROJECT_PATH/* $BACKUP_PATH/$(date +%Y%m%d_%H%M%S)/"
    print_status "Backup created successfully"
}

# Deploy backend changes
deploy_backend() {
    print_status "Deploying backend changes..."
    
    # Copy updated server.js
    scp backend/server.js $VPS_USER@$VPS_HOST:$PROJECT_PATH/backend/
    
    # Install dependencies if needed
    ssh $VPS_USER@$VPS_HOST "cd $PROJECT_PATH/backend && npm install"
    
    print_status "Backend deployment completed"
}

# Deploy frontend changes
deploy_frontend() {
    print_status "Deploying frontend changes..."
    
    # Copy updated files
    scp frontend/src/utils/axios.js $VPS_USER@$VPS_HOST:$PROJECT_PATH/frontend/src/utils/
    scp frontend/src/config/api.js $VPS_USER@$VPS_HOST:$PROJECT_PATH/frontend/src/config/
    
    # Build frontend
    ssh $VPS_USER@$VPS_HOST "cd $PROJECT_PATH/frontend && npm run build"
    
    print_status "Frontend deployment completed"
}

# Restart services
restart_services() {
    print_status "Restarting services..."
    
    # Restart backend server (adjust based on your process manager)
    ssh $VPS_USER@$VPS_HOST "cd $PROJECT_PATH/backend && pm2 restart server.js || pm2 start server.js"
    
    # Restart nginx if using it
    ssh $VPS_USER@$VPS_HOST "sudo systemctl restart nginx"
    
    print_status "Services restarted"
}

# Test the deployment
test_deployment() {
    print_status "Testing deployment..."
    
    # Test CORS endpoints
    echo "Testing CORS configuration..."
    curl -H "Origin: https://www.inkdapper.com" \
         -H "Access-Control-Request-Method: GET" \
         -H "Access-Control-Request-Headers: Content-Type" \
         -X OPTIONS \
         https://api.inkdapper.com/api/test
    
    echo -e "\n\nTesting actual API call..."
    curl -H "Origin: https://www.inkdapper.com" \
         -H "Content-Type: application/json" \
         https://api.inkdapper.com/api/test
    
    print_status "Deployment testing completed"
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    # Check SSH connection
    check_ssh
    
    # Create backup
    backup_current
    
    # Deploy changes
    deploy_backend
    deploy_frontend
    
    # Restart services
    restart_services
    
    # Test deployment
    test_deployment
    
    print_status "🎉 Deployment completed successfully!"
    print_warning "Please update the VPS_HOST, VPS_USER, and PROJECT_PATH variables in this script before running."
}

# Run main function
main "$@"
