#!/bin/bash

echo "🚨 COMPLETE SERVER RESTART - FIXING MOBILE ERRORS"
echo "================================================="
echo

echo "[1/6] Stopping all services..."
pm2 stop all
sudo systemctl stop nginx
echo "✅ Services stopped"
echo

echo "[2/6] Checking backend server status..."
pm2 status
echo

echo "[3/6] Starting backend server..."
pm2 start inkdapper-backend
sleep 3
echo "✅ Backend started"
echo

echo "[4/6] Checking backend health..."
curl -s http://localhost:4000/health
echo
echo

echo "[5/6] Starting nginx..."
sudo systemctl start nginx
sleep 2
echo "✅ Nginx started"
echo

echo "[6/6] Final status check..."
pm2 status
sudo systemctl status nginx --no-pager -l
echo

echo "================================================="
echo "🔍 TESTING ENDPOINTS:"
echo "================================================="

echo "Testing localhost:4000..."
curl -s -w "Status: %{http_code}\n" http://localhost:4000/health
echo

echo "Testing api.inkdapper.com..."
curl -s -w "Status: %{http_code}\n" https://api.inkdapper.com/health
echo

echo "Testing product list API..."
curl -s -w "Status: %{http_code}\n" https://api.inkdapper.com/api/product/list | head -c 100
echo "..."
echo

echo "================================================="
echo "✅ SERVER RESTART COMPLETE!"
echo "================================================="
echo
echo "If you still see errors:"
echo "1. Check pm2 logs: pm2 logs inkdapper-backend"
echo "2. Check nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "3. Check server resources: free -h && df -h"
echo
echo "For mobile testing:"
echo "1. Clear browser cache on mobile"
echo "2. Try incognito/private mode"
echo "3. Check network connectivity"
echo "================================================="
