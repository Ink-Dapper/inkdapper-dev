@echo off
echo ========================================
echo Deploying Service Worker CORS Fixes
echo ========================================

echo.
echo [1/5] Cleaning previous builds...
cd /d "%~dp0"
if exist "frontend\dist" rmdir /s /q "frontend\dist"
if exist "frontend\node_modules\.vite" rmdir /s /q "frontend\node_modules\.vite"

echo.
echo [2/5] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [3/5] Building frontend for production...
set NODE_ENV=production
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo [4/5] Copying updated service worker to dist...
copy "service-worker.js" "dist\sw-performance.js" >nul
if %errorlevel% neq 0 (
    echo WARNING: Failed to copy service worker
)

echo.
echo [5/5] Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Service Worker CORS fixes ready!
echo ========================================
echo.
echo Changes Made:
echo - Updated service worker to use Network First strategy
echo - Fixed API endpoint caching to avoid CORS issues
echo - Updated cache version to force service worker update
echo - Removed problematic API pre-caching during install
echo.
echo Deployment Steps:
echo 1. Upload the 'frontend\dist' folder to your web server
echo 2. Upload the 'backend' folder to your VPS
echo 3. Restart your backend server
echo 4. Clear browser cache and service worker cache
echo.
echo IMPORTANT: After deployment:
echo 1. Clear browser cache completely
echo 2. Unregister old service workers in DevTools
echo 3. Refresh the page to register new service worker
echo 4. Test API calls to ensure CORS issues are resolved
echo.
echo Press any key to exit...
pause >nul
