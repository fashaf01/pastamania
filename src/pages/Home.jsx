import { Link } from 'react-router-dom'
import DishCard from '../components/DishCard.jsx'
import { ChevronIcon, QrIcon } from '../components/Icons.jsx'
import Sticker from '../components/Sticker.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { nextReward, rewards } from '../data/club.js'
import { dishSlug, favourites, menus } from '../data/menu.js'
import { fridayMania, nextFriday } from '../data/offers.js'
import { formatSessionTime, getSession, seatsLeft, upcomingSessions, workshop } from '../data/workshops.js'
import { daysUntil, firstName, formatDay, formatLKR, formatPoints, loadBranchId, monthShort, weekdayShort } from '../lib/format.js'
import { useCountUp, useEntered } from '../lib/motion.js'
import { useNow } from '../lib/useNow.js'
import Welcome from './Welcome.jsx'

// 'Fri 23 Oct · starts in 16h 38m', or 'On now · today only' on a Friday.
const fridayLine = (now) => {
  if (now.getDay() === 5) return 'On now · today only'
  const start = nextFriday(now)
  start.setHours(0, 0, 0, 0)
  const mins = Math.max(0, Math.floor((start - now) / 60000))
  const [d, h, m] = [Math.floor(mins / 1440), Math.floor(mins / 60) % 24, mins % 60]
  return `${formatDay(start)} · starts in ${d > 0 ? `${d}d ${h}h` : `${h}h ${m}m`}`
}

// The member's branch from the menu, else One Galle Face (the menu's default).
const homeBranch = () => {
  const saved = loadBranchId()
  return saved && menus[saved] ? saved : 'ogf'
}

// The next kids workshop: the member's own booking if they have one coming up, else the next session with
// places left. Booked members get their ticket, not another "book".
function WorkshopRow({ session, booking, left }) {
  const when = new Date(`${session.date}T${session.time}`)
  const kids = booking?.children.length
  return (
    <Link to={booking ? `/book/ticket/${booking.ref}` : `/book?session=${session.id}`} className="event-row grain">
      <span className="date-tile">
        <small>{weekdayShort(when)}</small>
        <b>{when.getDate()}</b>
        <small>{monthShort(when)}</small>
      </span>
      <span className="event-row-text">
        <small className="eyebrow">
          {booking ? 'You’re booked' : session.label ?? (
            <>
              <span>Ages {workshop.minAge}–{workshop.maxAge}</span> · <span>{formatLKR(workshop.pricePerChild)}</span>
            </>
          )}
        </small>
        <strong className="cd">Little chefs, real pizza</strong>
        <small>
          <span>{getBranch(session.branchId).shortName}</span> · <span>{formatSessionTime(session)}</span> ·{' '}
          <span>{booking ? `${kids} ${kids === 1 ? 'child' : 'children'}` : `${left} ${left === 1 ? 'place' : 'places'} left`}</span>
        </small>
      </span>
      <ChevronIcon width={22} height={22} strokeWidth={2.4} />
    </Link>
  )
}

const GOAL_R = 52
const GOAL_RING = 2 * Math.PI * GOAL_R

