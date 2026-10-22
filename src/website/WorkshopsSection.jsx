import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { formatSessionTime, upcomingSessions, workshop } from '../data/workshops.js'
import { formatLKR, formatPhone, monthShort, weekdayShort } from '../lib/format.js'

// Upcoming sessions, one ticket per date with each branch's time.
const byDate = () => {
  const days = new Map()
  for (const s of upcomingSessions()) {
    if (!days.has(s.date)) days.set(s.date, { date: new Date(`${s.date}T${s.time}`), label: s.label, times: [] })
    days.get(s.date).times.push(`${getBranch(s.branchId).name} · ${formatSessionTime(s)}`)
  }
  return [...days.values()]
}

export default function WorkshopsSection() {
  const days = byDate()

  return (
    <section id="workshops" className="w-work">
      <div className="w-wrap">
        <div className="w-wcard w-grain w-rv">
          <div className="w-wimg">
            <img src={workshop.image} alt="A kids-size margherita pizza" loading="lazy" />
            <div className="w-sticker w-wburst">
              <span className="w-sticker-bg w-burst w-spin" aria-hidden="true" />
              <p>
                <span className="w-eb" style={{ fontSize: 11, display: 'block' }}>Ages</span>
                <span className="w-cd" style={{ fontSize: 40 }}>{workshop.minAge}–{workshop.maxAge}</span>
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
            <p className="w-eb" style={{ color: 'var(--gold2)' }}>{workshop.title} · {workshop.subtitle.toLowerCase()}</p>
            <h2 className="w-cd" style={{ fontSize: 'clamp(52px, 6.2vw, 96px)' }}>
              Little chefs,
              <br />
              <span style={{ color: 'var(--gold)' }}>real pizza</span>
            </h2>
            <p style={{ fontSize: 18, color: 'rgb(255 246 234 / 0.9)', maxWidth: 520 }}>
              Included: {workshop.includes.join(' · ')}.
            </p>
            <div className="w-chips">
              <span className="w-chip">{formatLKR(workshop.pricePerChild)} per child</span>
              <span className="w-chip">Ages {workshop.minAge}–{workshop.maxAge}</span>
              <span className="w-chip">Up to {workshop.maxChildrenPerBooking} children per booking</span>
            </div>
            {days.length > 0 ? (
              <ul className="w-tixs">
                {days.map((d) => (
                  <li key={d.date.toISOString()} className="w-tix">
                    <span className="w-tdate">
                      <span className="w-eb">{weekdayShort(d.date)}</span>
                      <b>{d.date.getDate()}</b>
                      <span className="w-eb">{monthShort(d.date)}</span>
                    </span>
                    <span className="w-tix-times">
                      {d.times.map((t) => <span key={t}>{t}</span>)}
                    </span>
                    {d.label && <span className="w-xmas">{d.label}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ fontSize: 17, fontWeight: 700 }}>New dates are coming soon.</p>
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 20px' }}>
              <a className="w-btn w-b-gold" href="#app">Book in the app</a>
              <span style={{ fontSize: 16 }}>
                or call <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPhone(brand.workshopPhone)}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
