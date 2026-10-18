import { useParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { CalendarIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { formatLKR, formatPhone } from '../lib/format.js'

const summary = (b, session, branch) =>
  [
    `Dough Workz booking ${b.ref}`,
    `Session: ${formatSessionDate(session)} ${formatSessionTime(session)} at ${branch.name}`,
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
    `DESCRIPTION:Booking ${b.ref} – ${b.children.length} little chef(s)`,
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
        <AppBar title="Booking" back="/bookings" />
        <p className="empty">We couldn’t find that booking.</p>
      </>
    )
  }

  const branch = getBranch(session.branchId)
  const cancelled = booking.status === 'cancelled'
  const text = summary(booking, session, branch)
  const mailto = `mailto:${brand.email}?subject=${encodeURIComponent(`Dough Workz booking ${booking.ref}`)}&body=${encodeURIComponent(text)}`

  const cancel = () => {
    if (window.confirm('Cancel this booking?')) cancelBooking(booking.ref)
  }

  return (
    <>
      <AppBar title="Booking" back="/bookings" />
      <div className="screen-pad">
        <article className={`ticket ${cancelled ? 'cancelled' : ''}`}>
          <div className="ticket-head red-paper">
            <p className="caps-gold">{workshop.subtitle}</p>
            <p className="retro retro-gold ticket-title">{workshop.title}</p>
            <span className={`status status-${booking.status}`}>{cancelled ? 'Cancelled' : 'Requested'}</span>
          </div>
          <div className="ticket-body">
            <QRCode value={`PASTAMANIA:BOOKING:${booking.ref}`} size={150} label="Booking QR code" />
            <p className="ticket-ref">{booking.ref}</p>
            <dl className="ticket-details">
              <div>
                <dt>When</dt>
                <dd>
                  {formatSessionDate(session)} · {formatSessionTime(session)}
                </dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>{branch.name}</dd>
              </div>
              <div>
                <dt>Little chefs</dt>
                <dd>{booking.children.map((c) => `${c.name} (${c.age})`).join(', ')}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatLKR(booking.total)} · pay at branch</dd>
              </div>
            </dl>
          </div>
        </article>

        {!cancelled && (
          <>
            <p className="notice">
              Send your booking to PastaMania so the team can confirm your slot. They’ll call you on {booking.phone}.
            </p>
            <div className="stack">
              <a className="btn btn-primary btn-block" href={mailto}>Send booking to PastaMania</a>
              {brand.whatsapp && (
                <a
                  className="btn btn-whatsapp btn-block"
                  href={`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(text)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Send on WhatsApp
                </a>
              )}
              <button className="btn btn-outline btn-block" onClick={() => downloadCalendar(booking, session, branch)}>
                <CalendarIcon width={18} height={18} /> Add to calendar
              </button>
              <a className="btn btn-outline btn-block" href={`tel:${brand.workshopPhone}`}>
                Call {formatPhone(brand.workshopPhone)}
              </a>
              <button className="text-btn" onClick={cancel}>Cancel booking</button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
