const CACHE = 'workout-v17-cache';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './assets/index-DZAAWjsr.js',
  './assets/icons/01-hampelmann.svg',
  './assets/icons/02-wandsitz.svg',
  './assets/icons/03-liegestuetze.svg',
  './assets/icons/04-crunches.svg',
  './assets/icons/05-step-ups.svg',
  './assets/icons/06-kniebeugen.svg',
  './assets/icons/07-trizeps-dips.svg',
  './assets/icons/08-plank.svg',
  './assets/icons/09-hochknie.svg',
  './assets/icons/10-ausfallschritte.svg',
  './assets/icons/11-liegestuetz-rotation.svg',
  './assets/icons/12-seitlicher-plank.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const requestUrl = new URL(event.request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isNavigation = event.request.mode === 'navigate';

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (isSameOrigin && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => {
        if (isNavigation) {
          return caches.match('./index.html');
        }

        return caches.match(event.request);
      })
  );
});
