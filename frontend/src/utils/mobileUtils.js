// Mobile-specific utilities for better mobile experience

// Detect mobile device
export const isMobile = () => {
  return /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Detect iOS
export const isIOS = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Detect Android
export const isAndroid = () => {
  return /Android/.test(navigator.userAgent);
};

// Fix mobile scrolling issues
export const fixMobileScrolling = () => {
  if (!isMobile()) return;

  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Fix iOS Safari viewport height issues
  if (isIOS()) {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  }

  // Prevent pull-to-refresh on mobile
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, { passive: false });

  let startY = 0;
  document.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    
    // Prevent pull-to-refresh when at top of page
    if (scrollTop === 0 && currentY > startY) {
      e.preventDefault();
    }
  }, { passive: false });

  // Fix Android Chrome address bar issues
  if (isAndroid()) {
    window.addEventListener('resize', () => {
      setTimeout(() => {
        window.scrollTo(0, 1);
        window.scrollTo(0, 0);
      }, 100);
    });
  }
};

// Optimize images for mobile
export const optimizeImagesForMobile = () => {
  if (!isMobile()) return;

  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Add loading="lazy" if not present
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding="async" if not present
    if (!img.hasAttribute('decoding')) {
      img.setAttribute('decoding', 'async');
    }
  });
};

// Initialize mobile optimizations
export const initMobileOptimizations = () => {
  if (!isMobile()) return;

  // Fix scrolling
  fixMobileScrolling();
  
  // Optimize images
  optimizeImagesForMobile();
  
  // Add mobile class to body
  document.body.classList.add('mobile-device');
  
  // Add platform-specific classes
  if (isIOS()) {
    document.body.classList.add('ios-device');
  } else if (isAndroid()) {
    document.body.classList.add('android-device');
  }
  
  console.log('📱 Mobile optimizations initialized');
};

// Network status detection
export const getNetworkStatus = () => {
  if (navigator.connection) {
    return {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    };
  }
  return null;
};

// Handle network changes
export const handleNetworkChange = (callback) => {
  if (navigator.connection) {
    navigator.connection.addEventListener('change', callback);
  }
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