// Home does three things: your points (and the one button you need at the counter), a voucher that's
// ready, and this week's offer. Everything else lives in its own tab.
function MemberHome() {
  const { member, balance, vouchers, bookings } = useClub()
  const shown = useCountUp(balance)
  const entered = useEntered()
  const now = useNow(30 * 1000)

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').sort((a, b) => a.expiresAt - b.expiresAt)
  const next = nextReward(balance)
  const progress = next ? Math.min(100, (balance / next.points) * 100) : 100
  // The plate you're working towards; once everything is in reach, the top reward.
  const goal = next ?? rewards[rewards.length - 1]
  const left = ready.length ? daysUntil(ready[0].expiresAt) : 0
  const branchId = homeBranch()
  const faves = favourites(branchId, fridayMania.heroDish)
  const upcoming = upcomingSessions(now)
  const booked = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({ booking: b, session: upcoming.find((s) => s.id === b.sessionId) }))
    .filter((b) => b.session)
    .sort((a, b) => (a.session.date + a.session.time).localeCompare(b.session.date + b.session.time))[0]
  const open = upcoming.map((s) => ({ session: s, left: seatsLeft(s, bookings) })).find((s) => s.left > 0)
  const kidsSession = booked ?? open

  return (
    <div className="home">
      <header className="wine-head grain">
        <div className="home-greet rise">
          <h1 className="cd">Ciao, {firstName(member.name)}</h1>
          <img src={brand.logo} alt="" />
        </div>
        <div className="points-block rise" style={{ '--i': 1 }}>
          <div className="points-row">
            <div className="points-main">
              <span className="eyebrow">Your points</span>
              <p className="points-line">
                <span className={`cd points-num ${formatPoints(balance).length > 4 ? 'long' : ''}`} aria-hidden="true">{formatPoints(shown)}</span>
                <span className="cd points-unit" aria-hidden="true">{balance === 1 ? 'pt' : 'pts'}</span>
                <span className="sr-only">{formatPoints(balance)} {balance === 1 ? 'point' : 'points'}</span>
              </p>
            </div>
            <Link
              to="/rewards"
              className="goal"
              aria-label={next ? `Next reward: ${next.name}, ${Math.round(progress)}% there. See rewards` : 'See rewards'}
            >
              <svg viewBox="0 0 112 112" aria-hidden="true">
                <circle className="goal-track" cx="56" cy="56" r={GOAL_R} />
                <circle className="goal-fill" cx="56" cy="56" r={GOAL_R} strokeDasharray={GOAL_RING} strokeDashoffset={entered ? GOAL_RING * (1 - progress / 100) : GOAL_RING} />
              </svg>
              <img src={goal.image} alt="" />
              <span className="goal-tag">{next ? 'Next' : 'Yours'}</span>
            </Link>
          </div>
          <p className="points-next">
            {next ? (
              <>
                {formatPoints(next.points - balance)} more for <strong>{next.name}</strong>
              </>
            ) : (
              'You can have anything on the rewards list'
            )}
          </p>
        </div>
        <div className="rise" style={{ '--i': 2 }}>
          <Link className="btn btn-gold btn-block" to="/card">
            <QrIcon width={22} height={22} /> Show my code
          </Link>
        </div>
      </header>

      <div className="home-body">
        {ready.length > 0 && (
          <section className="block rise" style={{ '--i': 3 }}>
            <h2 className="block-title cd">{ready.length === 1 ? 'Ready to use' : `${ready.length} ready to use`}</h2>
            <Link to={`/wallet/${ready[0].id}`} className="ticket-row">
              <img src={ready[0].image} alt="" />
              <span className="ticket-row-text">
                <strong className="cd">{ready[0].name}</strong>
                <small>{left <= 0 ? 'Use today' : `Use within ${left === 1 ? '1 day' : `${left} days`}`}</small>
              </span>
              <ChevronIcon width={22} height={22} strokeWidth={2.4} />
            </Link>
          </section>
        )}

        <section className="block rise" style={{ '--i': 4 }}>
          <h2 className="block-title cd">This Friday</h2>
          <Link to={`/menu/${dishSlug(fridayMania.heroDish)}`} className="friday-card">
            <img src={fridayMania.image} alt="" />
            <Sticker size={78} tilt={10} className="friday-sticker">
              <b className="slab">1+1</b>
              <small>Free</small>
            </Sticker>
            <span className="friday-text">
              <span className="eyebrow live"><span className="dot" aria-hidden="true" />{fridayLine(now)}</span>
              <span className="cd friday-word">Friday<b>Mania</b></span>
              <span>Buy one {fridayMania.heroDish}, get one free.</span>
            </span>
          </Link>
        </section>

        {faves.length > 0 && (
          <section className="block rise" style={{ '--i': 5 }}>
            <div className="section-head end">
              <div className="block-head">
                <span className="eyebrow">{getBranch(branchId).name}</span>
                <h2 className="block-title cd">Favourites</h2>
              </div>
              <Link to="/menu">Full menu</Link>
            </div>
            <div className="rail" aria-label="Favourite dishes">
              {faves.map((item, n) => (
                <DishCard key={item.name} item={item} variant={n % 3} branchId={branchId} />
              ))}
            </div>
          </section>
        )}

        {kidsSession && (
          <section className="block rise" style={{ '--i': 6 }}>
            <h2 className="block-title cd">Kids workshop</h2>
            <WorkshopRow {...kidsSession} />
          </section>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const { member } = useClub()
  return member ? <MemberHome /> : <Welcome />
}
