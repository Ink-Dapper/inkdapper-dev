@echo off
echo 🔧 ENVIRONMENT SETUP HELPER
echo.

echo This script will help you create a .env file for the backend.
echo.

cd backend

if exist .env (
    echo .env file already exists!
    echo.
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 (
        echo Keeping existing .env file.
        pause
        exit /b 0
    )
)

echo Creating .env file...
echo.

(
echo # MongoDB Configuration
echo # Replace with your MongoDB connection string
echo MONGODB_URI=mongodb://localhost:27017/inkdapper
echo.
echo # Cloudinary Configuration
echo CLOUDINARY_NAME=your_cloudinary_name
echo CLOUDINARY_API_KEY=your_api_key
echo CLOUDINARY_SECRET_KEY=your_secret_key
echo.
echo # JWT Secret
echo JWT_SECRET=your_jwt_secret_key_change_this
echo.
echo # Email Configuration
echo EMAIL_USER=inkdapper@gmail.com
echo EMAIL_PASS=gxnwydlhkxsxlemy
echo.
echo # Razorpay Configuration
echo RAZORPAY_KEY_ID=your_razorpay_key
echo RAZORPAY_KEY_SECRET=your_razorpay_secret
echo.
echo # Google Reviews API
echo GOOGLE_API_KEY=your_google_api_key
echo GOOGLE_PLACE_ID=your_google_place_id
echo.
echo # Server Configuration
echo PORT=4000
echo NODE_ENV=development
echo.
echo # Admin Credentials
echo ADMIN_EMAIL=admin@inkdapper.com
echo ADMIN_PASSWORD=your_admin_password
) > .env

echo ✅ .env file created successfully in backend folder!
echo.
echo ⚠️  IMPORTANT: Please edit backend/.env and update the following:
echo    1. MONGODB_URI - Your MongoDB connection string
echo    2. CLOUDINARY credentials
echo    3. JWT_SECRET - A secure random string
echo    4. RAZORPAY credentials
echo    5. GOOGLE_API_KEY and PLACE_ID
echo    6. ADMIN_PASSWORD - A secure password
echo.
echo 📝 For MongoDB Atlas:
echo    Use: mongodb+srv://username:password@cluster.mongodb.net/inkdapper
echo.
echo 📝 For Local MongoDB:
echo    Use: mongodb://localhost:27017/inkdapper
echo.
echo After updating .env, start the server with: node server.js
echo.
pause
