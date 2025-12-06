// Service Worker for Kodeen Hunter Portfolio
// Provides offline functionality and caching

const CACHE_NAME = 'kodeen-portfolio-v1'
const STATIC_CACHE = 'kodeen-static-v1'
const DYNAMIC_CACHE = 'kodeen-dynamic-v1'

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...')
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Caching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...')
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => caches.delete(key))
      )
    })
  )
  return self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== 'GET') return

  // Skip API requests (always fetch fresh)
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({ error: 'Offline - API unavailable' }),
          {
            headers: { 'Content-Type': 'application/json' },
            status: 503,
          }
        )
      })
    )
    return
  }

  // Cache-first strategy for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch(() => {
          // Offline fallback
          if (request.destination === 'document') {
            return caches.match('/')
          }
        })
    })
  )
})

// Background sync for offline form submissions (future enhancement)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings' || event.tag === 'sync-contact') {
    event.waitUntil(
      // Implement background sync logic here
      Promise.resolve()
    )
  }
})

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Kodeen Hunter Portfolio'
  const options = {
    body: data.body || 'New notification',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
  }

  event.waitUntil(self.registration.showNotification(title, options))
})
