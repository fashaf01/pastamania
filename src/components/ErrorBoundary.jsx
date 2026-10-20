import { Component } from 'react'
import { reportError } from '../lib/report.js'

// Shows a recoverable message instead of a blank page if a screen fails to render.
// Remount it with a new `key` (e.g. the current path) to recover automatically on navigation.
export default class ErrorBoundary extends Component {
  state = { error: null }
  retried = false

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    reportError(error, this.retried ? 'boundary' : 'boundary.retry')
    // A one-off clash (the browser or an extension rewrote part of the page mid-update) usually renders
    // fine when the screen is built again from scratch, so try once quietly before showing the message.
    if (!this.retried) {
      this.retried = true
      this.timer = setTimeout(() => this.setState({ error: null }), 0)
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer)
  }

  render() {
    if (!this.state.error) return this.props.children
    // First failure: componentDidCatch is about to rebuild the screen.
    if (!this.retried) return null
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
        <a className="text-btn" href="/">Back to Home</a>
        <p className="version">{String(this.state.error?.message ?? this.state.error)}</p>
      </div>
    )
  }
}
