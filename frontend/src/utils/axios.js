import axios from 'axios';

// Determine the base URL based on environment
const normalizeBaseUrl = (url) => {
  if (!url) return null;

  const trimmed = url.trim();
  if (!trimmed) return null;

  // Ensure we have a protocol so axios doesn't treat it as relative
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  // Always append the /api prefix once
  return `${withProtocol.replace(/\/+$/, '')}/api`;
};

const getBaseURL = () => {
  const isDevelopment = import.meta.env.DEV;
  const envApiUrl = normalizeBaseUrl(import.meta.env.VITE_API_URL);
  const productionAPI = normalizeBaseUrl('https://api.inkdapper.com');

  if (isDevelopment) {
    return '/api';
  }

  // Prefer explicit env override when provided
  if (envApiUrl) {
    return envApiUrl;
  }

  return productionAPI;
};

const instance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000, // 15 seconds timeout
  withCredentials: true, // Include credentials for CORS
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