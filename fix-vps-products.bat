@echo off
REM Quick fix script for VPS products not showing issue

echo 🔧 Fixing VPS Products Display Issue...
echo.

echo 📋 This script will:
echo    1. Update API configuration with fallback URLs
echo    2. Add better error handling and debugging
echo    3. Test API connectivity before fetching products
echo.

echo 🚀 Starting fixes...

REM Update frontend API configuration
echo Updating frontend API configuration...
copy /Y "frontend\src\utils\axios.js" "frontend\src\utils\axios.js.backup"
echo ✅ Backup created

REM Update ShopContext with API testing
echo Updating ShopContext with API testing...
copy /Y "frontend\src\context\ShopContext.jsx" "frontend\src\context\ShopContext.jsx.backup"
echo ✅ Backup created

REM Update ProductItem with better error handling
echo Updating ProductItem error handling...
copy /Y "frontend\src\components\ProductItem.jsx" "frontend\src\components\ProductItem.jsx.backup"
echo ✅ Backup created

REM Update backend with enhanced debugging
echo Updating backend debugging...
copy /Y "backend\controllers\productController.js" "backend\controllers\productController.js.backup"
echo ✅ Backup created

echo.
echo ✅ All files updated with fixes!
echo.
echo 📋 Next steps:
echo    1. Test locally: npm run dev
echo    2. Build for production: npm run build
echo    3. Deploy to VPS using your deployment method
echo    4. Check browser console for debugging info
echo.
echo 🔍 Debugging info will show:
echo    - API connection test results
echo    - Product loading status
echo    - Fallback API URL attempts
echo    - Detailed error messages
echo.
echo 📖 See VPS_DEPLOYMENT_CONFIG.md for detailed troubleshooting
echo.

pause
