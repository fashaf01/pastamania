import { BUILD_ID } from './updates.js'

// Sends client errors to /api/log (shown in the Vercel runtime logs) so crashes on real devices can be
// diagnosed. Only the error, page path and browser are sent – no member data.
const sent = new Set()

export function reportError(error, source = 'error') {
  if (!import.meta.env.PROD) return
  const message = String(error?.message ?? error)
  const key = `${source}:${message}`
  if (sent.has(key) || sent.size > 20) return
  sent.add(key)

  const body = JSON.stringify({
    source,
    message,
    stack: String(error?.stack ?? '').slice(0, 2000),
    path: window.location.pathname,
    build: BUILD_ID,
    userAgent: navigator.userAgent,
    at: new Date().toISOString(),
  })
  try {
    const blob = new Blob([body], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/log', blob)) {
      fetch('/api/log', { method: 'POST', body, headers: { 'Content-Type': 'application/json' }, keepalive: true })
    }
  } catch {
    // reporting must never break the app
  }
}

export function watchForErrors() {
  window.addEventListener('error', (e) => reportError(e.error ?? e.message, 'window.error'))
  window.addEventListener('unhandledrejection', (e) => reportError(e.reason, 'unhandledrejection'))
}
