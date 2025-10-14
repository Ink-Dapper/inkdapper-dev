# 🔧 MongoDB Connection Fix

## Problem:
MongoDB connection error: `ECONNREFUSED _mongodb._tcp.cluster0.z3w8r.mongodb.net`

This error occurs because:
1. The `.env` file is missing or not configured
2. MongoDB connection string is incorrect
3. MongoDB Atlas credentials are invalid

## Solution:

### Step 1: Create `.env` File in Backend Folder

Create a file named `.env` in the `backend` folder with the following content:

```env
# MongoDB Configuration
# Option 1: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://username:password@cluster0.z3w8r.mongodb.net/inkdapper?retryWrites=true&w=majority

# Option 2: Local MongoDB (if running locally)
# MONGODB_URI=mongodb://localhost:27017/inkdapper

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key

# Email Configuration
EMAIL_USER=inkdapper@gmail.com
EMAIL_PASS=gxnwydlhkxsxlemy

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Google Reviews API
GOOGLE_API_KEY=your_google_api_key
GOOGLE_PLACE_ID=your_google_place_id

# Server Configuration
PORT=4000
NODE_ENV=development

# Admin Credentials
ADMIN_EMAIL=admin@inkdapper.com
ADMIN_PASSWORD=your_admin_password
```

### Step 2: Configure MongoDB URI

#### For MongoDB Atlas (Cloud):
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Log in to your account
3. Click on "Connect" for your cluster
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<username>`, `<password>`, and database name
7. Paste in `.env` file as `MONGODB_URI`

#### For Local MongoDB:
1. Install MongoDB locally
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # Linux/Mac
   sudo systemctl start mongod
   ```
3. Use: `MONGODB_URI=mongodb://localhost:27017/inkdapper`

### Step 3: Restart the Server

```bash
cd backend
node server.js
```

## What Was Fixed:

### Updated `backend/config/mongodb.js`:
- ✅ Better error handling
- ✅ Fallback to localhost if cloud connection fails
- ✅ Faster timeout (5s instead of 30s)
- ✅ Better logging for debugging
- ✅ Connection event handlers

### Features:
1. **Auto-fallback**: If cloud MongoDB fails, tries localhost
2. **Better errors**: Clear error messages
3. **Quick timeout**: Won't hang for 30 seconds
4. **Event logging**: Connection status updates

## Testing:

### Test Cloud MongoDB:
```bash
cd backend
node server.js
```

Should see:
```
Attempting to connect to MongoDB...
MongoDB connected successfully
MongoDB connection established
Server running on port 4000
```

### Test Local MongoDB:
If cloud fails, it automatically tries localhost:
```
MongoDB connection failed: ...
Falling back to localhost...
Connected to local MongoDB
```

## Common Issues:

### 1. Network Error
**Problem**: Can't reach MongoDB Atlas
**Solution**: 
- Check internet connection
- Verify IP whitelist in MongoDB Atlas
- Add 0.0.0.0/0 to allow all IPs (for testing)

### 2. Authentication Failed
**Problem**: Invalid credentials
**Solution**:
- Verify username and password
- Check if database user exists
- Ensure user has read/write permissions

### 3. Database Not Found
**Problem**: Database name doesn't exist
**Solution**:
- MongoDB creates database automatically
- Just ensure name is correct in URI

## Quick Fix Commands:

### For Development (Local MongoDB):
```bash
# Install MongoDB locally
# Windows: Download from mongodb.com
# Ubuntu: sudo apt-get install mongodb
# Mac: brew install mongodb-community

# Start MongoDB
# Windows: net start MongoDB
# Linux/Mac: sudo systemctl start mongod

# Create .env with local URI
echo "MONGODB_URI=mongodb://localhost:27017/inkdapper" > backend/.env
```

### For Production (MongoDB Atlas):
```bash
# Add your MongoDB Atlas URI to .env
echo "MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/inkdapper" > backend/.env
```

## Expected Results:
- ✅ No more ECONNREFUSED errors
- ✅ MongoDB connects successfully
- ✅ Server starts without errors
- ✅ Fallback to localhost if needed
