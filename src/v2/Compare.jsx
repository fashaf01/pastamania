import { Link } from 'react-router-dom'
import { brand } from '../data/brand.js'
import './v2.css'

// The current app and the new one side by side, both live. They share this browser's member, points and vouchers.
export default function Compare() {
  return (
    <div className="v2" style={{ display: 'block' }}>
      <div className="v2-compare">
        <div className="v2-compare-inner">
          <img src={brand.logo} alt="PastaMania" style={{ width: 64, height: 64 }} />
          <div className="v2-stack" style={{ gap: 6, alignItems: 'center' }}>
            <span className="v2-eyebrow" style={{ color: 'var(--gold-light)' }}>PastaMania Club</span>
            <h1 className="v2-cd" style={{ fontSize: 48, lineHeight: '44px' }}>Now and new</h1>
            <p className="v2-body" style={{ maxWidth: 560 }}>
              Both apps are live and share the same member on this browser. Join in either one, then give points on the counter
              screen and watch the new app thank the guest and send a come-back treat.
            </p>
          </div>
          <div className="v2-phones">
            <figure className="v2-phone" style={{ margin: 0 }}>
              <figcaption className="v2-cd" style={{ fontSize: 26 }}>Now</figcaption>
              <iframe src="/app" title="The current app" />
            </figure>
            <figure className="v2-phone" style={{ margin: 0 }}>
              <figcaption className="v2-cd" style={{ fontSize: 26, color: 'var(--gold)' }}>New</figcaption>
              <iframe src="/v2" title="The new app" />
            </figure>
          </div>
          <div className="v2-links">
            <Link to="/v2" className="v2-btn v2-btn-gold">Open the new app</Link>
            <Link to="/v2/counter" className="v2-btn v2-btn-line">Counter</Link>
            <Link to="/v2/manager" className="v2-btn v2-btn-line">Manager</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
