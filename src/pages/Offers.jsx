import { brand } from '../data/brand.js'
import { fridayMania, offers } from '../data/offers.js'
import { formatLKR } from '../lib/format.js'

export default function Offers() {
  return (
    <div className="container page">
      <h1 className="page-title">Offers</h1>

      <section className="friday-hero">
        <span className="friday-badge">1+1</span>
        <p className="eyebrow">Every Friday</p>
        <h2>{fridayMania.title}</h2>
        <p className="lead">{fridayMania.subtitle}</p>
        <p>{fridayMania.description}</p>
        <p className="small">Recent heroes: {fridayMania.pastHeroes.join(' · ')}</p>
        <p className="small terms">{fridayMania.terms}</p>
        <a className="btn btn-gold" href={brand.socials.instagram} target="_blank" rel="noreferrer">
          See this Friday’s dish
        </a>
      </section>

      <h2 className="section-title">Combos & rewards</h2>
      <div className="offer-grid">
        {offers.map((o) => (
          <article key={o.id} className="offer-card">
            <div className="offer-head">
              <h3>{o.title}</h3>
              {o.price && <span className="price">{formatLKR(o.price)}</span>}
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
          </article>
        ))}
      </div>
      <p className="muted small">Offers are subject to availability and may change. Please confirm with the branch when ordering.</p>
    </div>
  )
}
