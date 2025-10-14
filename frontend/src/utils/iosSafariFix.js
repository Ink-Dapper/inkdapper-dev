// iOS Safari specific fixes and optimizations

// Fix for iOS Safari viewport issues
export const fixIOSViewport = () => {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Fix for iOS Safari viewport height issues
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial viewport height
    setViewportHeight();

    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 100);
    });

    // Update on resize
    window.addEventListener('resize', setViewportHeight);
  }
};

// Fix for iOS Safari scroll issues
export const fixIOSScroll = () => {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Prevent iOS Safari from bouncing
    document.addEventListener('touchmove', (e) => {
      if (e.target.closest('.scrollable')) {
        return;
      }
      e.preventDefault();
    }, { passive: false });

    // Fix for iOS Safari scroll position
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        // Force scroll position to be maintained
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        sessionStorage.setItem('scrollPosition', scrollTop.toString());
      }, 100);
    });
  }
};

// Fix for iOS Safari input issues
export const fixIOSInputs = () => {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Fix for iOS Safari input zoom
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        // Prevent zoom on focus
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
        }
      });

      input.addEventListener('blur', () => {
        // Restore normal viewport
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        }
      });
    });
  }
};

// Fix for iOS Safari network issues
export const fixIOSNetwork = () => {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Handle network state changes
    const handleNetworkChange = () => {
      if (navigator.onLine) {
        // Connection restored
        document.body.classList.remove('offline');
        document.body.classList.add('online');
      } else {
        // Connection lost
        document.body.classList.remove('online');
        document.body.classList.add('offline');
      }
    };

    window.addEventListener('online', handleNetworkChange);
    window.addEventListener('offline', handleNetworkChange);

    // Initial check
    handleNetworkChange();
  }
};

// Fix for iOS Safari memory issues
export const fixIOSMemory = () => {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    // Clean up unused resources
    const cleanup = () => {
      // Remove unused event listeners
      const unusedElements = document.querySelectorAll('[data-cleanup="true"]');
      unusedElements.forEach(element => {
        element.remove();
      });
    };

    // Clean up every 30 seconds
    setInterval(cleanup, 30000);

    // Clean up on page unload
    window.addEventListener('beforeunload', cleanup);
  }
};

// Initialize all iOS Safari fixes
export const initIOSFixes = () => {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    fixIOSViewport();
    fixIOSScroll();
    fixIOSInputs();
    fixIOSNetwork();
    fixIOSMemory();
  }
};

// CSS for iOS Safari fixes
export const addIOSStyles = () => {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const style = document.createElement('style');
    style.textContent = `
      /* iOS Safari specific styles */
      .ios-scroll-fix {
        -webkit-overflow-scrolling: touch;
        overflow-y: auto;
      }
      
      .ios-input-fix {
        font-size: 16px !important;
        -webkit-appearance: none;
        border-radius: 0;
      }
      
      .ios-button-fix {
        -webkit-appearance: none;
        border-radius: 0;
        touch-action: manipulation;
      }
      
      .ios-image-fix {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
      
      /* Prevent iOS Safari from bouncing */
      body.ios-no-bounce {
        position: fixed;
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
      
      .ios-scroll-container {
        position: relative;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        height: 100vh;
        height: -webkit-fill-available;
      }
    `;
    document.head.appendChild(style);
  }
};
