import { useLocation, useNavigate } from 'react-router-dom'
import { BackIcon, CloseIcon } from './Icons.jsx'

// Goes back in the app's history, or to `fallback` when the screen was opened directly (shared link, reload).
export function useBack(fallback = '/') {
  const navigate = useNavigate()
  const location = useLocation()
  return () => (location.key === 'default' ? navigate(fallback, { replace: true }) : navigate(-1))
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

// Large left-aligned title for the tab screens (Menu, Rewards, Wallet).
export function PageHead({ title, children }) {
  return (
    <header className="page-head">
      <h1 className="title-xl">{title}</h1>
      {children}
    </header>
  )
}
