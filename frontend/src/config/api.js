// API Configuration for different environments
const getApiConfig = () => {
  // Check if we're in development mode
  const isDevelopment = import.meta.env.DEV;
  
  // Production API URL - use same domain to avoid CORS issues
  const PRODUCTION_API_URL = 'https://www.inkdapper.com';
  
  // In development, use empty string to leverage Vite proxy
  // In production, use the full URL
  const apiUrl = import.meta.env.VITE_API_URL || 
                 (isDevelopment ? '' : PRODUCTION_API_URL);
  
  return {
    baseURL: apiUrl,
    isDevelopment,
    timeout: 15000, // 15 seconds timeout
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  };
};

export const apiConfig = getApiConfig();

// Export the configuration for use in other files
export default apiConfig;
