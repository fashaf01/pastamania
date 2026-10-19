import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Light, dark or follow the phone. The choice is kept on this device; index.html applies it
// before the first paint so the app never flashes the wrong colours.

const STORAGE_KEY = 'pm.theme'
export const THEME_MODES = ['light', 'dark', 'system']

const loadMode = () => {
  try {
    const mode = localStorage.getItem(STORAGE_KEY)
    return THEME_MODES.includes(mode) ? mode : 'system'
  } catch {
    return 'system'
  }
}

const darkQuery = () => window.matchMedia?.('(prefers-color-scheme: dark)')

const ThemeContext = createContext(null)

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(loadMode)
  const [systemDark, setSystemDark] = useState(() => darkQuery()?.matches ?? false)

  useEffect(() => {
    const query = darkQuery()
    if (!query) return
    const onChange = (e) => setSystemDark(e.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const theme = mode === 'system' ? (systemDark ? 'dark' : 'light') : mode

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const setMode = useCallback((next) => {
    setModeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable – the choice lasts for this visit only
    }
  }, [])

  const toggle = useCallback(() => setMode(theme === 'dark' ? 'light' : 'dark'), [theme, setMode])

  const value = useMemo(() => ({ mode, theme, setMode, toggle }), [mode, theme, setMode, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
