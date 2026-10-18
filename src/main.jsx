import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// The app no longer uses a service worker; ask any existing one to update so it can remove itself.
navigator.serviceWorker?.getRegistrations().then((regs) => regs.forEach((r) => r.update()))
