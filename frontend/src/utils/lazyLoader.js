// Enhanced Lazy Loading Utility
// Provides intersection observer-based lazy loading with performance optimizations

class LazyLoader {
  constructor(options = {}) {
    this.options = {
      root: null,
      rootMargin: '50px 0px',
      threshold: 0.01,
      loadingClass: 'lazy-loading',
      loadedClass: 'lazy-loaded',
      errorClass: 'lazy-error',
      ...options
    };
    
    this.observer = null;
    this.elements = new Set();
    this.init();
  }

  init() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.options
      );
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadAll();
    }
  }

  observe(element) {
    if (!element) return;
    
    this.elements.add(element);
    
    if (this.observer) {
      this.observer.observe(element);
    } else {
      this.loadElement(element);
    }
  }

  unobserve(element) {
    if (!element) return;
    
    this.elements.delete(element);
    
    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.loadElement(entry.target);
        this.unobserve(entry.target);
      }
    });
  }

  loadElement(element) {
    const src = element.dataset.src;
    const srcset = element.dataset.srcset;
    
    if (!src) return;

    // Add loading class
    element.classList.add(this.options.loadingClass);

    // Create new element to preload
    const newElement = element.cloneNode();
    newElement.src = src;
    if (srcset) newElement.srcset = srcset;
    newElement.classList.remove(this.options.loadingClass);
    newElement.classList.add(this.options.loadedClass);

    // Handle load event
    newElement.addEventListener('load', () => {
      // Replace element
      element.parentNode.replaceChild(newElement, element);
      
      // Trigger custom event
      const event = new CustomEvent('lazyloaded', {
        detail: { element: newElement }
      });
      document.dispatchEvent(event);
    });

    // Handle error event
    newElement.addEventListener('error', () => {
      element.classList.add(this.options.errorClass);
      
      // Trigger custom event
      const event = new CustomEvent('lazyerror', {
        detail: { element }
      });
      document.dispatchEvent(event);
    });
  }

  loadAll() {
    this.elements.forEach(element => {
      this.loadElement(element);
    });
    this.elements.clear();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.elements.clear();
  }
}

// Global lazy loader instance
let globalLazyLoader = null;

export const initLazyLoader = (options) => {
  if (!globalLazyLoader) {
    globalLazyLoader = new LazyLoader(options);
  }
  return globalLazyLoader;
};

export const lazyLoad = (selector, options) => {
  const loader = initLazyLoader(options);
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    loader.observe(element);
  });
  
  return loader;
};

// React hook for lazy loading
export const useLazyLoad = (ref, options = {}) => {
  useEffect(() => {
    if (ref.current) {
      const loader = initLazyLoader(options);
      loader.observe(ref.current);
      
      return () => {
        loader.unobserve(ref.current);
      };
    }
  }, [ref, options]);
};

// Preload critical resources
export const preloadResource = (href, as, type = null) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  
  document.head.appendChild(link);
  
  return link;
};

// Prefetch resources
export const prefetchResource = (href, as = 'script') => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  link.as = as;
  
  document.head.appendChild(link);
  
  return link;
};

// Preconnect to external domains
export const preconnectDomain = (href, crossorigin = true) => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = href;
  if (crossorigin) link.crossOrigin = 'anonymous';
  
  document.head.appendChild(link);
  
  return link;
};

// Resource hints for performance
export const addResourceHints = () => {
  // Preconnect to external domains
  preconnectDomain('https://fonts.googleapis.com');
  preconnectDomain('https://fonts.gstatic.com');
  
  // DNS prefetch for external resources
  const dnsPrefetchDomains = [
    'https://api.inkdapper.com',
    'https://www.inkdapper.com'
  ];
  
  dnsPrefetchDomains.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
};

// Initialize lazy loading on page load
export const initLazyLoading = () => {
  // Add resource hints
  addResourceHints();
  
  // Initialize lazy loader
  const loader = initLazyLoader({
    rootMargin: '100px 0px',
    threshold: 0.01
  });
  
  // Auto-observe all lazy elements
  lazyLoad('[data-src]', { loader });
  
  console.log('🚀 Lazy loading initialized');
};

export default {
  LazyLoader,
  initLazyLoader,
  lazyLoad,
  useLazyLoad,
  preloadResource,
  prefetchResource,
  preconnectDomain,
  addResourceHints,
  initLazyLoading
};
