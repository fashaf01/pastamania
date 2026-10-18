import { Link } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { ChevronIcon } from '../components/Icons.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { getBranch } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, seatsLeft, upcomingSessions, workshop } from '../data/workshops.js'
import { formatLKR } from '../lib/format.js'

function DateBox({ date }) {
  const d = new Date(`${date}T00:00`)
  return (
    <span className="date-box">
      <strong>{d.getDate()}</strong>
      <span>{d.toLocaleDateString('en-GB', { month: 'short' })}</span>
    </span>
  )
}

export default function Bookings() {
  const { bookings } = useClub()
  const sessions = upcomingSessions()
  const mine = bookings.map((b) => ({ ...b, session: getSession(b.sessionId) })).filter((b) => b.session)

  return (
    <>
      <AppBar title="Book" />
      <div className="pad">
        <section className="intro">
          <img src={workshop.image} alt="" />
          <div>
            <h2 className="h2">{workshop.title}</h2>
            <p className="muted">
              Kids pizza-making · ages {workshop.minAge}–{workshop.maxAge}
              <br />
              {formatLKR(workshop.pricePerChild)} per child · apron, cap, pizza & drink
            </p>
          </div>
        </section>

        {mine.length > 0 && (
          <section className="block">
            <h2 className="h2">Your bookings</h2>
            <ul className="list">
              {mine.map((b) => (
                <li key={b.ref}>
                  <Link to={`/book/ticket/${b.ref}`} className={`list-row ${b.status === 'cancelled' ? 'faded' : ''}`}>
                    <DateBox date={b.session.date} />
                    <span className="row-text">
                      <strong>
                        {formatSessionTime(b.session)} · {getBranch(b.session.branchId).shortName}
                      </strong>
                      <span>{b.status === 'cancelled' ? 'Cancelled' : `${b.ref} · ${b.children.length} ${b.children.length === 1 ? 'child' : 'children'}`}</span>
                    </span>
                    <ChevronIcon width={18} height={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="block">
          <h2 className="h2">Pick a date</h2>
          {sessions.length === 0 && <p className="empty">New dates coming soon.</p>}
          <ul className="list">
            {sessions.map((s) => {
              const left = seatsLeft(s, bookings)
              const content = (
                <>
                  <DateBox date={s.date} />
                  <span className="row-text">
                    <strong>
                      {formatSessionDate(s)} · {formatSessionTime(s)}
                    </strong>
                    <span>
                      {getBranch(s.branchId).name}
                      {s.label ? ` · ${s.label}` : ''}
                    </span>
                  </span>
                  <span className={`pill ${left <= 4 ? 'pill-red' : ''}`}>{left <= 0 ? 'Full' : `${left} left`}</span>
                </>
              )
              return (
                <li key={s.id}>
                  {left <= 0 ? (
                    <div className="list-row faded">{content}</div>
                  ) : (
                    <Link to={`/book/${s.id}`} className="list-row">{content}</Link>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <Link to="/catering" className="text-link">Planning a party? Ask about event catering →</Link>
      </div>
    </>
  )
}
