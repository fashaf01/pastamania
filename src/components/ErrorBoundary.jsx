import { Component } from 'react'
import { reportError } from '../lib/report.js'

// Shows a recoverable message instead of a blank page if a screen fails to render.
// Remount it with a new `key` (e.g. the current path) to recover automatically on navigation.
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    reportError(error, 'boundary')
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="pad empty" role="alert">
        <p>
          <strong>Sorry, this screen didn’t load.</strong>
          <br />
          Your points and bookings are safe.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Reload
        </button>
        <p className="version">{String(this.state.error?.message ?? this.state.error)}</p>
      </div>
    )
  }
}
