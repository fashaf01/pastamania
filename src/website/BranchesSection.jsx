import { useState } from 'react'
import { UberEatsLink } from '../components/DeliveryLinks.jsx'
import { ChevronIcon } from '../components/Icons.jsx'
import { branches, mapsUrl, openStatus } from '../data/branches.js'
import { formatPhone } from '../lib/format.js'
import { useNow } from '../lib/useNow.js'

// Rough spots on the sketch map (percent across, percent down): Galle Face on the sea front, Alfred House
// inland in Colombo 3, Havelock further south. Not to scale.
const PIN_AT = { ogf: [31, 24], alfred: [46, 52], havelock: [62, 78] }

const statusText = (status) => {
  if (!status) return { tone: '', text: 'Dine-in hours to confirm' }
  if (status.state === 'open') return { tone: 'open', text: `Open now · until ${status.closes}` }
  if (status.state === 'later') return { tone: 'later', text: `Opens today at ${status.opens}` }
  return { tone: 'closed', text: 'Closed now' }
}

const PinShape = () => (
  <svg viewBox="0 0 34 44" aria-hidden="true">
    <path d="M17 43s15-14.6 15-26A15 15 0 0 0 2 17c0 11.4 15 26 15 26z" fill="currentColor" />
    <circle cx="17" cy="17" r="6" fill="#fff6ea" />
  </svg>
)

export default function BranchesSection() {
  const [picked, setPicked] = useState(branches[0].id)
  const now = useNow(60 * 1000)

  return (
    <section id="branches" className="w-branches">
      <div className="w-wrap w-branches-in">
        <div className="w-rv" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '16px 40px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p className="w-eb" style={{ color: '#8a5a00' }}>Find us</p>
            <h2 className="w-cd" style={{ fontSize: 'clamp(56px, 7.4vw, 116px)', color: 'var(--red)' }}>Come hungry</h2>
          </div>
          <p style={{ maxWidth: 380, fontSize: 17, color: '#4a3f38' }}>
            {branches.length} branches in Colombo. Pick one to see today's hours and directions.
          </p>
        </div>

        <div className="w-bgrid">
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <div className="w-btabs" role="tablist" aria-label="Branches">
              {branches.map((b) => {
                const status = statusText(openStatus(b, now))
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="tab"
                    id={`w-tab-${b.id}`}
                    className="w-btab"
                    aria-selected={picked === b.id}
                    aria-controls={`w-branch-${b.id}`}
                    onClick={() => setPicked(b.id)}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
                      <span className="w-btab-name">{b.name}</span>
                      <span className="w-status"><span className={`w-sdot ${status.tone}`} />{status.text}</span>
                    </span>
                    <ChevronIcon className="w-chev" strokeWidth={2.6} />
                  </button>
                )
              })}
            </div>
            <div className="w-bpanels">
              {branches.map((b) => {
                const restaurant = b.hours.find((h) => h.label === 'Restaurant')
                const shown = restaurant ?? b.hours[0]
                return (
                  <div
                    key={b.id}
                    id={`w-branch-${b.id}`}
                    role="tabpanel"
                    aria-labelledby={`w-tab-${b.id}`}
                    aria-hidden={picked !== b.id}
                    className="w-bp"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <p className="w-eb" style={{ color: '#8a5a00' }}>{b.highlights.join(' · ')}</p>
                      <p style={{ fontSize: 17, fontWeight: 600 }}>{b.address}</p>
                    </div>
                    <div className="w-hrs">
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>
                        {restaurant ? 'Restaurant hours' : `${shown.label} – dine-in hours to confirm`}
                      </p>
                      {shown.rows.map((r) => (
                        <div key={r.days} className="w-hrow"><span>{r.days}</span><b>{r.time}</b></div>
                      ))}
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {b.phones.map(formatPhone).join(' · ')}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                      <a className="w-btn w-b-red w-b-sm" href={mapsUrl(b)} tabIndex={picked === b.id ? undefined : -1}>Directions</a>
                      <UberEatsLink href={b.uberEatsUrl} tabIndex={picked === b.id ? undefined : -1} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="w-map w-rv" role="group" aria-label="Sketch map of the branches">
            <span className="w-sea" aria-hidden="true">Indian Ocean</span>
            {branches.map((b) => {
              const [x, y] = PIN_AT[b.id] ?? [50, 50]
              return (
                <button
                  key={b.id}
                  type="button"
                  className="w-pin"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  aria-pressed={picked === b.id}
                  onClick={() => setPicked(b.id)}
                >
                  <span className="w-pin-label">{b.name}</span>
                  <PinShape />
                </button>
              )
            })}
            <span className="w-mapnote">Sketch map, not to scale</span>
          </div>
        </div>
      </div>
    </section>
  )
}
