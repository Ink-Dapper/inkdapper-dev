@echo off
echo 🔍 SERVER STATUS DIAGNOSIS
echo.

echo [1/4] Checking if backend server is accessible...
echo.

echo Testing localhost:4000...
curl -s http://localhost:4000/health
if %errorlevel% neq 0 (
    echo [ERROR] Backend server not responding on localhost:4000
) else (
    echo [SUCCESS] Backend server responding on localhost:4000
)

echo.
echo Testing api.inkdapper.com...
curl -s https://api.inkdapper.com/health
if %errorlevel% neq 0 (
    echo [ERROR] Backend server not responding on api.inkdapper.com
) else (
    echo [SUCCESS] Backend server responding on api.inkdapper.com
)

echo.
echo [2/4] Testing specific API endpoints...
echo.

echo Testing /api/product/list...
curl -s -o nul -w "%%{http_code}" https://api.inkdapper.com/api/product/list
echo.

echo Testing /api/review/get...
curl -s -o nul -w "%%{http_code}" https://api.inkdapper.com/api/review/get
echo.

echo [3/4] Diagnosis complete!
echo.

echo [4/4] RECOMMENDED ACTIONS:
echo.
echo If you see 503 errors:
echo 1. SSH into your VPS
echo 2. Run: pm2 status
echo 3. Run: pm2 restart inkdapper-backend
echo 4. Run: pm2 logs inkdapper-backend
echo.
echo If you see connection errors:
echo 1. Check if server is running: pm2 list
echo 2. Check nginx status: sudo systemctl status nginx
echo 3. Restart nginx: sudo systemctl restart nginx
echo.
echo ========================================
echo.
echo [SUCCESS] Diagnosis complete!
echo Check the results above and follow the recommended actions.
echo.
pause
