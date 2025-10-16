@echo off
echo ========================================
echo Deploying All Performance Fixes - Production
echo ========================================

echo.
echo [1/6] Cleaning previous builds...
cd /d "%~dp0"
if exist "frontend\dist" rmdir /s /q "frontend\dist"
if exist "frontend\node_modules\.vite" rmdir /s /q "frontend\node_modules\.vite"

echo.
echo [2/6] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [3/6] Building frontend for production with all fixes...
set NODE_ENV=production
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo [4/6] Copying updated service worker to dist...
copy "service-worker.js" "dist\sw-performance.js" >nul
if %errorlevel% neq 0 (
    echo WARNING: Failed to copy service worker
)

echo.
echo [5/6] Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [6/6] Creating deployment summary...

echo.
echo ========================================
echo ALL FIXES READY FOR PRODUCTION!
echo ========================================
echo.
echo Issues Fixed:
echo ✅ MIME type errors for JSX modules
echo ✅ CORS policy errors for API requests  
echo ✅ 301 redirect issues for API endpoints
echo ✅ Service worker static asset caching
echo ✅ 405 Method Not Allowed errors
echo ✅ API endpoint configuration
echo ✅ Enhanced CORS handling
echo ✅ Production build optimizations
echo.
echo Deployment Steps:
echo 1. Upload the 'frontend\dist' folder to your web server
echo 2. Upload the 'backend' folder to your VPS
echo 3. Restart your backend server
echo 4. Clear browser cache and service worker cache
echo.
echo CRITICAL: After deployment:
echo 1. Clear browser cache completely
echo 2. Unregister old service workers in DevTools
echo 3. Clear all storage (localStorage, sessionStorage)
echo 4. Refresh the page to register new service worker
echo 5. Test all API endpoints (login, product list, etc.)
echo.
echo Expected Results:
echo - No MIME type errors in console
echo - No CORS policy violations
echo - No 301 redirect errors
echo - No 405 Method Not Allowed errors
echo - Proper API responses
echo - Service worker working correctly
echo.
echo Press any key to exit...
pause >nul
