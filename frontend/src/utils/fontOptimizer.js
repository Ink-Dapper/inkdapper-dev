// Font Optimization Utility
// Prevents font parsing errors and optimizes font loading

export const optimizeFonts = () => {
  console.log('🎨 Optimizing font loading...');

  // Remove any existing font preloads that might be causing issues
  const existingPreloads = document.querySelectorAll('link[rel="preload"][as="font"]');
  existingPreloads.forEach(link => {
    if (link.href.includes('custom-font') || link.href.includes('Outfit')) {
      console.log('🗑️ Removing problematic font preload:', link.href);
      link.remove();
    }
  });

  // Ensure Prata font loads correctly
  const prataFont = document.createElement('link');
  prataFont.rel = 'preload';
  prataFont.as = 'style';
  prataFont.href = 'https://fonts.googleapis.com/css2?family=Prata&display=swap';
  prataFont.onload = () => {
    prataFont.rel = 'stylesheet';
    console.log('✅ Prata font loaded successfully');
  };
  prataFont.onerror = () => {
    console.warn('⚠️ Prata font failed to load, using system fonts');
  };
  document.head.appendChild(prataFont);

  // Add font fallback optimization
  const style = document.createElement('style');
  style.textContent = `
    /* Font fallback optimization */
    * {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif !important;
    }
    
    .prata-regular {
      font-family: "Prata", Georgia, 'Times New Roman', serif !important;
    }
    
    /* Prevent font loading errors */
    @font-face {
      font-family: 'Fallback';
      src: local('Arial'), local('Helvetica');
      font-display: swap;
    }
  `;
  document.head.appendChild(style);

  console.log('✅ Font optimization complete');
};

export const detectFontErrors = () => {
  // Listen for font loading errors
  document.addEventListener('error', (event) => {
    if (event.target.tagName === 'LINK' && event.target.rel === 'stylesheet') {
      const href = event.target.href;
      if (href.includes('fonts.googleapis.com') || href.includes('font')) {
        console.error('❌ Font loading error:', href);
        // Remove the problematic font link
        event.target.remove();
        console.log('🗑️ Removed problematic font link');
      }
    }
  }, true);

  // Monitor font loading performance
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('✅ All fonts loaded successfully');
    }).catch((error) => {
      console.error('❌ Font loading error:', error);
    });
  }
};

export const preloadCriticalFonts = () => {
  // Only preload critical fonts that we know work
  const criticalFonts = [
    {
      href: 'https://fonts.googleapis.com/css2?family=Prata&display=swap',
      as: 'style'
    }
  ];

  criticalFonts.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = font.as;
    link.href = font.href;
    link.crossOrigin = 'anonymous';
    
    link.onload = () => {
      link.rel = 'stylesheet';
      console.log(`✅ Critical font loaded: ${font.href}`);
    };
    
    link.onerror = () => {
      console.warn(`⚠️ Critical font failed: ${font.href}`);
      link.remove();
    };
    
    document.head.appendChild(link);
  });
};

export default {
  optimizeFonts,
  detectFontErrors,
  preloadCriticalFonts
};
