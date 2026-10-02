const CACHE_NAME = 'smb-portal-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        // In a real app we'd cache CSS, JS bundles and critical assets
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Stale-while-revalidate strategy for basic offline support
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache new responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback for failed network (e.g. offline)
        return cachedResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
