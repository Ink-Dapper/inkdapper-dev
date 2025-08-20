// API Configuration for different environments
const getApiConfig = () => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Production API URL - replace with your actual VPS domain
  const PRODUCTION_API_URL = 'https://api.inkdapper.com';
  
  // In development, use relative URLs to leverage Vite proxy
  // In production, use the full URL
  const apiUrl = import.meta.env.VITE_API_URL || 
                 (isDevelopment ? '' : PRODUCTION_API_URL);
  
  return {
    baseURL: apiUrl,
    isDevelopment,
    timeout: 10000, // 10 seconds timeout
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  };
};

export const apiConfig = getApiConfig();

// Create axios instance with proper configuration
import axios from 'axios';
import { isMobile, isSlowConnection, checkNetworkConnectivity } from '../utils/mobileUtils';

const createApiInstance = () => {
  // Adjust timeout based on device and connection
  const timeout = isMobile() && isSlowConnection() ? 15000 : apiConfig.timeout;
  
  const instance = axios.create({
    baseURL: apiConfig.baseURL,
    timeout: timeout,
    headers: {
      'Content-Type': 'application/json',
      'X-Device-Type': isMobile() ? 'mobile' : 'desktop',
    },
  });

  // Request interceptor for retry logic
  instance.interceptors.request.use(
    (config) => {
      // Add retry count if not present
      if (!config.retryCount) {
        config.retryCount = 0;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor with retry logic and better error handling
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { config } = error;
      
      // Check network connectivity first
      if (!checkNetworkConnectivity()) {
        console.error('No internet connection detected');
        error.message = 'No internet connection. Please check your network and try again.';
        return Promise.reject(error);
      }
      
      // Retry logic for network errors
      if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response) {
        if (config.retryCount < apiConfig.retryAttempts) {
          config.retryCount += 1;
          
          // Exponential backoff with mobile-specific delays
          const delay = isMobile() ? 
            apiConfig.retryDelay * Math.pow(2, config.retryCount) : 
            apiConfig.retryDelay * config.retryCount;
          
          await new Promise(resolve => setTimeout(resolve, delay));
          
          return instance(config);
        }
      }

      // Enhanced error logging
      if (error.response) {
        console.error('API Response Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url,
        });
      } else if (error.request) {
        console.error('API Request Error:', {
          message: error.message,
          code: error.code,
          url: error.config?.url,
        });
      } else {
        console.error('API Error:', error.message);
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const apiInstance = createApiInstance();

export default apiInstance;
