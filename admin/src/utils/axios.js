import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // Allow environment variable override for testing
  if (import.meta.env.VITE_FORCE_API_URL) {
    console.log('Using forced API URL from environment variable:', import.meta.env.VITE_FORCE_API_URL);
    return import.meta.env.VITE_FORCE_API_URL;
  }
  
  const isDevelopment = import.meta.env.DEV;
  const productionAPI = 'https://api.inkdapper.com/api';
  
  // In development, hit local backend via Vite proxy (/api -> localhost:4000)
  // In production, talk directly to the API domain
  const baseURL = isDevelopment ? '/api' : productionAPI;
  
  return baseURL;
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
    config.headers['X-Device-Type'] = /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop';
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
