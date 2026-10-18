import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { MinusIcon, PlusIcon } from '../components/Icons.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { getBranch } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, seatsLeft, workshop } from '../data/workshops.js'
import { formatLKR } from '../lib/format.js'

const AGES = Array.from({ length: workshop.maxAge - workshop.minAge + 1 }, (_, i) => workshop.minAge + i)

export default function WorkshopBooking() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const { member, bookings, book } = useClub()
  const session = getSession(sessionId)

  const [children, setChildren] = useState([{ name: '', age: '' }])
  const [phone, setPhone] = useState(member?.phone ?? '')
  const [notes, setNotes] = useState('')

  if (!member) return <Navigate to={`/join?next=/book/${sessionId}`} replace />

  const left = session ? seatsLeft(session, bookings) : 0
  if (!session || left <= 0) {
    return (
      <>
        <AppBar title="Book" back="/book" />
        <p className="empty">{session ? 'This date is full. Please pick another.' : 'This date is no longer available.'}</p>
      </>
    )
  }

  const maxKids = Math.min(workshop.maxChildrenPerBooking, left)
  const total = children.length * workshop.pricePerChild

  const setCount = (n) => setChildren((list) => (n > list.length ? [...list, { name: '', age: '' }] : list.slice(0, n)))
  const updateChild = (i, key, value) => setChildren((list) => list.map((c, j) => (j === i ? { ...c, [key]: value } : c)))

  const submit = (e) => {
    e.preventDefault()
    const booking = book({
      sessionId: session.id,
      children: children.map((c) => ({ name: c.name.trim(), age: Number(c.age) })),
      parentName: member.name,
      phone: phone.trim(),
      notes: notes.trim(),
      total,
    })
    navigate(`/book/ticket/${booking.ref}`, { replace: true })
  }

  return (
    <>
      <AppBar title="Book" back="/book" />
      <div className="pad">
        <p className="lead">
          <strong>
            {formatSessionDate(session)} · {formatSessionTime(session)}
          </strong>
          <br />
          <span className="muted">
            {workshop.title} · {getBranch(session.branchId).name}
          </span>
        </p>

        <form className="form" onSubmit={submit}>
          <div className="stepper-row">
            <span className="label">How many kids?</span>
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
            <div key={i} className="child-row">
              <label>
                <span className="label">Child {i + 1}</span>
                <input required placeholder="Name" value={c.name} onChange={(e) => updateChild(i, 'name', e.target.value)} autoComplete="off" />
              </label>
              <label>
                <span className="label">Age</span>
                <select required value={c.age} onChange={(e) => updateChild(i, 'age', e.target.value)} aria-label={`Child ${i + 1} age`}>
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
          ))}

          <label>
            <span className="label">Your mobile</span>
            <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
          </label>
          <label>
            <span className="label">Allergies or notes</span>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" />
          </label>

          <div className="total">
            <span>Total · pay at the branch</span>
            <strong>{formatLKR(total)}</strong>
          </div>
          <button type="submit" className="btn btn-primary btn-block">Book {children.length === 1 ? 'a place' : `${children.length} places`}</button>
        </form>
      </div>
    </>
  )
}
