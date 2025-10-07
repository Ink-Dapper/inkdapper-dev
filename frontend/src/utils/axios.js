import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  const isDevelopment = import.meta.env.DEV;
  const productionAPI = 'https://api.inkdapper.com';
  
  // In development, use /api to leverage Vite proxy
  // In production, use full URL with /api
  return isDevelopment ? '/api' : `${productionAPI}/api`;
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout for mobile
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
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
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
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance; 