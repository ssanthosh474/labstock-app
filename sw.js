// ----------------------------------------
// FIXED SERVICE WORKER (v4)
// Prevents app from freezing on old cached HTML
// ----------------------------------------

const CACHE_NAME = 'labstock-v4';  // bump version so all devices update

self.addEventListener('install', event => {
  // Do NOT cache index.html or app shell
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  // Delete ALL previous caches from v1 / v2 / v3
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Always fetch fresh files; only fallback to cache if network fails
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
