// Retired service worker. Earlier versions cached the app, which could leave an open or installed app
// on an old version until a manual refresh. This version removes itself and its caches, then reloads
// any open windows onto the current app.
self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((k) => caches.delete(k)))
      await self.registration.unregister()
      const windows = await self.clients.matchAll({ type: 'window' })
      windows.forEach((client) => client.navigate(client.url))
    })(),
  )
})
