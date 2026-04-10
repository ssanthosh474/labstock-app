// ----------------------------------------
// FIXED SERVICE WORKER (v5)
// Force-clears ALL old caches, always serves fresh HTML
// ----------------------------------------

const CACHE_NAME = 'labstock-v5';

self.addEventListener('install', event => {
  // Skip waiting immediately — don't hold on to old SW
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  // Wipe every cache from all previous versions
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network-first always — no caching of HTML or app files
self.addEventListener('fetch', event => {
  // Never cache — always try network, no fallback for HTML
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
