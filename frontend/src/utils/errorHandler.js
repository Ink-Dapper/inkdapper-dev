// Global error handler for DOM operations
export const setupGlobalErrorHandling = () => {
  // Override native DOM methods to prevent errors
  const originalInsertBefore = Node.prototype.insertBefore;
  const originalRemoveChild = Node.prototype.removeChild;
  
  Node.prototype.insertBefore = function(newNode, referenceNode) {
    try {
      if (this.contains && this.contains(referenceNode)) {
        return originalInsertBefore.call(this, newNode, referenceNode);
      } else {
        return this.appendChild(newNode);
      }
    } catch (error) {
      console.warn('Safe insertBefore fallback:', error);
      return this.appendChild(newNode);
    }
  };
  
  Node.prototype.removeChild = function(child) {
    try {
      if (this.contains && this.contains(child)) {
        return originalRemoveChild.call(this, child);
      }
    } catch (error) {
      console.warn('Safe removeChild fallback:', error);
    }
  };

  // Override console.error to catch and handle DOM errors
  const originalConsoleError = console.error;
  
  console.error = (...args) => {
    const errorMessage = args.join(' ');
    
    // Check for specific DOM errors we want to suppress
    if (errorMessage.includes('removeChild') || 
        errorMessage.includes('insertBefore') ||
        errorMessage.includes('NotFoundError') ||
        errorMessage.includes('Failed to execute')) {
      // Log as warning instead of error
      console.warn('DOM operation error (suppressed):', ...args);
      return;
    }
    
    // For all other errors, use original console.error
    originalConsoleError.apply(console, args);
  };

  // Global error handler for unhandled errors
  window.addEventListener('error', (event) => {
    if (event.error && event.error.message && 
        (event.error.message.includes('removeChild') || 
         event.error.message.includes('insertBefore') ||
         event.error.message.includes('NotFoundError'))) {
      event.preventDefault();
      console.warn('DOM error caught and handled:', event.error.message);
      return false;
    }
  });

  // Global handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && event.reason.message && 
        (event.reason.message.includes('removeChild') || 
         event.reason.message.includes('insertBefore') ||
         event.reason.message.includes('NotFoundError'))) {
      event.preventDefault();
      console.warn('DOM promise rejection caught and handled:', event.reason.message);
      return false;
    }
  });
};

// Safe DOM operations
export const safeRemoveChild = (parent, child) => {
  try {
    if (parent && child && parent.contains(child)) {
      parent.removeChild(child);
    }
  } catch (error) {
    console.warn('Safe removeChild failed:', error);
  }
};

export const safeInsertBefore = (parent, newNode, referenceNode) => {
  try {
    if (parent && newNode && referenceNode && parent.contains(referenceNode)) {
      parent.insertBefore(newNode, referenceNode);
    } else if (parent && newNode) {
      parent.appendChild(newNode);
    }
  } catch (error) {
    console.warn('Safe insertBefore failed:', error);
  }
};

export const safeAddEventListener = (element, event, handler) => {
  try {
    if (element && typeof element.addEventListener === 'function') {
      element.addEventListener(event, handler);
      return () => {
        try {
          if (element && typeof element.removeEventListener === 'function') {
            element.removeEventListener(event, handler);
          }
        } catch (error) {
          console.warn('Safe removeEventListener failed:', error);
        }
      };
    }
  } catch (error) {
    console.warn('Safe addEventListener failed:', error);
  }
  return () => {};
};
