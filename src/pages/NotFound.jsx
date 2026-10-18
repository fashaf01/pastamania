import { Link } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'

export default function NotFound() {
  return (
    <>
      <AppBar title="Not found" back="/" />
      <div className="pad empty">
        <p>This page wandered off like a loose strand of spaghetti.</p>
        <Link className="btn btn-primary" to="/">Back home</Link>
      </div>
    </>
  )
}
