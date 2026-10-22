import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BackIcon, CloseIcon } from './Icons.jsx'

// Goes back in the app's history, or to `fallback` when this is the first screen of the visit (a shared link,
// a reload or a home-screen shortcut). The router numbers its history entries; 0 means the first.
export function useBack(fallback = '/') {
  const navigate = useNavigate()
  return () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate(fallback, { replace: true }))
}

// Header for pushed screens: round back button and a centred poster title.
export default function AppBar({ title, back = '/', action, close = false }) {
  const goBack = useBack(back)
  return (
    <header className="topbar">
      <button type="button" className="round-btn" onClick={goBack} aria-label={close ? 'Close' : 'Back'}>
        {close ? <CloseIcon width={20} height={20} /> : <BackIcon width={20} height={20} />}
      </button>
      <h1 className="topbar-title">{title}</h1>
      <div className="topbar-action">{action}</div>
    </header>
  )
}

// Large left-aligned title for the tab screens (Menu, Rewards, Me). Once it scrolls away, a small
// title fades in on a frosted bar at the top, the way iPhone apps do it.
export function PageHead({ title, children }) {
  const heading = useRef(null)
  const [tucked, setTucked] = useState(false)

  useEffect(() => {
    const el = heading.current
    if (!el || !('IntersectionObserver' in window)) return
    const watcher = new IntersectionObserver(([entry]) => setTucked(!entry.isIntersecting), { rootMargin: '-30px 0px 0px 0px' })
    watcher.observe(el)
    return () => watcher.disconnect()
  }, [])

  return (
    <>
      <div className={`title-bar ${tucked ? 'on' : ''}`} aria-hidden="true">
        <span>{title}</span>
      </div>
      <header className="page-head">
        <h1 ref={heading} className="large-title">{title}</h1>
        {children}
      </header>
    </>
  )
}
