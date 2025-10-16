@echo off
echo ========================================
echo Deploying Production Fixes - Ink Dapper
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
echo [4/5] Copying service worker to dist...
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
echo Production fixes ready for deployment!
echo ========================================
echo.
echo Issues Fixed:
echo - MIME type errors for JSX modules
echo - CORS policy errors for API requests  
echo - 301 redirect issues for API endpoints
echo - Service worker static asset caching
echo.
echo Next steps:
echo 1. Upload the 'frontend\dist' folder to your web server
echo 2. Upload the 'backend' folder to your VPS
echo 3. Restart your backend server
echo 4. Clear browser cache and test the fixes
echo.
echo Press any key to exit...
pause >nul
