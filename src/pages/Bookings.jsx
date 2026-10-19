import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useBack } from '../components/AppBar.jsx'
import { BackIcon, CheckIcon, ChevronIcon, MinusIcon, PlusIcon } from '../components/Icons.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { getBranch } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, seatsLeft, upcomingSessions, workshop } from '../data/workshops.js'
import { formatLKR } from '../lib/format.js'

const AGES = Array.from({ length: workshop.maxAge - workshop.minAge + 1 }, (_, i) => workshop.minAge + i)

// Dough Workz: what it is, pick a session, add the kids, book. Pay at the branch on the day.
export default function Bookings() {
  const { member, bookings, book } = useClub()
  const navigate = useNavigate()
  const back = useBack('/')
  const [params] = useSearchParams()

  const sessions = upcomingSessions().map((s) => ({ ...s, left: seatsLeft(s, bookings) }))
  const firstOpen = sessions.find((s) => s.left > 0)
  const wanted = sessions.find((s) => s.id === params.get('session') && s.left > 0)
  const [sessionId, setSessionId] = useState((wanted ?? firstOpen)?.id ?? null)
  const [children, setChildren] = useState([{ name: '', age: '' }])
  const [phone, setPhone] = useState(member?.phone ?? '')
  const [notes, setNotes] = useState('')

  const session = sessions.find((s) => s.id === sessionId)
  const maxKids = Math.max(1, Math.min(workshop.maxChildrenPerBooking, session?.left ?? workshop.maxChildrenPerBooking))
  const kids = children.slice(0, maxKids)
  const total = kids.length * workshop.pricePerChild
  const mine = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({ ...b, session: getSession(b.sessionId) }))
    .find((b) => b.session && sessions.some((s) => s.id === b.sessionId))

  const setCount = (n) => setChildren((list) => (n > list.length ? [...list, { name: '', age: '' }] : list.slice(0, n)))
  const updateChild = (i, key, value) => setChildren((list) => list.map((c, j) => (j === i ? { ...c, [key]: value } : c)))

  const submit = (e) => {
    e.preventDefault()
    if (!session) return
    if (!member) {
      navigate(`/join?next=${encodeURIComponent(`/book?session=${session.id}`)}`)
      return
    }
    const booking = book({
      sessionId: session.id,
      children: kids.map((c) => ({ name: c.name.trim(), age: Number(c.age) })),
      parentName: member.name,
      phone: phone.trim(),
      notes: notes.trim(),
      total,
    })
    navigate(`/book/ticket/${booking.ref}`, { replace: true })
  }

  return (
    <form onSubmit={submit} style={{ display: 'contents' }}>
      <div className="book-hero">
        <img src={workshop.image} alt="A kid-sized margherita pizza" />
        <button type="button" className="round-btn on-photo" onClick={back} aria-label="Back">
          <BackIcon width={20} height={20} />
        </button>
      </div>

      <div className="sheet-body">
        <div className="dish-title">
          <span className="eyebrow">{workshop.subtitle}</span>
          <h1 className="title-xl" style={{ fontSize: 34 }}>{workshop.title}</h1>
          <span className="muted">
            Ages {workshop.minAge}–{workshop.maxAge} · {formatLKR(workshop.pricePerChild)} per child
          </span>
        </div>

        <ul className="includes card">
          {workshop.includes.map((x) => (
            <li key={x}>
              <span><CheckIcon width={14} height={14} strokeWidth={3} /></span>
              {x}
            </li>
          ))}
        </ul>

        {mine && (
          <Link to={`/book/ticket/${mine.ref}`} className="mini-strip card" style={{ margin: 0 }}>
            <span className="mini-strip-text">
              <strong>You’re booked for {formatSessionDate(mine.session)}</strong>
              <span>{mine.ref} · see your ticket</span>
            </span>
            <ChevronIcon width={18} height={18} />
          </Link>
        )}

        <section className="stack" style={{ gap: 12 }}>
          <h2 className="title-m">Pick a session</h2>
          {sessions.length === 0 ? (
            <p className="muted">New dates coming soon.</p>
          ) : (
            <div className="sessions" role="radiogroup" aria-label="Sessions">
              {sessions.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={s.id === sessionId}
                  className="session"
                  disabled={s.left <= 0}
                  onClick={() => setSessionId(s.id)}
                >
                  <span className="radio-dot" />
                  <span className="session-text">
                    <strong>{formatSessionDate(s)}</strong>
                    <span>
                      {formatSessionTime(s)} · {getBranch(s.branchId).name}
                    </span>
                  </span>
                  <span className="session-meta">
                    {s.label && <span className="tag tag-red">{s.label}</span>}
                    <span className={`seats ${s.left <= 4 ? 'low' : ''}`}>{s.left <= 0 ? 'Full' : `${s.left} places left`}</span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="stack" style={{ gap: 14 }}>
          <div className="stepper-row">
            <span>
              <strong>How many children?</strong>
              <small>Up to {maxKids} for this session</small>
            </span>
            <span className="stepper">
              <button type="button" onClick={() => setCount(kids.length - 1)} disabled={kids.length <= 1} aria-label="One fewer child">
                <MinusIcon width={18} height={18} />
              </button>
              <output aria-live="polite">{kids.length}</output>
              <button type="button" className="plus" onClick={() => setCount(kids.length + 1)} disabled={kids.length >= maxKids} aria-label="One more child">
                <PlusIcon width={18} height={18} />
              </button>
            </span>
          </div>
          {kids.map((c, i) => (
            <div key={i} className="form-row">
              <label className="field">
                <span className="field-label">Child {i + 1}</span>
                <input className="input" required placeholder="First name" value={c.name} onChange={(e) => updateChild(i, 'name', e.target.value)} autoComplete="off" />
              </label>
              <label className="field">
                <span className="field-label">Age</span>
                <select className="input" required value={c.age} onChange={(e) => updateChild(i, 'age', e.target.value)}>
                  <option value="" disabled>–</option>
                  {AGES.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </label>
            </div>
          ))}
        </section>

        {member && (
          <section className="form">
            <label className="field">
              <span className="field-label">Your mobile</span>
              <input className="input" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </label>
            <label className="field">
              <span className="field-label">
                Allergies or notes <span className="muted">(optional)</span>
              </span>
              <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
          </section>
        )}

        <Link to="/catering" className="text-btn" style={{ margin: 0 }}>Planning a party? Ask about event catering →</Link>
      </div>

      <div className="book-bar">
        <span>
          <strong>{formatLKR(total)}</strong>
          <small>
            {session
              ? `${kids.length} ${kids.length === 1 ? 'child' : 'children'} · ${formatSessionDate(session)}, ${formatSessionTime(session)} · pay at the branch`
              : 'Pick a session'}
          </small>
        </span>
        <button type="submit" className="btn btn-red" disabled={!session}>
          {member ? 'Book' : 'Join to book'}
        </button>
      </div>
    </form>
  )
}
