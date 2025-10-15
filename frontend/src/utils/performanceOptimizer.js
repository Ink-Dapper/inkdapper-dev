// Enhanced Performance Optimizer
// This utility provides comprehensive performance optimizations

// Preload critical resources
export const preloadCriticalResources = () => {
  // Preload critical fonts - only Prata since we're using system fonts for body
  const fontPreloads = [
    'https://fonts.googleapis.com/css2?family=Prata&display=swap'
  ];

  fontPreloads.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = font;
    link.onload = () => {
      link.rel = 'stylesheet';
    };
    document.head.appendChild(link);
  });
};

// Optimize images with intersection observer
export const optimizeImages = () => {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  images.forEach(img => imageObserver.observe(img));
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

// Optimize scroll events
export const optimizeScrollEvents = () => {
  let ticking = false;
  
  const updateScrollPosition = () => {
    // Update scroll position for components that need it
    const scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-y', `${scrollY}px`);
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      requestAnimationFrame(updateScrollPosition);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestTick, { passive: true });
};

// Optimize resize events
export const optimizeResizeEvents = () => {
  const debouncedResize = debounce(() => {
    // Update viewport dimensions
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--vw', `${vw}px`);
  }, 100);

  window.addEventListener('resize', debouncedResize, { passive: true });
  debouncedResize(); // Initial call
};

// Prefetch routes on hover
export const prefetchRoutes = () => {
  const links = document.querySelectorAll('a[href^="/"]');
  
  const prefetchRoute = (href) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
  };

  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      prefetchRoute(link.href);
    }, { once: true });
  });
};

// Optimize animations for performance
export const optimizeAnimations = () => {
  // Reduce motion for users who prefer it
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
    document.documentElement.style.setProperty('--transition-duration', '0.01ms');
  }

  // Use transform and opacity for better performance
  const style = document.createElement('style');
  style.textContent = `
    .will-change-transform {
      will-change: transform;
    }
    .will-change-opacity {
      will-change: opacity;
    }
    .will-change-auto {
      will-change: auto;
    }
    .gpu-accelerated {
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
  `;
  document.head.appendChild(style);
};

// Memory management
export const optimizeMemory = () => {
  // Clean up unused event listeners periodically
  setInterval(() => {
    // Force garbage collection if available
    if (window.gc) {
      window.gc();
    }
  }, 30000); // Every 30 seconds
};

// Network optimization
export const optimizeNetwork = () => {
  // Preconnect to external domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.inkdapper.com'
  ];

  preconnectDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Critical CSS inlining
export const inlineCriticalCSS = () => {
  // This would typically be done at build time
  // For now, we'll ensure critical styles are loaded first
  const criticalStyles = `
    body { margin: 0; padding: 0; }
    .app-container { min-height: 100vh; }
    .loading { display: flex; justify-content: center; align-items: center; min-height: 200px; }
  `;
  
  const style = document.createElement('style');
  style.textContent = criticalStyles;
  document.head.insertBefore(style, document.head.firstChild);
};

// Service Worker optimization
export const optimizeServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Register service worker with performance optimizations
    navigator.serviceWorker.register('/sw-performance.js', {
      scope: '/',
      updateViaCache: 'none'
    }).then(registration => {
      console.log('Performance SW registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content is available, reload the page
            window.location.reload();
          }
        });
      });
    }).catch(error => {
      console.log('Performance SW registration failed:', error);
    });
  }
};

// Bundle analyzer (development only)
export const analyzeBundle = () => {
  if (process.env.NODE_ENV === 'development') {
    // This would integrate with webpack-bundle-analyzer or similar
    console.log('Bundle analysis available in development mode');
  }
};

// Initialize all performance optimizations
export const initPerformanceOptimizations = () => {
  // Critical optimizations that should run immediately
  inlineCriticalCSS();
  preloadCriticalResources();
  optimizeNetwork();
  
  // Optimizations that can run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImages();
      optimizeScrollEvents();
      optimizeResizeEvents();
      optimizeAnimations();
      prefetchRoutes();
      optimizeMemory();
      
      // Initialize lazy loading
      import('./lazyLoader').then(({ initLazyLoading }) => {
        initLazyLoading();
      });
    });
  } else {
    optimizeImages();
    optimizeScrollEvents();
    optimizeResizeEvents();
    optimizeAnimations();
    prefetchRoutes();
    optimizeMemory();
    
    // Initialize lazy loading
    import('./lazyLoader').then(({ initLazyLoading }) => {
      initLazyLoading();
    });
  }
  
  // Service worker optimization
  optimizeServiceWorker();
  
  console.log('🚀 Performance optimizations initialized (monitoring disabled)');
};

// Performance monitoring (disabled)
export const monitorPerformance = () => {
  // Performance monitoring disabled as requested
  return;
};

export default {
  initPerformanceOptimizations,
  monitorPerformance,
  debounce,
  throttle,
  optimizeImages,
  preloadCriticalResources
};