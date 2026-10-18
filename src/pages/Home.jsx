import { Link } from 'react-router-dom'
import DishImage from '../components/DishImage.jsx'
import { BagIcon, ChefIcon, PinIcon, TagIcon, UserIcon } from '../components/Icons.jsx'
import { JoinPrompt, PointsCard } from '../components/Loyalty.jsx'
import { useOrder } from '../components/OrderSheet.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { rewards } from '../data/club.js'
import { events } from '../data/events.js'
import { signatureDishes } from '../data/menu.js'
import { fridayMania } from '../data/offers.js'
import { formatSessionDate, formatSessionTime, getSession } from '../data/workshops.js'
import { getBranch } from '../data/branches.js'
import { firstName, formatLKR, formatPoints } from '../lib/format.js'

export default function Home() {
  const openOrder = useOrder()
  const { member, balance, bookings } = useClub()
  const christmas = events.find((e) => e.id === 'christmas')
  const nextBooking = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({ ...b, session: getSession(b.sessionId) }))
    .filter((b) => b.session)
    .sort((a, b) => a.session.date.localeCompare(b.session.date))[0]

  return (
    <>
      <header className="home-head red-paper">
        <div className="home-bar">
          <img src={brand.logo} alt="PastaMania" width="48" height="48" />
          <Link to={member ? '/me' : '/join'} className="avatar" aria-label={member ? 'My profile' : 'Join or sign in'}>
            {member ? firstName(member.name).charAt(0).toUpperCase() : <UserIcon width={20} height={20} />}
          </Link>
        </div>
        <p className="retro retro-gold home-hello">{member ? `Ciao, ${firstName(member.name)}!` : 'Ciao!'}</p>
        <p className="caps-white home-sub">What’s cooking today?</p>
      </header>

      <div className="screen-pad home-body">
        {member ? (
          <PointsCard>
            <div className="points-actions">
              <Link className="btn btn-gold btn-sm" to="/card">Show my card</Link>
              <Link className="btn btn-ghost btn-sm" to="/rewards">Rewards</Link>
            </div>
          </PointsCard>
        ) : (
          <JoinPrompt />
        )}

        <nav className="quick" aria-label="Quick actions">
          <button onClick={openOrder}>
            <span className="quick-icon"><BagIcon /></span>Order
          </button>
          <Link to="/bookings">
            <span className="quick-icon"><ChefIcon /></span>Dough Workz
          </Link>
          <Link to="/offers">
            <span className="quick-icon"><TagIcon /></span>Offers
          </Link>
          <Link to="/branches">
            <span className="quick-icon"><PinIcon /></span>Branches
          </Link>
        </nav>

        {nextBooking && (
          <Link to={`/bookings/${nextBooking.ref}`} className="next-booking">
            <span className="caps-label">Your next workshop</span>
            <strong>
              {formatSessionDate(nextBooking.session)} · {formatSessionTime(nextBooking.session)}
            </strong>
            <span className="muted small">
              Dough Workz · {getBranch(nextBooking.session.branchId).name} · {nextBooking.children.length}{' '}
              {nextBooking.children.length === 1 ? 'child' : 'children'}
            </span>
          </Link>
        )}

        <Link to="/offers" className="friday-mini red-paper">
          <div>
            <p className="caps-gold">Every Friday</p>
            <p className="retro retro-gold friday-mini-title">FridayMania</p>
            <p className="retro retro-yellow friday-mini-deal">Buy 1, Get 1.</p>
          </div>
          <img src={fridayMania.pastHeroes[3].image} alt="" />
          <span className="starburst friday-mini-burst" aria-hidden="true">1+1</span>
        </Link>

        <section className="block">
          <div className="section-head">
            <h2 className="retro retro-red">Treats to unlock</h2>
            <Link to="/rewards" className="link">All →</Link>
          </div>
          <div className="hscroll">
            {rewards.map((r) => {
              const unlocked = member && balance >= r.points
              return (
                <Link key={r.id} to="/rewards" className="reward-mini">
                  <img src={r.image} alt="" loading="lazy" />
                  <strong>{r.name}</strong>
                  <span className={`pts-pill ${unlocked ? 'ready' : ''}`}>
                    {unlocked ? 'Ready to redeem' : `${formatPoints(r.points)} pts`}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="block">
          <div className="section-head">
            <h2 className="retro retro-red">Signature dishes</h2>
            <Link to="/menu" className="link">Menu →</Link>
          </div>
          <div className="hscroll">
            {signatureDishes.map((d) => (
              <article key={d.name} className="dish-card">
                <DishImage item={d} />
                <div className="dish-body">
                  <h3>{d.name}</h3>
                  <p className="muted small">{d.note}</p>
                  <p className="price">{formatLKR(d.price)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="block teaser">
          <span className="event-icon" aria-hidden="true">{christmas.icon}</span>
          <div>
            <span className="tag">{christmas.tag}</span>
            <h3>{christmas.title}</h3>
            <p className="muted small">{christmas.description}</p>
          </div>
        </section>
      </div>
    </>
  )
}
