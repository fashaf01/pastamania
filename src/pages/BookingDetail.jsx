import { useParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { formatLKR } from '../lib/format.js'

const summary = (b, session, branch) =>
  [
    `Dough Workz booking ${b.ref}`,
    `${formatSessionDate(session)} ${formatSessionTime(session)} at ${branch.name}`,
    ...b.children.map((c, i) => `Child ${i + 1}: ${c.name} (age ${c.age})`),
    `Parent: ${b.parentName}, ${b.phone}`,
    b.notes ? `Notes: ${b.notes}` : null,
    `Total: ${formatLKR(b.total)} (pay at branch)`,
  ]
    .filter(Boolean)
    .join('\n')

const downloadCalendar = (b, session, branch) => {
  const stamp = `${session.date.replaceAll('-', '')}T${session.time.replace(':', '')}00`
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PastaMania Sri Lanka//Club//EN',
    'BEGIN:VEVENT',
    `UID:${b.ref}@pastamania.lk`,
    `DTSTART;TZID=Asia/Colombo:${stamp}`,
    `SUMMARY:Dough Workz at PastaMania ${branch.shortName}`,
    `LOCATION:${branch.address.replaceAll(',', '\\,')}`,
    `DESCRIPTION:Booking ${b.ref}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  const a = Object.assign(document.createElement('a'), { href: url, download: `dough-workz-${b.ref}.ics` })
  a.click()
  URL.revokeObjectURL(url)
}

export default function BookingDetail() {
  const { ref } = useParams()
  const { bookings, cancelBooking } = useClub()
  const booking = bookings.find((b) => b.ref === ref)
  const session = booking && getSession(booking.sessionId)

  if (!booking || !session) {
    return (
      <>
        <AppBar title="Booking" back="/book" />
        <p className="empty">We couldn’t find that booking.</p>
      </>
    )
  }

  const branch = getBranch(session.branchId)
  const cancelled = booking.status === 'cancelled'
  const mailto = `mailto:${brand.email}?subject=${encodeURIComponent(`Dough Workz booking ${booking.ref}`)}&body=${encodeURIComponent(summary(booking, session, branch))}`

  const cancel = () => {
    if (window.confirm('Cancel this booking?')) cancelBooking(booking.ref)
  }

  return (
    <>
      <AppBar title="Booking" back="/book" />
      <div className="pad">
        <article className={`ticket ${cancelled ? 'faded' : ''}`}>
          <p className="ticket-status">{cancelled ? 'Cancelled' : 'Requested'}</p>
          <h2 className="retro retro-red ticket-title">{workshop.title}</h2>
          <p className="ticket-when">
            {formatSessionDate(session)} · {formatSessionTime(session)}
          </p>
          <p className="muted">{branch.name}</p>
          <div className="ticket-qr">
            <QRCode value={`PASTAMANIA:BOOKING:${booking.ref}`} size={140} label="Booking QR code" />
            <span className="code">{booking.ref}</span>
          </div>
          <dl className="details">
            <div>
              <dt>Kids</dt>
              <dd>{booking.children.map((c) => `${c.name} (${c.age})`).join(', ')}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{formatLKR(booking.total)} · pay at branch</dd>
            </div>
          </dl>
        </article>

        {!cancelled && (
          <>
            <p className="hint">Show this ticket when you arrive. Send it to PastaMania so the team can confirm by phone.</p>
            <div className="stack">
              <a className="btn btn-primary btn-block" href={mailto}>Send to PastaMania</a>
              <button className="btn btn-outline btn-block" onClick={() => downloadCalendar(booking, session, branch)}>Add to calendar</button>
            </div>
            <button className="text-btn" onClick={cancel}>Cancel booking</button>
          </>
        )}
      </div>
    </>
  )
}
