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
// bodyParser removed - using express.json() instead
import newsLetterRoute from './routes/newsLetterRoute.js'
import emailRouter from './routes/emailRoute.js'
import highlightedProductRouter from './routes/highlightedProductRoute.js'
import notificationRouter from './routes/notificationRoute.js'
// Google Reviews - Commented out
// import googleReviewRouter from './routes/googleReviewRoute.js'
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

// EMERGENCY CORS FIX - Allow specific origins with credentials
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://www.inkdapper.com',
      'https://inkdapper.com',
      'https://admin.inkdapper.com',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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

// Apply CORS first (before any other middleware)
app.use(cors(corsOptions));

// Body parsing middleware (single instance with proper limits)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// EMERGENCY CORS HEADERS - Add to ALL responses (Mobile Optimized)
app.use((req, res, next) => {
  // Set CORS headers for ALL requests
  const origin = req.headers.origin;
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  const allowedOrigins = [
    'https://www.inkdapper.com',
    'https://inkdapper.com',
    'https://admin.inkdapper.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ];
  
  // Mobile-friendly CORS handling
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (origin && !isMobile) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    // Default to main site for mobile or unknown origins
    res.header('Access-Control-Allow-Origin', 'https://www.inkdapper.com');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, token, X-Requested-With, X-Device-Type, Accept, Origin, Access-Control-Request-Method, Access-Control-Request-Headers, User-Agent');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400');
  
  // Additional headers for mobile
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  
  // Handle preflight requests immediately
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// Handle preflight requests explicitly
app.options('*', (req, res) => {
  res.status(200).end();
});


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      origin: req.headers.origin,
      allowed: true
    }
  });
});

// Request logging - can be enabled with DEBUG_LOGS=true environment variable
// To enable detailed request logging, set DEBUG_LOGS=true in your environment
if (process.env.DEBUG_LOGS === 'true') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
  });
}

// Set correct MIME type for JSX files and other assets
app.use((req, res, next) => {
  if (req.url.endsWith('.jsx')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.type('text/css');
  } else if (req.url.endsWith('.html')) {
    res.type('text/html');
  }
  next();
});

// Add security headers and fix MIME types
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Fix MIME types for JavaScript files
  if (req.path.endsWith('.jsx') || req.path.endsWith('.tsx') || req.path.endsWith('.mjs')) {
    res.header('Content-Type', 'application/javascript; charset=utf-8');
    console.log(`🔧 Global MIME fix: ${req.path} -> application/javascript`);
  } else if (req.path.endsWith('.js') && !req.path.endsWith('.json')) {
    res.header('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.endsWith('.ts')) {
    res.header('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path.includes('-') && req.path.includes('.js')) {
    // Handle chunk files like utils-L-DV3rNH.js
    res.header('Content-Type', 'application/javascript; charset=utf-8');
    console.log(`🔧 Chunk MIME fix: ${req.path} -> application/javascript`);
  }
  
  next();
});

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
    cors: 'CORS is properly configured',
    origin: req.headers.origin || 'No origin',
    mimeTypes: 'MIME types are properly configured for JSX/TSX files'
  });
});

// MIME type test endpoint
app.get('/api/mime-test', (req, res) => {
  res.json({
    success: true,
    message: 'MIME type configuration test',
    timestamp: new Date().toISOString(),
    headers: {
      'content-type': res.get('Content-Type'),
      'x-content-type-options': res.get('X-Content-Type-Options')
    }
  });
});

// POST method test endpoint
app.post('/api/post-test', (req, res) => {
  console.log('📝 POST test request received:', {
    method: req.method,
    body: req.body,
    headers: req.headers
  });
  
  res.json({
    success: true,
    message: 'POST method test successful',
    timestamp: new Date().toISOString(),
    receivedData: req.body
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

// Serve static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist'), {
    index: false,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
      } else if (path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        // Special handling for chunk files
        if (path.includes('-') && path.includes('.')) {
          console.log(`🔧 Chunk file detected: ${path} -> application/javascript`);
        }
      } else if (path.endsWith('.mjs')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.endsWith('.jsx')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.endsWith('.ts')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.endsWith('.tsx')) {
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (path.endsWith('.json')) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
      } else if (path.endsWith('.svg')) {
        res.setHeader('Content-Type', 'image/svg+xml; charset=utf-8');
      } else if (path.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
      } else if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
        res.setHeader('Content-Type', 'image/jpeg');
      } else if (path.endsWith('.webp')) {
        res.setHeader('Content-Type', 'image/webp');
      } else if (path.endsWith('.ico')) {
        res.setHeader('Content-Type', 'image/x-icon');
      } else if (path.endsWith('.woff2')) {
        res.setHeader('Content-Type', 'font/woff2');
      } else if (path.endsWith('.woff')) {
        res.setHeader('Content-Type', 'font/woff');
      } else if (path.endsWith('.ttf')) {
        res.setHeader('Content-Type', 'font/ttf');
      }
    }
  }));
  
  // Additional middleware to fix any remaining MIME type issues
  app.use((req, res, next) => {
    // Fix JSX/TSX files that might be served with wrong MIME type
    if (req.path.endsWith('.jsx') || req.path.endsWith('.tsx') || req.path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      console.log(`🔧 Fixed MIME type for ${req.path} -> application/javascript`);
    }
    // Fix JS files
    else if (req.path.endsWith('.js') && !req.path.endsWith('.json')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    // Fix module files
    else if (req.path.includes('modules') || req.path.includes('chunks')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
    next();
  });
}

// Request logging middleware for debugging
app.use('/api', (req, res, next) => {
  console.log('📝 API Request:', {
    method: req.method,
    url: req.url,
    path: req.path,
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      'origin': req.headers.origin,
      'user-agent': req.headers['user-agent']
    }
  });
  
  // Log specific login requests
  if (req.path === '/user/login' && req.method === 'POST') {
    console.log('🔍 LOGIN REQUEST DETECTED:', {
      method: req.method,
      path: req.path,
      body: req.body,
      url: req.url
    });
  }
  
  next();
});

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
app.use('/api/highlighted-products', highlightedProductRouter)
app.use('/api/notifications', notificationRouter)

// Catch-all route for debugging unmatched API routes
app.use('/api/*', (req, res) => {
  console.log('❌ UNMATCHED API ROUTE:', {
    method: req.method,
    url: req.url,
    path: req.path,
    body: req.body
  });
  res.status(404).json({
    success: false,
    message: 'API route not found',
    requestedPath: req.path,
    method: req.method
  });
});
// Google Reviews - Commented out
// app.use('/api/google-reviews', googleReviewRouter)

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

// Handle all other routes for SPA only in production
if (process.env.NODE_ENV === 'production') {
  // Serve SPA for all non-API routes
  app.get('*', (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({
        success: false,
        message: 'API route not found',
        path: req.path
      });
    }
    
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'), {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      message: 'CORS policy violation',
      error: 'Origin not allowed',
      requestedOrigin: req.headers.origin
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
    console.log(`CORS enabled for production domains`)
})
