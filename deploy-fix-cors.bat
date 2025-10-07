@echo off
echo 🚀 Starting InkDapper CORS Fix Deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Please run this script from the project root directory
    exit /b 1
)

echo [INFO] Building frontend...
cd frontend
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    exit /b 1
)
cd ..

echo [INFO] Backend CORS configuration updated
echo [INFO] Deployment files created:
echo   - nginx-inkdapper.conf
echo   - ecosystem.config.js
echo   - DEPLOYMENT_INSTRUCTIONS.md

echo.
echo [WARNING] Next steps for VPS deployment:
echo 1. Upload all files to your VPS
echo 2. Follow DEPLOYMENT_INSTRUCTIONS.md
echo 3. Update nginx configuration
echo 4. Restart services

echo.
echo [SUCCESS] CORS fix preparation complete! 🎉
pause
