@echo off
echo 🚨 EMERGENCY CORS FIX DEPLOYMENT
echo.

echo [1/3] Backend CORS fix applied to server.js
echo.

echo [2/3] Building frontend...
cd frontend
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo [3/3] Frontend build successful!
echo.

echo ========================================
echo DEPLOYMENT INSTRUCTIONS:
echo ========================================
echo.
echo 1. Upload the updated backend/server.js to your VPS
echo 2. On VPS run: pm2 restart inkdapper-backend
echo 3. Test: curl https://api.inkdapper.com/health
echo 4. Check browser console for CORS errors
echo.
echo ========================================
echo.
echo [SUCCESS] CORS fix ready for deployment!
echo.
echo The backend/server.js has been updated with:
echo - Emergency CORS headers
echo - Allow all origins temporarily
echo - Proper preflight request handling
echo.
echo Deploy this to your VPS immediately!
echo.
pause
