#!/bin/bash

echo "🚨 EMERGENCY SERVER RESTART SCRIPT"
echo "=================================="
echo

echo "[1/5] Checking PM2 status..."
pm2 status
echo

echo "[2/5] Stopping all PM2 processes..."
pm2 stop all
echo

echo "[3/5] Starting backend server..."
pm2 start inkdapper-backend
echo

echo "[4/5] Checking server status..."
pm2 status
echo

echo "[5/5] Testing server health..."
echo "Testing localhost:4000..."
curl -s http://localhost:4000/health
echo
echo

echo "Testing api.inkdapper.com..."
curl -s https://api.inkdapper.com/health
echo
echo

echo "=================================="
echo "✅ Server restart complete!"
echo "Check the results above."
echo "If you still see 503 errors, check:"
echo "1. pm2 logs inkdapper-backend"
echo "2. sudo systemctl status nginx"
echo "3. sudo nginx -t"
echo "=================================="
