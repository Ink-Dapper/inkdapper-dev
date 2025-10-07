@echo off
echo 🚨 EMERGENCY PRODUCTS FIX DEPLOYMENT
echo.

echo [1/4] EMERGENCY FIX APPLIED:
echo - Removed strict safety check from ProductItem
echo - Added fallback ID generation
echo - Removed product filtering from ShopContext
echo - Added debug logging
echo.

echo [2/4] Building frontend...
cd frontend
call pnpm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    pause
    exit /b 1
)
cd ..

echo [3/4] Frontend build successful!

echo [4/4] EMERGENCY DEPLOYMENT READY!
echo.

echo ========================================
echo EMERGENCY PRODUCTS FIX:
echo ========================================
echo.
echo PROBLEM:
echo - All products were hidden after safety check
echo - Products not showing on homepage/collection
echo.
echo EMERGENCY SOLUTION:
echo - Removed strict ID validation temporarily
echo - Added fallback ID generation
echo - Products should show again immediately
echo.
echo DEPLOYMENT STEPS:
echo 1. Upload updated files to VPS
echo 2. Deploy frontend build
echo 3. Test that products are showing
echo 4. Check browser console for debug logs
echo.
echo DEBUGGING:
echo - Check browser console for "ProductItem props" logs
echo - Look for "Raw products from API" logs
echo - Identify why _id might be missing
echo.
echo ========================================
echo.
echo [SUCCESS] Emergency fix ready for deployment!
echo.
echo This should immediately restore product visibility.
echo After deployment, check browser console for debugging info.
echo.
pause
