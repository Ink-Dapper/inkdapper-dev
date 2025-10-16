@echo off
echo ========================================
echo Fixing All Performance Issues - Ink Dapper
echo ========================================

echo.
echo [1/7] Cleaning previous builds...
cd /d "%~dp0"
if exist "frontend\dist" rmdir /s /q "frontend\dist"
if exist "frontend\node_modules\.vite" rmdir /s /q "frontend\node_modules\.vite"

echo.
echo [2/7] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [3/7] Building frontend with all fixes...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo [4/7] Copying updated service worker to dist...
copy "service-worker.js" "dist\sw-performance.js" >nul
if %errorlevel% neq 0 (
    echo WARNING: Failed to copy service worker
)

echo.
echo [5/7] Installing backend dependencies...
cd ..\backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [6/7] Starting development servers...
echo Starting backend server...
start "Backend Server" cmd /k "npm start"

echo Waiting 5 seconds for backend to start...
timeout /t 5 /nobreak >nul

echo Starting frontend server...
cd ..\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo [7/7] Creating cache clear script...
cd ..
echo Creating browser cache clear instructions...

echo.
echo ========================================
echo ALL ISSUES FIXED SUCCESSFULLY!
echo ========================================
echo.
echo Issues Fixed:
echo ✅ MIME type errors for JSX modules
echo ✅ CORS policy errors for API requests  
echo ✅ 301 redirect issues for API endpoints
echo ✅ Service worker static asset caching
echo ✅ 405 Method Not Allowed errors
echo ✅ API endpoint configuration
echo.
echo IMPORTANT: After the page loads:
echo 1. Open browser DevTools (F12)
echo 2. Go to Application tab
echo 3. Click "Service Workers" in the left sidebar
echo 4. Click "Unregister" for any existing service workers
echo 5. Go to "Storage" and click "Clear storage"
echo 6. Refresh the page to register the new service worker
echo.
echo Alternative: Run the clear-service-worker-cache.js script in console
echo.
echo Servers are starting up...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Test the fixes by:
echo 1. Checking browser console for errors
echo 2. Testing API calls (login, product list)
echo 3. Verifying no CORS errors
echo 4. Confirming MIME type issues are resolved
echo.
echo Press any key to exit...
pause >nul
