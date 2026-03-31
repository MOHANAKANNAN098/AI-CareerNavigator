const CACHE_NAME = 'careerforge-v1';
// Add all important files to be cached
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './script.js',
  './manifest.json',
  './m1.jpeg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './styles/mobile.css',
  './scripts/mobile-ui.js',
  './choose-college.html',
  './cutoff-calculator.html',
  './data/database-sample.json',
  './collages.json',
  './startupIdeas.json'
];

// Install event: open cache and add assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll for atomic operation
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache one or more resources:', error);
        });
      })
  );
});

// Fetch event: serve from cache if available, otherwise fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});