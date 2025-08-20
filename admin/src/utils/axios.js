import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  const isDevelopment = import.meta.env.DEV;
  const productionAPI = 'https://api.inkdapper.com';
  
  // In development, use proxy. In production, use full URL
  return isDevelopment ? '/api' : productionAPI;
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

// Add request interceptor to include token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    
    // Add device type header
    config.headers['X-Device-Type'] = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop';
    
    console.log('Admin making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Admin request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
instance.interceptors.response.use(
  (response) => {
    console.log('Admin response received from:', response.config.url);
    return response;
  },
  (error) => {
    console.error('Admin response error for:', error.config?.url);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Admin Response Error:', {
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
      console.error('Admin Request Error:', {
        message: error.message,
        code: error.code,
        url: error.config?.url,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Admin Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
