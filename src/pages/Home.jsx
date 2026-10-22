import { Link } from 'react-router-dom'
import ActivityRow from '../components/ActivityRow.jsx'
import { ArrowIcon, BagIcon, BookIcon, ChefIcon, ChevronIcon, MoonIcon, PinIcon, QrIcon, SunIcon } from '../components/Icons.jsx'
import { useOrder } from '../components/OrderSheet.jsx'
import { NextUp, RewardTrack } from '../components/RewardProgress.jsx'
import Starburst from '../components/Starburst.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { club, nextReward, rewards } from '../data/club.js'
import { dishSlug } from '../data/menu.js'
import { fridayMania, nextFriday } from '../data/offers.js'
import { formatSessionDate, formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { firstName, formatDay, formatPoints, monthShort } from '../lib/format.js'
import { DARK_MODE, useTheme } from '../lib/theme.jsx'
import Welcome from './Welcome.jsx'

const todayKey = () => new Date().toISOString().slice(0, 10)

function FridayMania() {
  const friday = nextFriday()
  const isToday = friday.getDay() === new Date().getDay()
  return (
    <section className="section">
      <div className="promo poster">
        <div className="promo-body">
          <span className="promo-kicker">FridayMania</span>
          <p className="hatch promo-headline">
            Buy 1,
            <br />
            Get 1.
          </p>
          <span className="promo-caps">Only on Fridays.</span>
          <span className="promo-sub">This week’s hero dish: {fridayMania.heroDish}</span>
          <div className="promo-chips">
            <span>Dine-in</span>
            <span>Takeaway</span>
            <span>Delivery</span>
          </div>
        </div>
        <Starburst size={96}>
          {isToday ? (
            <span className="big" style={{ fontSize: 22 }}>TODAY</span>
          ) : (
            <>
              <span className="small">FRI</span>
              <span className="big" style={{ fontSize: 30 }}>{friday.getDate()}</span>
              <span className="small">{monthShort(friday).toUpperCase()}</span>
            </>
          )}
        </Starburst>
        <div className="promo-photo">
          <img src={fridayMania.image} alt={fridayMania.heroDish} />
          <Link className="btn btn-white" to={`/menu/${dishSlug(fridayMania.heroDish)}`}>
            See the dish <ArrowIcon width={16} height={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function MemberHome() {
  const { member, balance, vouchers, bookings, activity } = useClub()
  const { theme, toggle } = useTheme()
  const openOrder = useOrder()

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').sort((a, b) => a.expiresAt - b.expiresAt)
  const treats = rewards.filter((r) => r.points <= balance).length
  const upcoming = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({ ...b, session: getSession(b.sessionId) }))
    .filter((b) => b.session && b.session.date >= todayKey())
    .sort((a, b) => a.session.date.localeCompare(b.session.date))[0]
  const next = nextReward(balance)

  return (
    <>
      <header className="hero poster">
        <div className="hero-top">
          <div className="brand-row">
            <img src={brand.logo} alt="PastaMania" />
            <span className="club-word">
              PastaMania <b>Club</b>
            </span>
          </div>
          <div className="hero-tools">
            {DARK_MODE && (
              <button type="button" className="round-btn on-red" onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}>
                {theme === 'dark' ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
              </button>
            )}
            <Link to="/me" className="avatar" aria-label="My profile">
              {firstName(member.name).charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>

        <div className="hero-points">
          <span className="hero-hello">Ciao, {firstName(member.name)}</span>
          <div className="points-row">
            <span key={balance} className="hatch points-big">{formatPoints(balance)}</span>
            <span className="points-unit">points</span>
          </div>
          <span className="hero-line">
            {treats > 0
              ? `${treats} free ${treats === 1 ? 'treat' : 'treats'} ready to redeem`
              : `${formatPoints(next.points - balance)} points to your first freebie`}
          </span>
        </div>

        <RewardTrack balance={balance} />

        <div className="hero-actions">
          <Link className="btn btn-gold" to="/card">
            <QrIcon width={20} height={20} /> Show my code
          </Link>
          <Link className="btn btn-ghost" to="/rewards">Redeem</Link>
        </div>
      </header>

      {ready.length > 0 && (
        <Link to={`/wallet/${ready[0].id}`} className="voucher-strip">
          <img src={ready[0].image} alt="" />
          <span className="voucher-strip-text">
            <span className="eyebrow">{ready.length === 1 ? 'Voucher ready' : `${ready.length} vouchers ready`}</span>
            <strong>Free {ready[0].name}</strong>
            <span>Valid till {formatDay(ready[0].expiresAt)}</span>
          </span>
          <span className="strip-btn">Use</span>
        </Link>
      )}

      {upcoming && (
        <Link to={`/book/ticket/${upcoming.ref}`} className="mini-strip card">
          <img src={workshop.image} alt="" />
          <span className="mini-strip-text">
            <strong>Dough Workz · {formatSessionDate(upcoming.session)}, {formatSessionTime(upcoming.session)}</strong>
            <span>
              {getBranch(upcoming.session.branchId).name} · {upcoming.children.length} {upcoming.children.length === 1 ? 'child' : 'children'}
            </span>
          </span>
          <ChevronIcon width={18} height={18} />
        </Link>
      )}

      <NextUp balance={balance} />

      <FridayMania />

      <section className="section">
        <h2 className="title-l">Hungry for more?</h2>
        <div className="tiles">
          <button type="button" className="tile card" onClick={openOrder}>
            <span className="icon-tile"><BagIcon /></span>
            <span><strong>Order delivery</strong><span>Uber Eats · PickMe</span></span>
          </button>
          <Link className="tile card" to="/menu">
            <span className="icon-tile"><BookIcon /></span>
            <span><strong>Full menu</strong><span>Pasta, pizza &amp; more</span></span>
          </Link>
          <Link className="tile card" to="/branches">
            <span className="icon-tile"><PinIcon /></span>
            <span><strong>Branches</strong><span>3 in Colombo</span></span>
          </Link>
          <Link className="tile card" to="/book">
            <span className="icon-tile"><ChefIcon /></span>
            <span><strong>Kids workshops</strong><span>Dough Workz</span></span>
          </Link>
        </div>
      </section>

      {activity.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="title-l">Recent activity</h2>
            <Link to="/history">History</Link>
          </div>
          <ul className="activity card">
            {activity.slice(0, 3).map((a) => (
              <ActivityRow key={a.id} activity={a} />
            ))}
          </ul>
        </section>
      )}

      <section className="how soft-card">
        <h2 className="label-caps">How points work</h2>
        <ol>
          <li><span className="how-n">1</span><span>Show your code at the counter before you pay.</span></li>
          <li><span className="how-n">2</span><span>Earn 1 point for every LKR {club.spendPerPoint} at any branch.</span></li>
          <li><span className="how-n">3</span><span>Swap points for free food. Uber Eats and PickMe orders don’t earn points.</span></li>
        </ol>
      </section>
      <div style={{ height: 32 }} />
    </>
  )
}

export default function Home() {
  const { member } = useClub()
  return member ? <MemberHome /> : <Welcome />
}
