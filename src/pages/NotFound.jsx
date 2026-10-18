import { Link } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'

export default function NotFound() {
  return (
    <>
      <AppBar title="Not found" back="/" />
      <div className="screen-pad empty-page">
        <p className="hero-art-small" aria-hidden="true">🍝</p>
        <h2 className="retro retro-red">Page not found</h2>
        <p className="muted">This page wandered off like a loose strand of spaghetti.</p>
        <Link className="btn btn-primary" to="/">Back home</Link>
      </div>
    </>
  )
}
