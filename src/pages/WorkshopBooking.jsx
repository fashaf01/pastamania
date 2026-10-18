import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { MinusIcon, PlusIcon } from '../components/Icons.jsx'
import { JoinPrompt } from '../components/Loyalty.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { getBranch } from '../data/branches.js'
import { club, pointsForSpend } from '../data/club.js'
import { formatSessionDate, formatSessionTime, getSession, seatsLeft, workshop } from '../data/workshops.js'
import { formatLKR } from '../lib/format.js'

const AGES = Array.from({ length: workshop.maxAge - workshop.minAge + 1 }, (_, i) => workshop.minAge + i)

export default function WorkshopBooking() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const { member, tier, bookings, book } = useClub()
  const session = getSession(sessionId)

  const [children, setChildren] = useState([{ name: '', age: '' }])
  const [parentName, setParentName] = useState(member?.name ?? '')
  const [phone, setPhone] = useState(member?.phone ?? '')
  const [notes, setNotes] = useState('')

  const left = session ? seatsLeft(session, bookings) : 0
  if (!session || left <= 0) {
    return (
      <>
        <AppBar title="Book Dough Workz" back="/bookings" />
        <p className="empty">{session ? 'This session is full. Please pick another date.' : 'This session is no longer available.'}</p>
      </>
    )
  }

  const branch = getBranch(session.branchId)
  const maxKids = Math.max(1, Math.min(workshop.maxChildrenPerBooking, left))
  const total = children.length * workshop.pricePerChild

  const setCount = (n) =>
    setChildren((list) => (n > list.length ? [...list, { name: '', age: '' }] : list.slice(0, n)))
  const updateChild = (i, key, value) =>
    setChildren((list) => list.map((c, j) => (j === i ? { ...c, [key]: value } : c)))

  const submit = (e) => {
    e.preventDefault()
    const booking = book({
      sessionId: session.id,
      children: children.map((c) => ({ name: c.name.trim(), age: Number(c.age) })),
      parentName: parentName.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      total,
    })
    toast('Booking requested!')
    navigate(`/bookings/${booking.ref}`, { replace: true })
  }

  return (
    <>
      <AppBar title="Book Dough Workz" back="/bookings" />
      <div className="screen-pad">
        <section className="panel session-summary">
          <span className="caps-label">{workshop.subtitle}</span>
          <strong>
            {formatSessionDate(session)} · {formatSessionTime(session)}
          </strong>
          <span className="muted small">
            {branch.name} · {left} seats left
          </span>
        </section>

        {!member ? (
          <JoinPrompt title="Join to book" text="Members book Dough Workz in seconds and keep all their tickets in one place." />
        ) : (
          <form className="form" onSubmit={submit}>
            <div className="stepper-row">
              <span className="form-label">Little chefs</span>
              <div className="stepper">
                <button type="button" onClick={() => setCount(children.length - 1)} disabled={children.length <= 1} aria-label="Fewer children">
                  <MinusIcon width={18} height={18} />
                </button>
                <span aria-live="polite">{children.length}</span>
                <button type="button" onClick={() => setCount(children.length + 1)} disabled={children.length >= maxKids} aria-label="More children">
                  <PlusIcon width={18} height={18} />
                </button>
              </div>
            </div>

            {children.map((c, i) => (
              <fieldset key={i} className="child">
                <legend>Child {i + 1}</legend>
                <div className="form-row child-row">
                  <label>
                    Name
                    <input required value={c.name} onChange={(e) => updateChild(i, 'name', e.target.value)} autoComplete="off" />
                  </label>
                  <label>
                    Age
                    <select required value={c.age} onChange={(e) => updateChild(i, 'age', e.target.value)}>
                      <option value="" disabled>
                        –
                      </option>
                      {AGES.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </fieldset>
            ))}

            <label>
              Parent / guardian
              <input required value={parentName} onChange={(e) => setParentName(e.target.value)} autoComplete="name" />
            </label>
            <label>
              Mobile
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
            </label>
            <label>
              Allergies or notes
              <textarea rows="2" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
            </label>

            <section className="summary">
              <div>
                <span>
                  {children.length} × {formatLKR(workshop.pricePerChild)}
                </span>
                <strong>{formatLKR(total)}</strong>
              </div>
              <p className="muted small">Pay at the branch on the day. You’ll earn about {pointsForSpend(total, tier)} {club.pointsName} when you attend.</p>
            </section>

            <button type="submit" className="btn btn-primary btn-block">Request booking</button>
          </form>
        )}
      </div>
    </>
  )
}
