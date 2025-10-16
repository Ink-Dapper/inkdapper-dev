@echo off
echo ========================================
echo Fixing Service Worker CORS Issues
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
echo [3/6] Building frontend with service worker fixes...
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
echo [6/6] Starting development servers...
echo Starting backend server...
start "Backend Server" cmd /k "npm start"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ========================================
echo Service Worker CORS fixes applied!
echo ========================================
echo.
echo Changes Made:
echo - Updated service worker to use Network First strategy
echo - Fixed API endpoint caching to avoid CORS issues
echo - Updated cache version to force service worker update
echo - Removed problematic API pre-caching during install
echo.
echo IMPORTANT: After the page loads:
echo 1. Open browser DevTools (F12)
echo 2. Go to Application tab
echo 3. Click "Service Workers" in the left sidebar
echo 4. Click "Unregister" for any existing service workers
echo 5. Refresh the page to register the new service worker
echo.
echo Alternative: Run the clear-service-worker-cache.js script in console
echo.
echo Servers are starting up...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
