import { useParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { CalendarIcon, MailIcon, NavigateIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { getBranch, mapsUrl } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { formatLKR, monthShort, weekdayShort } from '../lib/format.js'

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
        <AppBar title="Workshop ticket" back="/wallet" />
        <p className="empty">We couldn’t find that booking.</p>
      </>
    )
  }

  const branch = getBranch(session.branchId)
  const cancelled = booking.status === 'cancelled'
  const when = new Date(`${session.date}T${session.time}`)
  const mailto = `mailto:${brand.email}?subject=${encodeURIComponent(`Dough Workz booking ${booking.ref}`)}&body=${encodeURIComponent(summary(booking, session, branch))}`

  const cancel = () => {
    if (window.confirm('Cancel this booking?')) cancelBooking(booking.ref)
  }

  return (
    <>
      <AppBar title="Workshop ticket" back="/wallet" />
      <div className="page">
        <span className={`pill status-pill ${cancelled ? 'pill-red' : 'pill-gold'}`}>{cancelled ? 'Cancelled' : 'Requested · we’ll confirm by phone'}</span>

        <article className={`event-ticket ${cancelled ? 'cancelled' : ''}`}>
          <div className="event-top poster">
            <div className="stack" style={{ gap: 2 }}>
              <span className="hatch">{workshop.title}</span>
              <span style={{ fontSize: 14, color: 'rgb(255 255 255 / 0.9)' }}>{workshop.subtitle}</span>
            </div>
            <div className="event-when">
              <span className="cal-box">
                <small>{weekdayShort(when)}</small>
                <b>{when.getDate()}</b>
                <small>{monthShort(when)}</small>
              </span>
              <div>
                <strong>{formatSessionTime(session)}</strong>
                <span>{branch.name}</span>
                <small>{branch.address}</small>
              </div>
            </div>
          </div>
          <div className="perf" aria-hidden="true">
            <span />
          </div>
          <div className="event-bottom">
            <QRCode value={`PASTAMANIA:BOOKING:${booking.ref}`} size={124} label="Booking QR code" />
            <dl>
              <div>
                <dt>Booking</dt>
                <dd className="code">{booking.ref}</dd>
              </div>
              <div>
                <dt>Children</dt>
                <dd>{booking.children.map((c) => `${c.name}, ${c.age}`).join(' · ')}</dd>
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
            <p className="muted center" style={{ fontSize: 14 }}>
              Show this ticket when you arrive. Send it to PastaMania so the team can confirm by phone.
            </p>
            <a className="btn btn-red btn-block" href={mailto}>
              <MailIcon width={18} height={18} /> Send to PastaMania
            </a>
            <div className="pairs">
              <a className="btn btn-outline btn-plain" href={mapsUrl(branch)} target="_blank" rel="noreferrer">
                <NavigateIcon width={18} height={18} /> Directions
              </a>
              <button type="button" className="btn btn-outline btn-plain" onClick={() => downloadCalendar(booking, session, branch)}>
                <CalendarIcon width={18} height={18} /> Add to calendar
              </button>
            </div>
            <button type="button" className="text-btn danger" onClick={cancel}>Cancel booking</button>
          </>
        )}
      </div>
    </>
  )
}
