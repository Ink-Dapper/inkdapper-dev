import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
import wishlistRouter from './routes/wishlistRoute.js'
import reviewRouter from './routes/reviewRoute.js'
import couponRouter from './routes/couponRoute.js'
import bodyParser from 'body-parser';
import newsLetterRoute from './routes/newsLetterRoute.js'
import emailRouter from './routes/emailRoute.js'
import highlightedProductRouter from './routes/highlightedProductRoute.js'
import notificationRouter from './routes/notificationRoute.js'
import googleReviewRouter from './routes/googleReviewRoute.js'
import path from 'path'
import { fileURLToPath } from 'url'
import adminAuth from './middleware/adminAuth.js'

// App config
const app = express()
const port = process.env.PORT || 4000
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

connectDB()
connectCloudinary()

// EMERGENCY CORS FIX - Allow all origins
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'token', 
    'X-Requested-With', 
    'X-Device-Type',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200,
  preflightContinue: false
}

// middlewares
app.use(express.json())
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());

// Apply CORS FIRST
app.use(cors(corsOptions));

// EMERGENCY CORS HEADERS - Add to ALL responses
app.use((req, res, next) => {
  // Set CORS headers for ALL requests
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running with CORS fix',
    timestamp: new Date().toISOString(),
    cors: 'enabled'
  });
});

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.status(200).end();
});

// Your existing routes
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/review', reviewRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/newsletter', newsLetterRoute)
app.use('/api/email', emailRouter)
app.use('/api/highlighted-products', highlightedProductRouter)
app.use('/api/notification', notificationRouter)
app.use('/api/google-reviews', googleReviewRouter)

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port} with CORS fix`);
});
