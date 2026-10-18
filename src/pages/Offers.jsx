import AppBar from '../components/AppBar.jsx'
import { brand } from '../data/brand.js'
import { fridayMania, offers } from '../data/offers.js'
import { formatLKR } from '../lib/format.js'

export default function Offers() {
  return (
    <>
      <AppBar title="FridayMania" back="/" />
      <div className="pad">
        <section className="friday">
          <p className="retro retro-gold friday-deal">Buy 1, Get 1.</p>
          <p className="friday-sub">Every Friday · dine-in, takeaway & delivery</p>
          <p>{fridayMania.description}</p>
          <div className="friday-dishes">
            {fridayMania.pastHeroes.map((h) => (
              <img key={h.name} src={h.image} alt={h.name} title={h.name} />
            ))}
          </div>
          <a className="btn btn-gold btn-block" href={brand.socials.instagram} target="_blank" rel="noreferrer">
            See this Friday’s dish
          </a>
          <p className="friday-terms">{fridayMania.terms}</p>
        </section>

        <section className="block">
          <h2 className="h2">Combos</h2>
          <ul className="list">
            {offers.map((o) => (
              <li key={o.id} className="list-row">
                <img src={o.image} alt="" loading="lazy" />
                <span className="row-text">
                  <strong>{o.title}</strong>
                  <span>{o.includes.join(' · ')}</span>
                </span>
                <span className="price">{formatLKR(o.price)}</span>
              </li>
            ))}
          </ul>
          <p className="footnote">Combos on Uber Eats at Alfred House & One Galle Face. Subject to availability.</p>
        </section>
      </div>
    </>
  )
}
