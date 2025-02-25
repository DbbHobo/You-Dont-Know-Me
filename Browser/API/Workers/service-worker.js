const CACHE_NAME = "v1-core"
const PRE_CACHE = ["/", "/service-worker.html"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRE_CACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== "v1-core")
          .map((name) => caches.delete(name))
      )
    })
  )
})
