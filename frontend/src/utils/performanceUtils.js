// Performance monitoring and optimization utilities for mobile devices

// Performance metrics tracking
export const performanceMetrics = {
  pageLoadTime: 0,
  renderTime: 0,
  networkLatency: 0,
  memoryUsage: 0,
  frameRate: 0
};

// Track page load performance
export const trackPageLoad = () => {
  if (typeof window !== 'undefined' && window.performance) {
    const navigation = window.performance.getEntriesByType('navigation')[0];
    if (navigation) {
      performanceMetrics.pageLoadTime = navigation.loadEventEnd - navigation.fetchStart;
    }
  }
};

// Track render performance
export const trackRenderTime = (componentName, startTime) => {
  const endTime = performance.now();
  const renderTime = endTime - startTime;
  
  performanceMetrics.renderTime = renderTime;
  
  // Log slow renders for debugging
  if (renderTime > 100) {
    console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
  }
  
  return renderTime;
};

// Monitor memory usage
export const trackMemoryUsage = () => {
  if (typeof window !== 'undefined' && window.performance && window.performance.memory) {
    const memory = window.performance.memory;
    performanceMetrics.memoryUsage = memory.usedJSHeapSize / memory.totalJSHeapSize;
    
    // Warn if memory usage is high
    if (performanceMetrics.memoryUsage > 0.8) {
      console.warn('High memory usage detected:', performanceMetrics.memoryUsage);
    }
  }
};

// Monitor frame rate
export const trackFrameRate = () => {
  let frameCount = 0;
  let lastTime = performance.now();
  
  const countFrames = (currentTime) => {
    frameCount++;
    
    if (currentTime - lastTime >= 1000) {
      performanceMetrics.frameRate = frameCount;
      frameCount = 0;
      lastTime = currentTime;
      
      // Warn if frame rate is low
      if (performanceMetrics.frameRate < 30) {
        console.warn('Low frame rate detected:', performanceMetrics.frameRate);
      }
    }
    
    requestAnimationFrame(countFrames);
  };
  
  requestAnimationFrame(countFrames);
};

// Optimize images for mobile
export const optimizeImageForMobile = (imageUrl, options = {}) => {
  const {
    width = 400,
    quality = 'auto',
    format = 'auto'
  } = options;
  
  if (!imageUrl) return imageUrl;
  
  // If using Cloudinary
  if (imageUrl.includes('cloudinary.com')) {
    const transformations = `w_${width},q_${quality},f_${format}`;
    return imageUrl.replace('/upload/', `/upload/${transformations}/`);
  }
  
  // If using other CDNs, add appropriate transformations
  return imageUrl;
};

// Lazy load images with intersection observer
export const createLazyImageLoader = () => {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        
        if (src) {
          img.src = src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });
  
  return imageObserver;
};

// Debounce function for performance
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function for performance
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

// Virtual scrolling for large lists
export const createVirtualScroller = (containerHeight, itemHeight, totalItems) => {
  const visibleItems = Math.ceil(containerHeight / itemHeight);
  const buffer = Math.min(5, Math.floor(visibleItems / 2));
  
  return {
    getVisibleRange: (scrollTop) => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
      const endIndex = Math.min(totalItems, startIndex + visibleItems + buffer * 2);
      
      return { startIndex, endIndex };
    },
    getTotalHeight: () => totalItems * itemHeight,
    getOffsetY: (index) => index * itemHeight
  };
};

// Preload critical resources
export const preloadCriticalResources = (resources) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = resource.type;
    if (resource.crossOrigin) {
      link.crossOrigin = resource.crossOrigin;
    }
    document.head.appendChild(link);
  });
};

// Service Worker registration for caching
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Performance budget monitoring
export const checkPerformanceBudget = () => {
  const budget = {
    pageLoadTime: 3000, // 3 seconds
    renderTime: 100,    // 100ms
    memoryUsage: 0.8,   // 80%
    frameRate: 30       // 30 FPS
  };
  
  const violations = [];
  
  if (performanceMetrics.pageLoadTime > budget.pageLoadTime) {
    violations.push(`Page load time exceeded: ${performanceMetrics.pageLoadTime}ms`);
  }
  
  if (performanceMetrics.renderTime > budget.renderTime) {
    violations.push(`Render time exceeded: ${performanceMetrics.renderTime}ms`);
  }
  
  if (performanceMetrics.memoryUsage > budget.memoryUsage) {
    violations.push(`Memory usage exceeded: ${(performanceMetrics.memoryUsage * 100).toFixed(1)}%`);
  }
  
  if (performanceMetrics.frameRate < budget.frameRate) {
    violations.push(`Frame rate below threshold: ${performanceMetrics.frameRate} FPS`);
  }
  
  if (violations.length > 0) {
    console.warn('Performance budget violations:', violations);
  }
  
  return violations;
};

// Initialize performance monitoring
export const initPerformanceMonitoring = () => {
  // Track page load
  if (document.readyState === 'complete') {
    trackPageLoad();
  } else {
    window.addEventListener('load', trackPageLoad);
  }
  
  // Track memory usage periodically
  setInterval(trackMemoryUsage, 30000); // Every 30 seconds
  
  // Start frame rate monitoring
  trackFrameRate();
  
  // Check performance budget periodically
  setInterval(checkPerformanceBudget, 60000); // Every minute
};

export default {
  performanceMetrics,
  trackPageLoad,
  trackRenderTime,
  trackMemoryUsage,
  trackFrameRate,
  optimizeImageForMobile,
  createLazyImageLoader,
  debounce,
  throttle,
  createVirtualScroller,
  preloadCriticalResources,
  registerServiceWorker,
  checkPerformanceBudget,
  initPerformanceMonitoring
};
