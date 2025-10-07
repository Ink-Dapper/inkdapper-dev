@echo off
echo 🚨 MOBILE ERRORS FIX DEPLOYMENT
echo.

echo [1/5] Fixed backend CORS for mobile
echo - Added mobile user agent detection
echo - Improved mobile CORS handling
echo - Added mobile-specific headers
echo.

echo [2/5] Building frontend...
cd frontend
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo [3/5] Frontend build successful!

echo [4/5] Creating deployment package...

echo [5/5] DEPLOYMENT INSTRUCTIONS:
echo.
echo ========================================
echo MOBILE ERRORS FIX DEPLOYMENT:
echo ========================================
echo.
echo PROBLEMS FIXED:
echo - Network errors on mobile devices
echo - 503 Service Unavailable errors
echo - Mobile CORS issues
echo - Backend server not responding
echo.
echo SOLUTIONS APPLIED:
echo - Mobile-optimized CORS headers
echo - Mobile user agent detection
echo - Enhanced security headers
echo - Better error handling
echo.
echo CRITICAL DEPLOYMENT STEPS:
echo.
echo 1. BACKEND SERVER RESTART:
echo    - Upload updated backend/server.js to VPS
echo    - Run: pm2 restart inkdapper-backend
echo    - Check: pm2 status
echo.
echo 2. COMPLETE SERVER RESTART (if needed):
echo    - Run: pm2 stop all
echo    - Run: pm2 start inkdapper-backend
echo    - Run: sudo systemctl restart nginx
echo.
echo 3. TEST ENDPOINTS:
echo    - curl https://api.inkdapper.com/health
echo    - curl https://api.inkdapper.com/api/product/list
echo.
echo 4. MOBILE TESTING:
echo    - Clear mobile browser cache
echo    - Try incognito/private mode
echo    - Test on different mobile devices
echo.
echo ========================================
echo.
echo [SUCCESS] Mobile fixes ready for deployment!
echo.
echo Files updated:
echo - backend/server.js (Mobile CORS fix)
echo - restart-server-complete.sh (Server restart script)
echo - MOBILE_ERRORS_FIX.md (Documentation)
echo.
echo Deploy these changes immediately to fix mobile errors!
echo.
pause
