@echo off
REM Deployment script for Inkdapper VPS (Windows Version)
REM This script will help deploy the CORS fixes to your VPS server

echo 🚀 Starting Inkdapper VPS Deployment...

REM Configuration - UPDATE THESE VALUES
set VPS_HOST=your-vps-ip-or-domain
set VPS_USER=your-username
set PROJECT_PATH=/path/to/your/project
set BACKUP_PATH=/path/to/backup

echo.
echo ⚠️  IMPORTANT: Please update the following variables in this script:
echo    VPS_HOST=%VPS_HOST%
echo    VPS_USER=%VPS_USER%
echo    PROJECT_PATH=%PROJECT_PATH%
echo    BACKUP_PATH=%BACKUP_PATH%
echo.

REM Check if SSH is available
echo Checking SSH connection...
ssh -o ConnectTimeout=10 -o BatchMode=yes %VPS_USER%@%VPS_HOST% exit 2>nul
if errorlevel 1 (
    echo ❌ SSH connection failed. Please check your SSH key and VPS credentials.
    pause
    exit /b 1
) else (
    echo ✅ SSH connection successful
)

echo.
echo 📦 Creating backup of current deployment...
ssh %VPS_USER%@%VPS_HOST% "mkdir -p %BACKUP_PATH%/$(date +%%Y%%m%%d_%%H%%M%%S)"
ssh %VPS_USER%@%VPS_HOST% "cp -r %PROJECT_PATH%/* %BACKUP_PATH%/$(date +%%Y%%m%%d_%%H%%M%%S)/"
echo ✅ Backup created successfully

echo.
echo 🔧 Deploying backend changes...
scp backend/server.js %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/backend/
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/backend && npm install"
echo ✅ Backend deployment completed

echo.
echo 🎨 Deploying frontend changes...
scp frontend/src/utils/axios.js %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/frontend/src/utils/
scp frontend/src/config/api.js %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/frontend/src/config/
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/frontend && npm run build"
echo ✅ Frontend deployment completed

echo.
echo 🔄 Restarting services...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/backend && pm2 restart server.js || pm2 start server.js"
ssh %VPS_USER%@%VPS_HOST% "sudo systemctl restart nginx"
echo ✅ Services restarted

echo.
echo 🧪 Testing deployment...
echo Testing CORS configuration...
curl -H "Origin: https://www.inkdapper.com" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS https://api.inkdapper.com/api/test

echo.
echo Testing actual API call...
curl -H "Origin: https://www.inkdapper.com" -H "Content-Type: application/json" https://api.inkdapper.com/api/test

echo.
echo 🎉 Deployment completed successfully!
echo.
echo 📋 Next steps:
echo    1. Test your website at https://www.inkdapper.com
echo    2. Check browser console for any remaining errors
echo    3. Monitor server logs: ssh %VPS_USER%@%VPS_HOST% "pm2 logs server.js"
echo.
pause
