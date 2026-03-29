const CACHE_NAME = 'careerforge-pwa-v1';
const ASSETS_TO_CACHE = [
  '.',
  'index.html',
  'style.css',
  'app.js',
  'script.js',
  'manifest.json',
  'm1.jpeg',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});