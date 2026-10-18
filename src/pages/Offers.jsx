import AppBar from '../components/AppBar.jsx'
import { brand } from '../data/brand.js'
import { fridayMania, offers } from '../data/offers.js'
import { formatLKR } from '../lib/format.js'

export default function Offers() {
  return (
    <>
      <AppBar title="Offers" back />
      <div className="screen-pad">
        <section className="friday-hero red-paper">
          <span className="starburst" aria-hidden="true">1+1</span>
          <h2 className="retro retro-gold friday-title">
            {fridayMania.title}
            <br />@ PastaMania
          </h2>
          <p className="retro retro-yellow friday-deal">Buy 1, Get 1.</p>
          <p className="caps-white">Only on Fridays</p>
          <p className="friday-desc">{fridayMania.description}</p>

          <p className="caps-gold">Recent heroes</p>
          <ul className="hero-list">
            {fridayMania.pastHeroes.map((h) => (
              <li key={h.name}>
                <img src={h.image} alt="" loading="lazy" />
                <span>{h.name}</span>
              </li>
            ))}
          </ul>

          <a className="btn btn-gold" href={brand.socials.instagram} target="_blank" rel="noreferrer">
            See this Friday’s dish
          </a>
          <p className="small terms">{fridayMania.terms}</p>
          <img className="friday-food" src={fridayMania.image} alt="" loading="lazy" />
        </section>

        <h2 className="section-title retro retro-red">Combos & rewards</h2>
        <div className="offer-grid">
          {offers.map((o) => (
            <article key={o.id} className="offer-card">
              {o.image && <img className="offer-img" src={o.image} alt={o.title} loading="lazy" />}
              <div className="offer-body">
                <div className="offer-head">
                  <h3>{o.title}</h3>
                  {o.price && <span className="price-tag">{formatLKR(o.price)}</span>}
                </div>
                <ul className="ticks">
                  {o.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
                <p className="muted small">{o.where}</p>
                {o.link && (
                  <a className="link small" href={o.link} target="_blank" rel="noreferrer">
                    Details →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="muted small">Offers are subject to availability and may change. Please confirm with the branch when ordering.</p>
      </div>
    </>
  )
}
