// MeetNotes service worker: makes the app installable and keeps its shell
// available on a weak connection. API calls always go to the network.
const CACHE = 'meetnotes-v1';
const SHELL = ['/meetnotes/app/', '/meetnotes/logo-white.png', '/meetnotes/logo-navy.png', '/meetnotes/icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
  // Network first, cached copy when offline.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok && url.pathname.startsWith('/meetnotes/')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, copy));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
