const CACHE_NAME = 'labstock-v3';

self.addEventListener('install', event => {
  // Only cache the main page — no external URLs
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(['/labstock-app/', '/labstock-app/index.html']).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.startsWith('chrome-extension')) return;
  // Don't cache external APIs or Railway server
  if (event.request.url.includes('railway.app')) return;
  if (event.request.url.includes('api.telegram.org')) return;
  if (event.request.url.includes('placeholder.com')) return;
  if (event.request.url.includes('cdn-cgi')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => {});
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
