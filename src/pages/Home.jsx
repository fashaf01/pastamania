import { Link } from 'react-router-dom'
import DishImage from '../components/DishImage.jsx'
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
      <section className="hero red-paper">
        <div className="rays" aria-hidden="true" />
        <div className="container hero-inner">
          <img className="hero-logo" src={brand.logo} alt="PastaMania Casual Dining" width="132" height="132" />
          <h1 className="retro retro-gold hero-title">
            Pasta & Pizza
            <br />
            Made for Sharing
          </h1>
          <p className="caps-white">Casual Italian dining · Colombo</p>
          <p className="hero-lead">{brand.about}</p>
          <div className="hero-actions">
            <button className="btn btn-gold" onClick={openOrder}>Order delivery</button>
            <Link className="btn btn-ghost" to="/menu">View menu</Link>
          </div>
        </div>
        <img className="hero-food" src={fridayMania.image} alt="Hot Basil Chicken Pizza" width="1000" height="514" />
      </section>

      <section className="container section">
        <Link to="/offers" className="friday-card red-paper">
          <span className="starburst" aria-hidden="true">1+1</span>
          <p className="retro retro-gold friday-title">
            FridayMania
            <br />@ PastaMania
          </p>
          <p className="retro retro-yellow friday-deal">Buy 1, Get 1.</p>
          <p className="caps-white">Only on Fridays</p>
          <ul className="hero-dishes" aria-label="Recent FridayMania heroes">
            {fridayMania.pastHeroes.map((h) => (
              <li key={h.name}>
                <img src={h.image} alt={h.name} loading="lazy" />
              </li>
            ))}
          </ul>
          <span className="friday-cta">See this Friday’s dish →</span>
        </Link>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2 className="retro retro-red">Signature dishes</h2>
          <Link to="/menu" className="link">Full menu →</Link>
        </div>
        <div className="dish-grid">
          {signatureDishes.map((d) => (
            <article key={d.name} className="dish-card">
              <DishImage item={d} />
              <div className="dish-body">
                <h3>{d.name}</h3>
                <p className="muted small">{d.note}</p>
                <p className="price">{formatLKR(d.price)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2 className="retro retro-red">What’s happening</h2>
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
          <h2 className="retro retro-red">Visit us</h2>
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
        <div className="social-card red-paper">
          <div>
            <h2 className="retro retro-gold">Follow the cravings</h2>
            <p>New FridayMania dishes, workshops and the Christmas menu reveal – first on our socials.</p>
          </div>
          <div className="social-actions">
            <a className="btn btn-gold" href={brand.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a className="btn btn-ghost" href={brand.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </section>
    </>
  )
}
