import { Link } from 'react-router-dom'
import { QrIcon } from '../components/Icons.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { nextReward } from '../data/club.js'
import { dishSlug } from '../data/menu.js'
import { fridayMania, nextFriday } from '../data/offers.js'
import { firstName, formatDay, formatLongDay, formatPoints } from '../lib/format.js'
import { useCountUp, useEntered } from '../lib/motion.js'
import Welcome from './Welcome.jsx'

const shortName = (name) => name.replace(/^Any /, '')

// Home does three things: your points (and the one button you need at the counter), a voucher that's
// ready, and this week's offer. Everything else lives in its own tab.
function MemberHome() {
  const { member, balance, vouchers } = useClub()
  const shown = useCountUp(balance)
  const entered = useEntered()

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').sort((a, b) => a.expiresAt - b.expiresAt)
  const next = nextReward(balance)
  const progress = next ? Math.min(100, (balance / next.points) * 100) : 100
  const isFriday = new Date().getDay() === 5

  return (
    <div className="home">
      <header className="home-head rise">
        <span className="home-date">{formatLongDay(new Date())}</span>
        <h1 className="large-title">Ciao, {firstName(member.name)}</h1>
      </header>

      <section className="points-hero poster rise" style={{ '--i': 1 }} aria-label="Your points">
        <span className="points-glow" aria-hidden="true" />
        <div className="points-hero-top">
          <div>
            <span className="points-label">Your points</span>
            <span className="hatch points-big" aria-hidden="true">{formatPoints(shown)}</span>
            <span className="sr-only">{formatPoints(balance)} points</span>
          </div>
          <img className="pop" src={brand.logo} alt="" />
        </div>
        <div className="progress">
          <div className="progress-row">
            <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to your next reward">
              <span className="progress-fill" style={{ width: `${entered ? progress : 0}%` }} />
            </div>
            {next && <img className="progress-goal" src={next.image} alt="" />}
          </div>
          <p>{next ? `${formatPoints(next.points - balance)} points to a free ${shortName(next.name)}` : 'You can have anything on the rewards list'}</p>
        </div>
        <Link className="btn btn-gold btn-block" to="/card">
          <QrIcon width={20} height={20} /> Show my code
        </Link>
      </section>

      {ready.length > 0 && (
        <div className="rise" style={{ '--i': 2 }}>
          <Link to={`/wallet/${ready[0].id}`} className="voucher-card card">
            <img src={ready[0].image} alt="" />
            <span className="voucher-card-text">
              <span className="ready-label">
                <span className="live-dot" aria-hidden="true" />
                {ready.length === 1 ? 'Ready to use' : `${ready.length} vouchers ready`}
              </span>
              <strong>Free {ready[0].name}</strong>
              <span>Use by {formatDay(ready[0].expiresAt)}</span>
            </span>
            <span className="pill-btn">Use</span>
          </Link>
        </div>
      )}

      <section className="home-section rise" style={{ '--i': 3 }}>
        <h2 className="section-title">This week</h2>
        <Link to={`/menu/${dishSlug(fridayMania.heroDish)}`} className="offer-card poster press">
          <span className="shine" aria-hidden="true" />
          <span className="offer-text">
            <span className="hatch offer-kicker">FridayMania</span>
            <strong>Buy 1, get 1 free</strong>
            <span>{fridayMania.heroDish}</span>
            <span className="offer-date">{isFriday ? 'Today' : `Next: ${formatDay(nextFriday())}`}</span>
          </span>
          <img className="offer-photo" src={fridayMania.image} alt="" />
        </Link>
      </section>
    </div>
  )
}

export default function Home() {
  const { member } = useClub()
  return member ? <MemberHome /> : <Welcome />
}
