const version = new URL(self.location.href).searchParams.get('v') ?? 'dev'
const cacheName = `liquid-dashboard-pro-${version}`
const appShellFiles = ['./', './manifest.webmanifest', './icons/app-icon-192.png', './icons/app-icon-512.png']

const isSameOrigin = (request) => new URL(request.url).origin === self.location.origin

const shouldCacheAsset = (request) => {
  if (!isSameOrigin(request)) return false

  if (request.destination) {
    return ['script', 'style', 'font', 'image', 'manifest'].includes(request.destination)
  }

  const pathname = new URL(request.url).pathname
  return /\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|json)$/i.test(pathname)
}

const putInCache = async (request, response) => {
  if (!response.ok || !isSameOrigin(request)) return response

  const cache = await caches.open(cacheName)
  await cache.put(request, response.clone())
  return response
}

const networkFirstNavigation = async (request) => {
  try {
    const response = await fetch(request)
    await putInCache(request, response)
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached

    const fallback = await caches.match('./')
    if (fallback) return fallback

    throw new Error('Network unavailable')
  }
}

const cacheFirstAsset = async (request) => {
  const cached = await caches.match(request)
  if (cached) return cached

  const response = await fetch(request)
  return putInCache(request, response)
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll(appShellFiles)),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith('liquid-dashboard-pro-') && key !== cacheName).map((key) => caches.delete(key))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event.request))
    return
  }

  if (shouldCacheAsset(event.request)) {
    event.respondWith(cacheFirstAsset(event.request))
  }
})
