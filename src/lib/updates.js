export const BUILD_ID = __BUILD_ID__

const isTyping = () => ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)

// Reload onto the latest deploy when the app comes back to the screen (or every few minutes while
// open), so an open tab or home-screen app never stays on an old version.
export function watchForUpdates() {
  if (!import.meta.env.PROD) return

  const check = async () => {
    try {
      const res = await fetch('/version.json', { cache: 'no-store' })
      const { build } = await res.json()
      if (build && build !== BUILD_ID && !isTyping()) window.location.reload()
    } catch {
      // offline or not deployed with a version file – try again later
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check()
  })
  window.addEventListener('pageshow', (e) => e.persisted && check())
  setInterval(check, 5 * 60 * 1000)
}
