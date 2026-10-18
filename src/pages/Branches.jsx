import AppBar from '../components/AppBar.jsx'
import { branches, mapsUrl } from '../data/branches.js'

export default function Branches() {
  return (
    <>
      <AppBar title="Branches" back="/me" />
      <div className="pad">
        {branches.map((b) => (
          <section key={b.id} className="branch">
            <h2 className="h2">{b.name}</h2>
            <p className="muted">{b.address}</p>
            {b.hours.map((h) => (
              <dl key={h.label} className="hours">
                <dt>{h.label}</dt>
                {h.rows.map((r) => (
                  <dd key={r.days}>
                    <span>{r.days}</span>
                    <span>{r.time}</span>
                  </dd>
                ))}
              </dl>
            ))}
            <div className="branch-actions">
              <a className="btn btn-primary btn-sm" href={`tel:${b.phones[0]}`}>Call</a>
              <a className="btn btn-outline btn-sm" href={mapsUrl(b)} target="_blank" rel="noreferrer">Directions</a>
            </div>
          </section>
        ))}
        <p className="footnote">Hours may change on public holidays.</p>
      </div>
    </>
  )
}
