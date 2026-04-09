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

  // Global error handler — log ALL unhandled errors so they appear in the
  // browser console and are not silently swallowed.
  window.addEventListener('error', (event) => {
    console.error('[Global error]', event.error || event.message, event);
  });

  // Global handler for unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled promise rejection]', event.reason);
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
