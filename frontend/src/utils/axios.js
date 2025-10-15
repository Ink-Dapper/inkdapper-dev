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
  
  if (isDevelopment) {
    // In development, use /api to leverage Vite proxy
    return '/api';
  }
  
  // Production: Prioritize same domain API (most reliable)
  const currentOrigin = window.location.origin;
  const hostname = window.location.hostname;
  
  // Always use same domain API for better CORS and reliability
  if (hostname.includes('inkdapper.com') || hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const sameDomainApi = `${currentOrigin}/api`;
    console.log('Production mode - using same domain API:', sameDomainApi);
    return sameDomainApi;
  }
  
  // Only fallback to external API if not on inkdapper domain
  console.log('Production mode - using external API (not on inkdapper domain)');
  return 'https://api.inkdapper.com/api';
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout for mobile networks
  withCredentials: true, // Include credentials for CORS
  // Mobile-specific optimizations
  maxRedirects: 3, // Reduced for mobile
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
  // Mobile network optimizations
  maxContentLength: 50 * 1024 * 1024, // 50MB
  maxBodyLength: 50 * 1024 * 1024, // 50MB
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.token = token; // Backend expects 'token' header, not 'Authorization'
    }
    
    // Detect mobile device
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    // Add device type header
    config.headers['X-Device-Type'] = isMobile ? 'mobile' : 'desktop';
    
    // Add mobile-specific headers
    if (isMobile) {
      config.headers['X-Mobile-Optimized'] = 'true';
      config.headers['X-Platform'] = isIOS ? 'ios' : isAndroid ? 'android' : 'mobile';
      
      // Mobile network optimizations
      if (isIOS) {
        config.headers['X-iOS-Optimized'] = 'true';
      }
      if (isAndroid) {
        config.headers['X-Android-Optimized'] = 'true';
      }
    }
    
    // Add connection info for mobile
    if (navigator.connection) {
      config.headers['X-Connection-Type'] = navigator.connection.effectiveType || 'unknown';
      config.headers['X-Connection-Speed'] = navigator.connection.downlink || 'unknown';
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
        status: error.response?.status,
      });
      
      // Handle specific error codes
      if (error.response?.status === 502) {
        console.error('❌ 502 Bad Gateway - API server may be down or misconfigured');
      }
      
      // Handle network errors with fallback API URLs
      if (!originalRequest._retry && !import.meta.env.DEV) {
        originalRequest._retry = true;
        
        // Try fallback API URLs - prioritize same domain and working endpoints
        const currentOrigin = window.location.origin;
        const fallbackUrls = [
          `${currentOrigin}/api`, // Same domain first (most reliable)
          'https://www.inkdapper.com/api', // Main site API
          'https://inkdapper.com/api' // Root domain API
          // Removed api.inkdapper.com due to CORS and 502 issues
        ];
        
        for (const fallbackUrl of fallbackUrls) {
          if (fallbackUrl !== originalRequest.baseURL) {
            try {
              console.log(`🔄 Trying fallback API: ${fallbackUrl}`);
              originalRequest.baseURL = fallbackUrl;
              // Add mobile-specific timeout for fallback
              if (/Mobile|Android|iPhone|iPad/.test(navigator.userAgent)) {
                originalRequest.timeout = 20000; // 20 seconds for mobile
              }
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