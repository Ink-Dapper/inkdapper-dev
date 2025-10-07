@echo off
echo 🚨 EMERGENCY CORS FIX DEPLOYMENT
echo.

echo [1/4] Building frontend...
cd frontend
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo [2/4] Frontend build successful!

echo [3/4] Backend CORS fix ready
echo.
echo [4/4] DEPLOYMENT INSTRUCTIONS:
echo.
echo 1. Copy backend-server-emergency.js content
echo 2. Replace your backend/server.js with it
echo 3. On VPS run: pm2 restart inkdapper-backend
echo 4. Test: curl https://api.inkdapper.com/health
echo.
echo [SUCCESS] Emergency fix ready for deployment!
echo.
echo NEXT STEPS:
echo - Upload files to VPS
echo - Replace backend/server.js
echo - Restart backend server
echo - Test the site
echo.
pause
