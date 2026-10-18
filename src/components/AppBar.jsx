import { useNavigate } from 'react-router-dom'
import { BackIcon } from './Icons.jsx'

// Screen header. `back` shows a back button (to `back` if it is a path, otherwise browser back).
export default function AppBar({ title, back, action }) {
  const navigate = useNavigate()
  const goBack = () => {
    if (typeof back === 'string') navigate(back)
    else if (window.history.length > 1) navigate(-1)
    else navigate('/')
  }

  return (
    <header className="appbar">
      {back ? (
        <button className="icon-btn appbar-back" onClick={goBack} aria-label="Back">
          <BackIcon />
        </button>
      ) : (
        <span className="appbar-spacer" />
      )}
      <h1 className="appbar-title">{title}</h1>
      <div className="appbar-action">{action}</div>
    </header>
  )
}
