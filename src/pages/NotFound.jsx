import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container page empty-page">
      <p className="hero-art-small" aria-hidden="true">🍝</p>
      <h1 className="page-title retro retro-red">Page not found</h1>
      <p className="muted">This page wandered off like a loose strand of spaghetti.</p>
      <Link className="btn btn-primary" to="/">Back home</Link>
    </div>
  )
}
