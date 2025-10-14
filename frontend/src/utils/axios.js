import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  const isDevelopment = import.meta.env.DEV;
  
  // Check for environment variables first
  const envApiUrl = import.meta.env.VITE_API_URL;
  
  if (envApiUrl) {
    console.log('Using API URL from environment:', envApiUrl);
    return envApiUrl.endsWith('/api') ? envApiUrl : `${envApiUrl}/api`;
  }
  
  // Fallback URLs for production
  const productionAPIs = [
    'https://api.inkdapper.com',
    'https://www.inkdapper.com/api',
    'https://inkdapper.com/api',
    window.location.origin + '/api' // Same domain fallback
  ];
  
  if (isDevelopment) {
    // In development, use /api to leverage Vite proxy
    return '/api';
  } else {
    // In production, try the first production API
    console.log('Production mode - using API:', productionAPIs[0]);
    return `${productionAPIs[0]}/api`;
  }
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout (reduced from 15s for better UX)
  withCredentials: true, // Include credentials for CORS
  // Mobile-specific optimizations
  maxRedirects: 5,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.token = token; // Backend expects 'token' header, not 'Authorization'
    }
    
    // Add device type header
    config.headers['X-Device-Type'] = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop';
    
    // Add mobile-specific headers
    if (/Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
      config.headers['X-Mobile-Optimized'] = 'true';
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for better error handling
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      
      // Handle specific error cases
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      } else if (error.response.status === 403) {
        console.error('CORS or permission error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request Error:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      
      // Handle network errors with fallback API URLs
      if (!originalRequest._retry && !import.meta.env.DEV) {
        originalRequest._retry = true;
        
        // Try fallback API URLs
        const fallbackUrls = [
          'https://www.inkdapper.com/api',
          'https://inkdapper.com/api',
          window.location.origin + '/api'
        ];
        
        for (const fallbackUrl of fallbackUrls) {
          if (fallbackUrl !== originalRequest.baseURL) {
            try {
              console.log(`🔄 Trying fallback API: ${fallbackUrl}`);
              originalRequest.baseURL = fallbackUrl;
              return instance(originalRequest);
            } catch (fallbackError) {
              console.warn(`❌ Fallback ${fallbackUrl} also failed:`, fallbackError.message);
              continue;
            }
          }
        }
      }
      
      // Handle timeout errors specifically
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        console.warn(`Request to ${error.config?.url} timed out after ${error.config?.timeout}ms`);
      }
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance; 