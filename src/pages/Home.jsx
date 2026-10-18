import { Link } from 'react-router-dom'
import { useOrder } from '../components/OrderSheet.jsx'
import { brand } from '../data/brand.js'
import { branches } from '../data/branches.js'
import { events } from '../data/events.js'
import { signatureDishes } from '../data/menu.js'
import { fridayMania } from '../data/offers.js'
import { formatLKR } from '../lib/format.js'

export default function Home() {
  const openOrder = useOrder()

  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <p className="eyebrow">Colombo · 3 branches</p>
          <h1>
            Pasta & pizza,
            <br />
            <span>made for sharing.</span>
          </h1>
          <p className="hero-lead">{brand.about}</p>
          <div className="hero-actions">
            <button className="btn btn-gold" onClick={openOrder}>Order delivery</button>
            <Link className="btn btn-ghost" to="/menu">View menu</Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">🍝</div>
      </section>

      <section className="container section">
        <Link to="/offers" className="friday-banner">
          <div>
            <p className="eyebrow">Every Friday</p>
            <h2>{fridayMania.title}</h2>
            <p>{fridayMania.subtitle}</p>
          </div>
          <span className="friday-badge">1+1</span>
        </Link>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Signature dishes</h2>
          <Link to="/menu" className="link">Full menu →</Link>
        </div>
        <div className="dish-grid">
          {signatureDishes.map((d) => (
            <article key={d.name} className="dish-card">
              <div className="dish-art" aria-hidden="true">{d.icon}</div>
              <h3>{d.name}</h3>
              <p className="muted small">{d.note}</p>
              <p className="price">{formatLKR(d.price)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>What’s happening</h2>
          <Link to="/events" className="link">All events →</Link>
        </div>
        <div className="event-strip">
          {events.map((e) => (
            <Link key={e.id} to="/events" className="event-mini">
              <span className="event-icon" aria-hidden="true">{e.icon}</span>
              <span className="tag">{e.tag}</span>
              <strong>{e.title}</strong>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2>Visit us</h2>
          <Link to="/branches" className="link">Directions →</Link>
        </div>
        <ul className="branch-mini-list">
          {branches.map((b) => (
            <li key={b.id}>
              <Link to={`/branches#${b.id}`} className="branch-mini">
                <strong>{b.name}</strong>
                <span className="muted small">{b.address}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section">
        <div className="social-card">
          <div>
            <h2>Follow the cravings</h2>
            <p className="muted">New FridayMania dishes, workshops and the Christmas menu reveal – first on our socials.</p>
          </div>
          <div className="social-actions">
            <a className="btn btn-primary" href={brand.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="btn btn-outline" href={brand.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </section>
    </>
  )
}
