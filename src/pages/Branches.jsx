import AppBar from '../components/AppBar.jsx'
import { CallIcon, NavigateIcon, PinIcon } from '../components/Icons.jsx'
import { branches, mapsUrl, todaysHours } from '../data/branches.js'

export default function Branches() {
  return (
    <>
      <AppBar title="Branches" back="/me" />
      <div className="page">
        <p className="lead">Three branches in Colombo. Earn points at all of them.</p>
        {branches.map((b) => {
          const today = todaysHours(b)
          return (
            <article key={b.id} className="branch-card card">
              <div className="stack" style={{ gap: 8 }}>
                <h2 className="title-m">{b.name}</h2>
                <span className={`pill ${today ? 'pill-green' : 'pill-soft'}`} style={{ alignSelf: 'flex-start', fontSize: 13 }}>
                  <span className="status-dot" />
                  {today ? `Restaurant today · ${today}` : 'Dine-in hours to be confirmed'}
                </span>
              </div>
              <span className="branch-address">
                <PinIcon width={16} height={16} />
                {b.address}
              </span>
              <div className="chip-row">
                {b.highlights.map((h) => (
                  <span key={h} className="pill pill-gold">{h}</span>
                ))}
              </div>
              <div className="hours-box">
                {b.hours.map((h) => (
                  <dl key={h.label}>
                    <dt>{h.label}</dt>
                    {h.rows.map((r) => (
                      <dd key={r.days}>
                        <span>{r.days}</span>
                        <span>{r.time}</span>
                      </dd>
                    ))}
                  </dl>
                ))}
              </div>
              <div className="branch-actions">
                <a href={`tel:${b.phones[0]}`}><CallIcon width={16} height={16} /> Call</a>
                <a href={mapsUrl(b)} target="_blank" rel="noreferrer"><NavigateIcon width={16} height={16} /> Directions</a>
                <a className="uber" href={b.uberEatsUrl} target="_blank" rel="noreferrer" aria-label="Order on Uber Eats">Uber<b>Eats</b></a>
              </div>
            </article>
          )
        })}
        <p className="footnote">Hours may change on public holidays.</p>
      </div>
    </>
  )
}
