// One link, two faces: a computer gets the website, a phone or tablet gets the app. Anyone can switch (website
// footer, or the welcome / Me screens of the app on a computer); the choice is kept on the device.

const STORAGE_KEY = 'pm.view'
const VIEWS = ['site', 'app']

// Phones and tablets, including iPads that report a desktop Mac user agent.
export const isPhoneOrTablet = () => {
  const ua = navigator.userAgent
  if (/Android|iPhone|iPad|iPod|Mobile|Silk|Kindle/i.test(ua)) return true
  if (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) return true
  return !!window.matchMedia?.('(hover: none) and (pointer: coarse)').matches
}

// Opened from the home screen: always the app.
const isInstalled = () => !!window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone === true

const loadChoice = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const saveChoice = (view) => {
  try {
    localStorage.setItem(STORAGE_KEY, view)
  } catch {
    // storage unavailable (private mode etc.) – the ?view= link still switches this visit
  }
}

// Links that always open one face, whatever the device, and are never remembered: /website and /app.
// /app/<screen> (say /app/join or /app/book) opens that screen of the app.
export const DEDICATED = { '/website': 'site', '/app': 'app' }

export const wantsWebsite = () => {
  if (isInstalled()) return false
  const path = window.location.pathname.replace(/\/+$/, '')
  if (path.startsWith('/app/')) return false
  const dedicated = DEDICATED[path]
  if (dedicated) return dedicated === 'site'
  // ?view=app / ?view=site switches and remembers it, then tidies the address.
  const params = new URLSearchParams(window.location.search)
  const asked = params.get('view')
  if (VIEWS.includes(asked)) {
    saveChoice(asked)
    params.delete('view')
    const query = params.toString()
    window.history.replaceState(null, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`)
    return asked === 'site'
  }
  const choice = loadChoice()
  if (VIEWS.includes(choice)) return choice === 'site'
  return !isPhoneOrTablet()
}

// Reloads at the home page so the other face starts clean.
export const switchView = (view) => {
  window.location.assign(`/?view=${view}`)
}
