import { useNavigate } from 'react-router-dom'
import { BackIcon } from './Icons.jsx'

// Screen header. `back` is the screen to return to when there is no in-app history
// (for example when the page was opened from a shared link or a home-screen shortcut).
// The router numbers its history entries; 0 means this is the first screen of the visit.
export default function AppBar({ title, back, action }) {
  const navigate = useNavigate()
  const goBack = () => ((window.history.state?.idx ?? 0) > 0 ? navigate(-1) : navigate(back, { replace: true }))

  return (
    <header className="appbar">
      {back ? (
        <button className="icon-btn" onClick={goBack} aria-label="Back">
          <BackIcon />
        </button>
      ) : (
        <span />
      )}
      <h1 className="appbar-title">{title}</h1>
      <div className="appbar-action">{action}</div>
    </header>
  )
}
