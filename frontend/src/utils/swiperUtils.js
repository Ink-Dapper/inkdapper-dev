// Utility functions for Swiper initialization

/**
 * Ensures DOM is ready before Swiper initialization
 * @param {Function} callback - Function to call when DOM is ready
 * @param {number} delay - Additional delay in milliseconds (default: 100)
 */
export const ensureDOMReady = (callback, delay = 100) => {
  const checkDOM = () => {
    // Check if document is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(callback, delay);
      });
    } else {
      setTimeout(callback, delay);
    }
  };

  // Use requestAnimationFrame to ensure DOM is fully rendered
  requestAnimationFrame(checkDOM);
};

/**
 * Safely initializes Swiper with error handling
 * @param {Object} swiperInstance - Swiper instance
 * @param {Function} onSuccess - Success callback
 * @param {Function} onError - Error callback
 */
export const safeSwiperInit = (swiperInstance, onSuccess, onError) => {
  try {
    if (swiperInstance && swiperInstance.el) {
      // Check if element is in DOM
      if (document.contains(swiperInstance.el)) {
        onSuccess(swiperInstance);
      } else {
        console.warn('Swiper element not in DOM');
        if (onError) onError(new Error('Swiper element not in DOM'));
      }
    } else {
      console.warn('Invalid Swiper instance');
      if (onError) onError(new Error('Invalid Swiper instance'));
    }
  } catch (error) {
    console.warn('Error initializing Swiper:', error);
    if (onError) onError(error);
  }
};

/**
 * Checks if an element is properly mounted and visible
 * @param {Element} element - DOM element to check
 * @returns {boolean} - Whether element is ready for Swiper
 */
export const isElementReady = (element) => {
  if (!element) return false;
  
  try {
    // Check if element is in DOM
    if (!document.contains(element)) return false;
    
    // Check if element has dimensions
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return false;
    
    // Check if element is visible
    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') return false;
    
    return true;
  } catch (error) {
    console.warn('Error checking element readiness:', error);
    return false;
  }
};
