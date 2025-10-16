@echo off
echo ========================================
echo Fixing Performance Issues - Ink Dapper
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
echo [3/6] Building frontend with fixes...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Frontend build failed
    pause
    exit /b 1
)

echo.
echo [4/6] Copying service worker to dist...
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
echo Performance fixes applied successfully!
echo ========================================
echo.
echo Issues Fixed:
echo - MIME type errors for JSX modules
echo - CORS policy errors for API requests  
echo - 301 redirect issues for API endpoints
echo - Service worker static asset caching
echo.
echo Servers are starting up...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
