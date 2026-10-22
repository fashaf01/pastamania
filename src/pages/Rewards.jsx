import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronIcon, ClockIcon, LockIcon, QrIcon, ReceiptIcon } from '../components/Icons.jsx'
import Sheet, { useSheetClose } from '../components/Sheet.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { club, nextReward, rewards } from '../data/club.js'
import { formatDay, formatPoints, pointsText } from '../lib/format.js'
import { useCountUp, useEntered } from '../lib/motion.js'

const shortName = (name) => name.replace(/^Any /, '')
const RING = 2 * Math.PI * 29
const BURST = ['#fbb516', '#c8161e', '#1d7a3a', '#fbb516', '#ed1c25']

// Confirm → a short wait → "It's yours!" with a tick that draws itself.
function GetSheetBody({ reward, balance, redeem }) {
  const navigate = useNavigate()
  const close = useSheetClose()
  const [step, setStep] = useState('ask')
  const [voucher, setVoucher] = useState(null)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])

  // The balance can change while the sheet is open (the counter is another tab in this prototype).
  const short = reward.points - balance

  const get = () => {
    setStep('busy')
    timer.current = setTimeout(() => {
      const v = redeem(reward)
      setVoucher(v)
      setStep(v ? 'done' : 'ask')
    }, 600)
  }

  if (step === 'done') {
    return (
      <>
        <div className="success">
          <div className="success-mark">
            {BURST.concat(BURST).map((color, i) => (
              <span key={i} className="burst" style={{ transform: `rotate(${i * 36}deg)` }} aria-hidden="true">
                <i style={{ background: color }} />
              </span>
            ))}
            <svg viewBox="0 0 96 96" role="img" aria-label="Done">
              <circle className="success-bg" cx="48" cy="48" r="44" />
              <circle className="draw-ring" cx="48" cy="48" r="44" transform="rotate(-90 48 48)" />
              <path className="draw-tick" d="M30 49l12 12 24-26" />
            </svg>
          </div>
          <span className="stamp small static">It’s yours!</span>
          <h2 id="get-title" className="cd">{reward.name} is ready</h2>
          <p>
            Your free {shortName(reward.name)} is in Rewards, ready to use for {club.voucherValidDays} days.
          </p>
        </div>
        <div className="stack" style={{ gap: 4 }}>
          <button type="button" className="btn btn-gold btn-lg btn-block" onClick={() => navigate(`/wallet/${voucher.id}`)}>
            See my voucher
          </button>
          <button type="button" className="text-btn muted" onClick={close}>Done</button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="get-head">
        <img className="get-photo pop" src={reward.image} alt="" />
        <span className="get-kicker">Free reward</span>
        <h2 id="get-title" className="get-title cd">{reward.name}</h2>
      </div>
      <dl className="breakdown">
        <div>
          <dt>Your points</dt>
          <dd>{formatPoints(balance)}</dd>
        </div>
        <div>
          <dt>This reward</dt>
          <dd className="cost">−{formatPoints(reward.points)}</dd>
        </div>
        <div className="total">
          <dt>Left after</dt>
          <dd>{formatPoints(Math.max(0, balance - reward.points))}</dd>
        </div>
      </dl>
      <p className="note">
        <ClockIcon width={18} height={18} />
        Your voucher lasts {club.voucherValidDays} days. Show it at the counter and it’s free.
      </p>
      {short > 0 && step === 'ask' && <p className="flash flash-error">You need {pointsText(short)} more for this one.</p>}
      <div className="stack" style={{ gap: 4 }}>
        <button type="button" className="btn btn-gold btn-lg btn-block" onClick={get} disabled={short > 0 || step === 'busy'}>
          {step === 'busy' && <span className="spinner" aria-hidden="true" />}
          {step === 'busy' ? 'Getting it…' : `Get it for ${formatPoints(reward.points)} points`}
        </button>
        <button type="button" className="text-btn muted" onClick={close}>Not now</button>
      </div>
    </>
  )
}

