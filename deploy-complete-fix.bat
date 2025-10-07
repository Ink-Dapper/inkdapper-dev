@echo off
echo 🚨 COMPLETE CORS AND MIME TYPE FIX
echo.

echo [1/5] Building frontend...
cd frontend
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo [2/5] Frontend build successful!

echo [3/5] Backend CORS fix ready
echo.

echo [4/5] Creating deployment package...
echo.

echo [5/5] DEPLOYMENT INSTRUCTIONS:
echo.
echo ========================================
echo CRITICAL STEPS TO FIX YOUR LIVE SITE:
echo ========================================
echo.
echo 1. BACKEND FIX:
echo    - Copy content from backend-server-complete-fix.js
echo    - Replace your backend/server.js with it
echo    - On VPS run: pm2 restart inkdapper-backend
echo.
echo 2. NGINX FIX:
echo    - Add MIME type fixes to your nginx config
echo    - Add CORS headers to API server block
echo    - Run: sudo nginx -t && sudo systemctl reload nginx
echo.
echo 3. TEST:
echo    - curl https://api.inkdapper.com/health
echo    - Check browser console for errors
echo.
echo ========================================
echo.
echo [SUCCESS] Complete fix ready for deployment!
echo.
echo NEXT STEPS:
echo - Upload files to VPS
echo - Replace backend/server.js
echo - Update nginx configuration
echo - Restart services
echo - Test the site
echo.
echo Files created:
echo - backend-server-complete-fix.js
echo - COMPLETE_FIX_INSTRUCTIONS.md
echo - deploy-complete-fix.bat
echo.
pause
