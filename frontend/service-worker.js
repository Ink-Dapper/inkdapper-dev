// Enhanced Performance Service Worker
// Provides aggressive caching and performance optimizations

const CACHE_NAME = 'inkdapper-performance-v2';
const STATIC_CACHE = 'inkdapper-static-v2';
const DYNAMIC_CACHE = 'inkdapper-dynamic-v2';
const API_CACHE = 'inkdapper-api-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/sitemap-main.xml',
  '/ink_dapper_logo.svg',
  '/ink_dapper_logo_white.svg',
  '/white-mini.svg',
  '/vite.svg'
];

// API endpoints to cache - use relative paths to avoid CORS
const API_ENDPOINTS = [
  '/api/test',
  '/api/product/list',
  '/api/banner-list'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Performance SW: Installing...');
  
  event.waitUntil(
    Promise.all([
      // Cache static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Performance SW: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Cache API endpoints - skip during install to avoid CORS issues
      caches.open(API_CACHE).then((cache) => {
        console.log('Performance SW: API cache initialized (will cache on first request)');
        return Promise.resolve();
      })
    ]).then(() => {
      console.log('Performance SW: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Performance SW: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && 
              cacheName !== DYNAMIC_CACHE && 
              cacheName !== API_CACHE &&
              cacheName !== CACHE_NAME) {
            console.log('Performance SW: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Performance SW: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - Network First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        // Always try network first for API requests
        return fetch(request).then((response) => {
          if (response.ok) {
            // Cache successful responses
            cache.put(request, response.clone());
            console.log('Performance SW: Cached API response', url.pathname);
          }
          return response;
        }).catch((error) => {
          console.log('Performance SW: Network failed, trying cache', url.pathname);
          
          // Network failed, try cache
          return cache.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              console.log('Performance SW: Serving API from cache', url.pathname);
              return cachedResponse;
            }
            
            // No cache available, return offline response for critical APIs
            if (url.pathname === '/api/product/list') {
              return new Response(
                JSON.stringify({
                  success: false,
                  message: 'Offline - Please check your connection',
                  products: []
                }),
                {
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
            
            // For other APIs, return a generic offline response
            return new Response(
              JSON.stringify({
                success: false,
                message: 'Service temporarily unavailable'
              }),
              {
                status: 503,
                headers: { 'Content-Type': 'application/json' }
              }
            );
          });
        });
      })
    );
    return;
  }

  // Static assets - Cache First with proper MIME type handling
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('Performance SW: Serving static asset from cache', url.pathname);
            
            // Ensure proper MIME type for JS files
            if (url.pathname.endsWith('.js') || url.pathname.endsWith('.jsx')) {
              const response = new Response(cachedResponse.body, {
                status: cachedResponse.status,
                statusText: cachedResponse.statusText,
                headers: {
                  ...cachedResponse.headers,
                  'Content-Type': 'application/javascript; charset=utf-8'
                }
              });
              return response;
            }
            
            return cachedResponse;
          }
          
          return fetch(request).then((response) => {
            if (response.ok) {
              // Ensure proper MIME type for JS files before caching
              if (url.pathname.endsWith('.js') || url.pathname.endsWith('.jsx')) {
                const responseClone = new Response(response.body, {
                  status: response.status,
                  statusText: response.statusText,
                  headers: {
                    ...response.headers,
                    'Content-Type': 'application/javascript; charset=utf-8'
                  }
                });
                cache.put(request, responseClone.clone());
                return responseClone;
              }
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // HTML pages - Network First with Cache Fallback
  if (request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try cache
          return caches.open(DYNAMIC_CACHE).then((cache) => {
            return cache.match(request).then((cachedResponse) => {
              if (cachedResponse) {
                console.log('Performance SW: Serving HTML from cache', url.pathname);
                return cachedResponse;
              }
              
              // No cache, return offline page
              return caches.match('/index.html').then((offlineResponse) => {
                if (offlineResponse) {
                  return offlineResponse;
                }
                
                // Fallback offline response
                return new Response(
                  `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <title>Offline - Ink Dapper</title>
                      <meta name="viewport" content="width=device-width, initial-scale=1.0">
                      <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        .offline { color: #666; }
                      </style>
                    </head>
                    <body>
                      <h1 class="offline">You're offline</h1>
                      <p>Please check your internet connection and try again.</p>
                      <button onclick="window.location.reload()">Retry</button>
                    </body>
                  </html>
                  `,
                  {
                    status: 200,
                    headers: { 'Content-Type': 'text/html' }
                  }
                );
              });
            });
          });
        })
    );
    return;
  }

  // Default: Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          throw new Error('No cache available');
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle background sync tasks
      console.log('Performance SW: Background sync triggered')
    );
  }
});

// Push notifications (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/ink_dapper_logo.svg',
      badge: '/white-mini.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Message handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

console.log('Performance SW: Loaded successfully');
