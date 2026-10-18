import { useLocation, useNavigate } from 'react-router-dom'
import { BackIcon } from './Icons.jsx'

// Screen header. `back` is the screen to return to when there is no in-app history
// (for example when the page was opened from a shared link).
export default function AppBar({ title, back, action }) {
  const navigate = useNavigate()
  const location = useLocation()
  const goBack = () => (location.key === 'default' ? navigate(back, { replace: true }) : navigate(-1))

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
