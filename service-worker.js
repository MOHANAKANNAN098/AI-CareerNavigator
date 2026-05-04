const CACHE_NAME = 'careerforge-v3';
const OFFLINE_URL = './offline.html';

const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './style.css',
  './app.js',
  './script.js',
  './mobile.css',
  './mobile-ui.js',
  './manifest.json',
  './m1.jpeg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './choose-college.html',
  './cutoff-calculator.html',
  './startupIdeas.json',
  './collages.json'
];

// Install: cache all core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(PRECACHE_URLS).catch(() => {})
    )
  );
  self.skipWaiting();
});

// Activate: remove old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: stale-while-revalidate — serve cache instantly, update in background
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip cross-origin requests (CDNs, Google Fonts, etc.)
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const cached = await cache.match(event.request);

      const networkFetch = fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            cache.put(event.request, response.clone());
          }
          return response;
        })
        .catch(() => {
          // Offline fallback only for page navigations
          if (event.request.mode === 'navigate') {
            return cache.match(OFFLINE_URL);
          }
        });

      // Return cached version immediately; network updates it in background
      return cached || networkFetch;
    })
  );
});
