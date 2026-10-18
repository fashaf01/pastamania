import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { guardAgainstExtensionDomChanges } from './lib/domGuard.js'
import { reportError, watchForErrors } from './lib/report.js'
import { watchForUpdates } from './lib/updates.js'
import './styles.css'

guardAgainstExtensionDomChanges()
watchForErrors()

createRoot(document.getElementById('root'), {
  onUncaughtError: (error) => reportError(error, 'react.uncaught'),
  onRecoverableError: (error) => reportError(error, 'react.recoverable'),
}).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

// The app no longer uses a service worker; ask any existing one to update so it can remove itself.
navigator.serviceWorker?.getRegistrations().then((regs) => regs.forEach((r) => r.update()))

watchForUpdates()
