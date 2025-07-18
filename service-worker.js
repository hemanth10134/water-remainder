const CACHE_NAME = 'hydropal-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Add other static assets you want to cache here
  // e.g., '/styles.css', '/app.js', '/icons/icon-192x192.png'
];

self.addEventListener('install', event => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});


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

// This handles server-sent push notifications.
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'HydroPal', body: 'Time to drink water!' };
  const title = data.title;
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// This handles what happens when a user clicks on a notification.
self.addEventListener('notificationclick', event => {
  event.notification.close(); // Close the notification

  // This opens the app and focuses it.
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // If a window is already open, focus it.
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      // Otherwise, open a new window.
      return clients.openWindow('/');
    })
  );
});