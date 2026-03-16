const CACHE_NAME = 'liquid-dashboard-pro-v1'

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(['./', './manifest.webmanifest', './icons/app-icon-192.png', './icons/app-icon-512.png']),
    ),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached

      return fetch(event.request)
        .then((response) => {
          if (!response.ok || !event.request.url.startsWith(self.location.origin)) {
            return response
          }

          const cloned = response.clone()
          void caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned))
          return response
        })
        .catch(async () => {
          if (event.request.mode === 'navigate') {
            const fallback = await caches.match('./')
            if (fallback) return fallback
          }

          throw new Error('Network unavailable')
        })
    }),
  )
})
