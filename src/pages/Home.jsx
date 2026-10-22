import { Link } from 'react-router-dom'
import { ChevronIcon, QrIcon } from '../components/Icons.jsx'
import Sticker from '../components/Sticker.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { nextReward } from '../data/club.js'
import { dishSlug } from '../data/menu.js'
import { fridayMania, nextFriday } from '../data/offers.js'
import { daysUntil, firstName, formatDay, formatPoints } from '../lib/format.js'
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

// Home does three things: your points (and the one button you need at the counter), a voucher that's
// ready, and this week's offer. Everything else lives in its own tab.
function MemberHome() {
  const { member, balance, vouchers } = useClub()
  const shown = useCountUp(balance)
  const entered = useEntered()
  const now = useNow(30 * 1000)

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').sort((a, b) => a.expiresAt - b.expiresAt)
  const next = nextReward(balance)
  const progress = next ? Math.min(100, (balance / next.points) * 100) : 100
  const left = ready.length ? daysUntil(ready[0].expiresAt) : 0

  return (
    <div className="home">
      <header className="wine-head grain">
        <div className="home-greet rise">
          <h1 className="cd">Ciao, {firstName(member.name)}</h1>
          <img src={brand.logo} alt="" />
        </div>
        <div className="points-block rise" style={{ '--i': 1 }}>
          <span className="eyebrow">Your points</span>
          <p className="points-line">
            <span className="cd points-num" aria-hidden="true">{formatPoints(shown)}</span>
            <span className="cd points-unit" aria-hidden="true">pts</span>
            <span className="sr-only">{formatPoints(balance)} points</span>
          </p>
          <div className="bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to your next reward">
            <i style={{ width: `${entered ? progress : 0}%` }} />
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
      </div>
    </div>
  )
}

export default function Home() {
  const { member } = useClub()
  return member ? <MemberHome /> : <Welcome />
}
