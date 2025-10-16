// Service Worker Cache Clear Script
// Run this in the browser console to clear service worker cache

console.log('🧹 Clearing Service Worker Cache...');

// Clear all caches
if ('caches' in window) {
  caches.keys().then((cacheNames) => {
    console.log('Found caches:', cacheNames);
    
    return Promise.all(
      cacheNames.map((cacheName) => {
        console.log('Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
  }).then(() => {
    console.log('✅ All caches cleared successfully!');
    
    // Unregister service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        console.log('Found service worker registrations:', registrations.length);
        
        return Promise.all(
          registrations.map((registration) => {
            console.log('Unregistering service worker:', registration.scope);
            return registration.unregister();
          })
        );
      }).then(() => {
        console.log('✅ All service workers unregistered!');
        console.log('🔄 Please refresh the page to re-register the service worker');
      });
    }
  });
} else {
  console.log('❌ Cache API not supported');
}

// Alternative method - clear localStorage and sessionStorage
console.log('🧹 Clearing localStorage and sessionStorage...');
localStorage.clear();
sessionStorage.clear();
console.log('✅ Storage cleared!');

console.log('🎯 Cache clearing complete! Please refresh the page.');
