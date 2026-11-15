import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ClockIcon } from '../../components/Icons.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { getBranch, mapsUrl } from '../../data/branches.js'
import { firstName, formatPoints } from '../../lib/format.js'
import { dayMonth, levers, rupees } from '../config.js'
import { useV2 } from '../store.jsx'
import { BackButton, StarShape } from '../ui.jsx'

// Opens by itself after the counter gives points: thanks, the come-back treat for next time, and a one-tap
// rating. Happy guests are asked for a Google review; unhappy ones go to the manager's inbox privately.
export default function AfterVisit() {
  const { id } = useParams()
  const club = useClub()
  const v2 = useV2()
  const visit = v2.visits.find((v) => v.id === id)
  const [stars, setStars] = useState(visit?.rating ?? 0)
  const [note, setNote] = useState(visit?.note ?? '')
  const [sent, setSent] = useState(!!visit?.ratedAt && visit.rating <= 3)

  const { markVisitSeen } = v2
  useEffect(() => {
    if (visit && !visit.seen) markVisitSeen(visit.id)
  }, [visit, markVisitSeen])

  if (!visit) return <Navigate to="/v2" replace />

  const branch = getBranch(visit.branchId)
  const treat = v2.treats.find((t) => t.visitId === visit.id)
  const total = visit.points + (visit.bonus || 0)

  const rate = (n) => {
    setStars(n)
    setSent(false)
    v2.rateVisit(visit.id, n, n <= 3 ? note : '')
  }

  const sendNote = (e) => {
    e.preventDefault()
    v2.rateVisit(visit.id, stars, note.trim())
    setSent(true)
  }

  return (
    <>
      <section className="v2-head v2-visit-head">
        <div style={{ alignSelf: 'flex-end' }}>
          <BackButton to="/v2" close label="Close" />
        </div>
        <img className="v2-visit-plate" src="/images/hero/plate-carbonara.jpg" alt="" style={{ marginTop: -14 }} />
        <h1 className="v2-cd" style={{ fontSize: 42, lineHeight: '38px', marginTop: 4 }}>Thanks, {firstName(club.member?.name ?? '')}</h1>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span className="v2-slab" style={{ fontSize: 44, lineHeight: 1, color: 'var(--gold)' }}>+{formatPoints(total)}</span>
          <span className="v2-cd" style={{ fontSize: 26, lineHeight: '26px' }}>points added</span>
        </span>
        <span className="v2-small">
          Bill {rupees(visit.paid)} at {branch?.name}
          {visit.bonus > 0 && ' · double points'}
        </span>
      </section>

      <main className="v2-main" style={{ gap: 14 }}>
        {treat && (
          <section className="v2-ticket col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img className="v2-ticket-img" src={treat.image} alt="" />
              <div className="v2-grow" style={{ gap: 3 }}>
                <span className="v2-eyebrow">Your come-back treat</span>
                <h2 className="v2-cd" style={{ fontSize: 28, lineHeight: '26px' }}>Free {treat.name}</h2>
                <span className="v2-small v2-strong">With any main on your next visit</span>
              </div>
            </div>
            <div className="v2-perf" aria-hidden="true"><span /></div>
            <div className="v2-split">
              <span className="v2-small" style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800 }}>
                <ClockIcon width={16} height={16} />
                Come back by {dayMonth(treat.expiresAt)}
              </span>
              <span className="v2-small v2-strong">{levers.comeBack.days} days</span>
            </div>
          </section>
        )}

        <section className="v2-card v2-pad v2-stack" style={{ alignItems: 'center', textAlign: 'center', gap: 10, padding: '18px 16px' }}>
          <h2 className="v2-cd" style={{ fontSize: 28, lineHeight: '26px' }}>How was your visit?</h2>
          <div className="v2-stars" role="group" aria-label="Rating">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" className={`v2-star ${n <= stars ? 'on' : ''}`} onClick={() => rate(n)} aria-label={n === 1 ? '1 star' : `${n} stars`} aria-pressed={n === stars}>
                <StarShape />
              </button>
            ))}
          </div>
          {stars === 0 && <span className="v2-small v2-muted">Tap a star. It takes one second.</span>}
          {stars >= 4 && (
            <>
              <span className="v2-body v2-muted">Glad you enjoyed it. Could you tell others?</span>
              <a className="v2-btn v2-btn-line v2-btn-sm" href={branch ? mapsUrl(branch) : '#'} target="_blank" rel="noreferrer">Write a Google review</a>
            </>
          )}
          {stars > 0 && stars <= 3 && !sent && (
            <form onSubmit={sendNote} className="v2-stack" style={{ width: '100%', textAlign: 'left' }}>
              <label className="v2-field">
                <span>Sorry about that. What went wrong?</span>
                <textarea className="v2-input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="The branch manager reads this and calls you back" />
              </label>
              <button type="submit" className="v2-btn v2-btn-wine v2-btn-block">Send to the manager</button>
            </form>
          )}
          {stars > 0 && stars <= 3 && sent && <span className="v2-body v2-muted">Thank you. The manager at {branch?.shortName} will call you.</span>}
        </section>

        <Link to="/v2" className="v2-btn v2-btn-red v2-btn-lg v2-btn-block">Done</Link>
      </main>
    </>
  )
}
