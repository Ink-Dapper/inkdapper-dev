// Mobile-specific utilities for better network handling

// Check if the device is mobile
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Check network connectivity
export const checkNetworkConnectivity = () => {
  return navigator.onLine;
};

// Get connection type if available
export const getConnectionType = () => {
  if ('connection' in navigator) {
    return navigator.connection.effectiveType || 'unknown';
  }
  return 'unknown';
};

// Check if connection is slow
export const isSlowConnection = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    return connection.effectiveType === 'slow-2g' || 
           connection.effectiveType === '2g' || 
           connection.effectiveType === '3g';
  }
  return false;
};

// Retry function with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Optimize image loading for mobile
export const optimizeImageForMobile = (imageUrl, width = 400) => {
  if (!imageUrl) return imageUrl;
  
  // If using a CDN that supports image optimization
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  
  return imageUrl;
};

// Debounce function for mobile performance
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for mobile performance
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Save data mode detection
export const isDataSaverMode = () => {
  if ('connection' in navigator) {
    return navigator.connection.saveData;
  }
  return false;
};

// Get device pixel ratio for responsive images
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

// Check if device supports touch
export const isTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Optimize API calls for mobile
export const createMobileOptimizedApiCall = (apiCall, options = {}) => {
  const {
    retryCount = 3,
    timeout = 10000,
    useCache = true,
    cacheTime = 5 * 60 * 1000 // 5 minutes
  } = options;

  return async (...args) => {
    // Check network connectivity
    if (!checkNetworkConnectivity()) {
      throw new Error('No internet connection');
    }

    // Use cache if available and enabled
    if (useCache && 'caches' in window) {
      const cacheKey = `api_${JSON.stringify(args)}`;
      const cachedResponse = sessionStorage.getItem(cacheKey);
      if (cachedResponse) {
        const { data, timestamp } = JSON.parse(cachedResponse);
        if (Date.now() - timestamp < cacheTime) {
          return data;
        }
      }
    }

    // Make API call with retry logic
    const result = await retryWithBackoff(
      () => apiCall(...args),
      retryCount,
      isSlowConnection() ? 2000 : 1000
    );

    // Cache the result
    if (useCache && 'caches' in window) {
      const cacheKey = `api_${JSON.stringify(args)}`;
      sessionStorage.setItem(cacheKey, JSON.stringify({
        data: result,
        timestamp: Date.now()
      }));
    }

    return result;
  };
};
