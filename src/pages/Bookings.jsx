import { Link } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { ChevronIcon } from '../components/Icons.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { getBranch } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, seatsLeft, upcomingSessions, workshop } from '../data/workshops.js'
import { formatLKR } from '../lib/format.js'

// Full sessions render as a plain row instead of a link.
const Row = ({ to, full, children }) =>
  full ? (
    <div className="session full">{children}</div>
  ) : (
    <Link to={to} className="session">
      {children}
    </Link>
  )

export default function Bookings() {
  const { bookings } = useClub()
  const sessions = upcomingSessions()
  const mine = bookings.map((b) => ({ ...b, session: getSession(b.sessionId) })).filter((b) => b.session)

  return (
    <>
      <AppBar title="Bookings" />
      <div className="screen-pad">
        <section className="workshop-hero red-paper">
          <img src={workshop.image} alt="" />
          <div className="workshop-hero-text">
            <p className="caps-gold">{workshop.subtitle}</p>
            <h2 className="retro retro-gold">{workshop.title}</h2>
            <p className="small">
              Ages {workshop.minAge}–{workshop.maxAge} · {formatLKR(workshop.pricePerChild)} per child
            </p>
          </div>
        </section>
        <ul className="ticks inline-ticks">
          {workshop.includes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>

        <h2 className="section-title retro retro-red">Choose a session</h2>
        {sessions.length === 0 && <p className="empty">New dates are coming soon. Check back shortly!</p>}
        <ul className="session-list">
          {sessions.map((s) => {
            const left = seatsLeft(s, bookings)
            const full = left <= 0
            return (
              <li key={s.id}>
                <Row to={`/bookings/workshop/${s.id}`} full={full}>
                  <span className="session-date">
                    <strong>{new Date(`${s.date}T00:00`).getDate()}</strong>
                    <span>{new Date(`${s.date}T00:00`).toLocaleDateString('en-GB', { month: 'short' })}</span>
                  </span>
                  <span className="session-text">
                    <strong>
                      {formatSessionDate(s)} · {formatSessionTime(s)}
                    </strong>
                    <span className="muted small">{getBranch(s.branchId).name}</span>
                    {s.label && <span className="tag">{s.label}</span>}
                  </span>
                  <span className={`seats ${left <= 4 ? 'low' : ''}`}>{full ? 'Full' : `${left} seats`}</span>
                  {!full && <ChevronIcon width={18} height={18} />}
                </Row>
              </li>
            )
          })}
        </ul>

        {mine.length > 0 && (
          <>
            <h2 className="section-title retro retro-red">My bookings</h2>
            <ul className="session-list">
              {mine.map((b) => (
                <li key={b.ref}>
                  <Link to={`/bookings/${b.ref}`} className={`session ${b.status === 'cancelled' ? 'full' : ''}`}>
                    <span className="session-text">
                      <strong>{b.ref}</strong>
                      <span className="small">
                        {formatSessionDate(b.session)} · {formatSessionTime(b.session)} · {getBranch(b.session.branchId).shortName}
                      </span>
                    </span>
                    <span className={`status status-${b.status}`}>{b.status === 'cancelled' ? 'Cancelled' : 'Requested'}</span>
                    <ChevronIcon width={18} height={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        <Link to="/catering" className="catering-card">
          <span className="event-icon" aria-hidden="true">🎉</span>
          <span>
            <strong>Event catering & live pasta</strong>
            <span className="muted small">Birthdays, office parties and celebrations – send us an enquiry.</span>
          </span>
          <ChevronIcon width={18} height={18} />
        </Link>
      </div>
    </>
  )
}
