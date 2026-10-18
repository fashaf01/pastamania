import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ClockIcon, PhoneIcon, PinIcon } from '../components/Icons.jsx'
import { branches, mapsUrl } from '../data/branches.js'
import { formatPhone } from '../lib/format.js'

export default function Branches() {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <div className="container page">
      <h1 className="page-title retro retro-red">Branches</h1>
      <div className="branch-grid">
        {branches.map((b) => (
          <article key={b.id} id={b.id} className="branch-card">
            <h2>{b.name}</h2>
            <div className="tags">
              {b.highlights.map((h) => (
                <span key={h} className="tag">{h}</span>
              ))}
            </div>
            <p className="branch-line">
              <PinIcon width={18} height={18} /> {b.address}
            </p>
            {b.hours.map((h) => (
              <div key={h.label} className="hours">
                <p className="branch-line">
                  <ClockIcon width={18} height={18} /> <strong>{h.label}</strong>
                </p>
                <table>
                  <tbody>
                    {h.rows.map((r) => (
                      <tr key={r.days}>
                        <td>{r.days}</td>
                        <td>{r.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
            <div className="branch-actions">
              <a className="btn btn-primary" href={`tel:${b.phones[0]}`}>
                <PhoneIcon width={18} height={18} /> Call
              </a>
              <a className="btn btn-outline" href={mapsUrl(b)} target="_blank" rel="noreferrer">
                Directions
              </a>
              <a className="btn btn-uber" href={b.uberEatsUrl} target="_blank" rel="noreferrer">
                Uber Eats
              </a>
            </div>
            <p className="muted small">
              {b.phones.map(formatPhone).join(' · ')}
            </p>
          </article>
        ))}
      </div>
      <p className="muted small">Hours may change on public holidays. Please call ahead to confirm.</p>
    </div>
  )
}
