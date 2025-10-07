@echo off
echo 🔧 CREDENTIALS CORS FIX DEPLOYMENT
echo.

echo [1/3] Fixed CORS configuration for credentials
echo - Changed from wildcard '*' to specific origins
echo - Added proper origin handling for credentials
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
echo CREDENTIALS CORS FIX DEPLOYMENT:
echo ========================================
echo.
echo PROBLEM FIXED:
echo - Server was using Access-Control-Allow-Origin: *
echo - But frontend sends requests with credentials
echo - Browser blocks wildcard + credentials combination
echo.
echo SOLUTION APPLIED:
echo - Changed to specific origins instead of wildcard
echo - Added proper origin validation
echo - Maintains credentials support
echo.
echo DEPLOYMENT STEPS:
echo 1. Upload updated backend/server.js to VPS
echo 2. Run: pm2 restart inkdapper-backend
echo 3. Test: curl https://api.inkdapper.com/health
echo 4. Check browser console for CORS errors
echo.
echo ========================================
echo.
echo [SUCCESS] Credentials CORS fix ready!
echo.
echo This should resolve the specific error:
echo "Access-Control-Allow-Origin header must not be wildcard 
echo when credentials mode is 'include'"
echo.
pause
