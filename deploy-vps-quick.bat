@echo off
echo 🚀 Quick VPS Deployment for CORS Fixes
echo.

REM Configuration - UPDATE THESE VALUES
set VPS_HOST=srv693737
set VPS_USER=root
set PROJECT_PATH=/var/www/inkdapper-dev

echo ⚠️  Deploying to: %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%
echo.

REM Step 1: Backup current server.js
echo 📦 Creating backup...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH% && cp backend/server.js backend/server.js.backup.$(date +%%Y%%m%%d_%%H%%M%%S)"

REM Step 2: Upload updated backend files
echo 🔧 Uploading backend changes...
scp backend/server.js %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/backend/

REM Step 3: Upload updated frontend files
echo 🎨 Uploading frontend changes...
scp frontend/src/utils/axios.js %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/frontend/src/utils/
scp frontend/src/config/api.js %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/frontend/src/config/
scp frontend/src/context/ShopContext.jsx %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/frontend/src/context/
scp frontend/src/components/NewsLetterBox.jsx %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/frontend/src/components/

REM Step 4: Upload updated admin files
echo 🔧 Uploading admin changes...
scp admin/src/utils/axios.js %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/admin/src/utils/
scp admin/src/App.jsx %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/admin/src/
scp admin/src/pages/Coupons.jsx %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/admin/src/pages/
scp admin/src/pages/NewsletterSubscribers.jsx %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/admin/src/pages/
scp admin/src/context/ShopContext.jsx %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/admin/src/context/
scp admin/src/context/NotificationContext.jsx %VPS_USER%@%VPS_HOST%:%PROJECT_PATH%/admin/src/context/

REM Step 5: Rebuild frontend
echo 🔨 Rebuilding frontend...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/frontend && pnpm run build"

REM Step 6: Rebuild admin
echo 🔨 Rebuilding admin...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/admin && pnpm run build"

REM Step 7: Restart backend server
echo 🔄 Restarting backend server...
ssh %VPS_USER%@%VPS_HOST% "cd %PROJECT_PATH%/backend && pm2 restart server.js"

REM Step 8: Test the deployment
echo 🧪 Testing deployment...
echo Testing CORS configuration for main site...
curl -H "Origin: https://www.inkdapper.com" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS https://api.inkdapper.com/api/test

echo.
echo Testing CORS configuration for admin panel...
curl -H "Origin: https://admin.inkdapper.com" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: Content-Type" -X OPTIONS https://api.inkdapper.com/api/test

echo.
echo Testing actual API call...
curl -H "Origin: https://www.inkdapper.com" -H "Content-Type: application/json" https://api.inkdapper.com/api/test

echo.
echo 🎉 Deployment completed!
echo.
echo 📋 Next steps:
echo    1. Test your main website at https://www.inkdapper.com
echo    2. Test your admin panel at https://admin.inkdapper.com
echo    3. Check browser console for any remaining errors
echo    4. Monitor server logs: ssh %VPS_USER%@%VPS_HOST% "pm2 logs server.js"
echo.
pause