export default function Rewards() {
  const { member, balance, vouchers, redeem } = useClub()
  const shown = useCountUp(balance)
  const entered = useEntered()
  const [picked, setPicked] = useState(null)

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').sort((a, b) => a.expiresAt - b.expiresAt)
  const past = vouchers.filter((v) => voucherStatus(v) !== 'ready').slice(0, 10)
  const next = nextReward(balance)
  const progress = next ? Math.min(100, (balance / next.points) * 100) : 100
  // A voucher got in the last few seconds pops in.
  const isFresh = (v) => Date.now() - v.issuedAt < 4000

  return (
    <>
      <header className="wine-head grain">
        {member ? (
          <>
            <div className="head-row rise">
              <h1 className="eyebrow">Rewards · your points</h1>
              <Link to="/card" className="round-btn gold press" aria-label="Show my code">
                <QrIcon width={22} height={22} />
              </Link>
            </div>
            <div className="points-block rise" style={{ '--i': 1 }}>
              <p className="points-line">
                <span className="cd points-num" aria-hidden="true">{formatPoints(shown)}</span>
                <span className="cd points-unit" aria-hidden="true">{balance === 1 ? 'point' : 'points'}</span>
                <span className="sr-only">{pointsText(balance)}</span>
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
                  'You can have anything on the list'
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="join-pitch rise">
            <h1 className="eyebrow">Rewards</h1>
            <p className="cd">Your next pasta<br /><span>is on us</span></p>
            <p>Join free and get {club.welcomeBonus} points today, enough for a free Garlic Bread.</p>
            <Link className="btn btn-gold btn-block" to="/join?next=/rewards">Join free</Link>
          </div>
        )}
      </header>

      <div className="rewards">
        {ready.length > 0 && (
          <section className="block rise" style={{ '--i': 2 }}>
            <h2 className="block-title cd">Ready to use</h2>
            {ready.map((v) => (
              <div key={v.id} className={isFresh(v) ? 'pop' : undefined}>
                <Link to={`/wallet/${v.id}`} className="ticket-row">
                  <img src={v.image} alt="" />
                  <span className="ticket-row-text">
                    <strong className="cd">{v.name}</strong>
                    <small>{isFresh(v) ? 'Just added' : `Use by ${formatDay(v.expiresAt)}`}</small>
                  </span>
                  <ChevronIcon width={22} height={22} strokeWidth={2.4} />
                </Link>
              </div>
            ))}
          </section>
        )}

        <section className="block">
          <div className="rise" style={{ '--i': 3 }}>
            <h2 className="block-title cd">Get with your points</h2>
          </div>
          <ul className="reward-list">
            {rewards.map((r, i) => {
              const open = member && r.points <= balance
              const share = member ? Math.min(1, balance / r.points) : 0
              return (
                <li key={r.id} className={`reward-row rise ${open ? 'open' : ''}`} style={{ '--i': 4 + i }}>
                  <span className="reward-ring">
                    <svg viewBox="0 0 64 64" aria-hidden="true">
                      <circle className="ring-bg" cx="32" cy="32" r="29" />
                      <circle className="ring-fg" cx="32" cy="32" r="29" strokeDasharray={RING} strokeDashoffset={entered ? RING * (1 - share) : RING} />
                    </svg>
                    <img src={r.image} alt="" loading="lazy" />
                  </span>
                  <span className="reward-row-text">
                    <strong>{r.name}</strong>
                    <span className="cd num">{formatPoints(r.points)} pts</span>
                  </span>
                  {open ? (
                    <button type="button" className="btn btn-gold btn-sm" onClick={() => setPicked(r)} aria-label={`Get ${r.name}`}>
                      Get
                    </button>
                  ) : (
                    member && (
                      <span className="need">
                        <LockIcon width={14} height={14} /> {formatPoints(r.points - balance)} to go
                      </span>
                    )
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section className="how-card rise" style={{ '--i': 10 }}>
          <h2 className="cd">How points work</h2>
          <ol className="how-steps">
            <li><span className="how-n">1</span><span><strong>Show your code</strong> when you pay in store.</span></li>
            <li><span className="how-n">2</span><span><strong>Earn 1 point</strong> for every LKR {club.spendPerPoint}.</span></li>
            <li><span className="how-n">3</span><span><strong>Get free food.</strong> Vouchers last {club.voucherValidDays} days.</span></li>
          </ol>
          <p className="footnote">Uber Eats and PickMe orders don’t earn points.</p>
        </section>

        {member && (
          <ul className="list-card card rise" style={{ '--i': 11 }}>
            <li>
              <Link className="list-row" to="/history">
                <span className="icon-tile sm gold"><ReceiptIcon width={16} height={16} /></span>
                <span className="grow">Points history</span>
                <ChevronIcon width={16} height={16} />
              </Link>
            </li>
          </ul>
        )}

        {past.length > 0 && (
          <section className="block">
            <h2 className="block-title cd">Used &amp; expired</h2>
            <ul className="list-card card">
              {past.map((v) => {
                const used = voucherStatus(v) === 'used'
                return (
                  <li key={v.id}>
                    <Link to={`/wallet/${v.id}`} className="past-row">
                      <img src={v.image} alt="" />
                      <div>
                        <strong>{v.name}</strong>
                        <span>{used ? `Used ${formatDay(v.usedAt)}` : `Ran out on ${formatDay(v.expiresAt)}`}</span>
                      </div>
                      <span className={`pill ${used ? 'pill-green' : 'pill-red'}`}>{used ? 'Used' : 'Expired'}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </div>

      {picked && (
        <Sheet labelledBy="get-title" onClose={() => setPicked(null)}>
          <GetSheetBody reward={picked} balance={balance} redeem={redeem} />
        </Sheet>
      )}
    </>
  )
}
