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

// CORS configuration
const corsOptions = {
  origin: [
    'https://www.inkdapper.com', 
    'https://inkdapper.com', 
    'https://admin.inkdapper.com', 
    'http://localhost:4000', 
    'http://localhost:5173', 
    'http://localhost:5174',
    // Add mobile-specific origins if needed
    /^https:\/\/.*\.inkdapper\.com$/,
    /^https:\/\/.*\.vercel\.app$/,
    /^https:\/\/.*\.netlify\.app$/
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'token', 'X-Requested-With', 'X-Device-Type'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
}

// middlewares
app.use(express.json())

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(bodyParser.json())

// Set correct MIME type for JSX files
app.use((req, res, next) => {
  if (req.url.endsWith('.jsx')) {
    res.type('application/javascript');
  }
  next();
});

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend server is running!',
    timestamp: new Date().toISOString()
  });
});

// Admin test endpoint
app.get('/api/admin/test', adminAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: 'Admin authentication is working!',
    userId: req.userId,
    timestamp: new Date().toISOString()
  });
});

// Newsletter test endpoint
app.get('/api/newsletter/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Newsletter API is working!',
    timestamp: new Date().toISOString()
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, '../frontend/dist'), {
  index: false,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)
app.use('/api/wishlist', wishlistRouter)
app.use('/api/review', reviewRouter)
app.use('/api/coupon', couponRouter)
app.use('/api/newsletter', newsLetterRoute)
app.use('/api/email', emailRouter)

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/robots.txt'), {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=3600'
      }
    });
});

// Serve main sitemap
app.get('/sitemap.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/sitemap.xml'), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
});

// Serve main pages sitemap
app.get('/sitemap-main.xml', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/sitemap-main.xml'), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
});

// Handle all other routes for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})
