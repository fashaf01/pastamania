import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHead } from '../components/AppBar.jsx'
import { ChevronIcon, ClockIcon, InfoIcon, LockIcon, ReceiptIcon } from '../components/Icons.jsx'
import Sheet, { useSheetClose } from '../components/Sheet.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { club, nextReward, rewards } from '../data/club.js'
import { formatDay, formatPoints } from '../lib/format.js'
import { useCountUp, useEntered } from '../lib/motion.js'

const shortName = (name) => name.replace(/^Any /, '')
const RING = 2 * Math.PI * 28
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
          <h2 id="get-title">It’s yours!</h2>
          <p>
            Your free {shortName(reward.name)} is in Rewards, ready to use for {club.voucherValidDays} days.
          </p>
        </div>
        <div className="stack" style={{ gap: 4 }}>
          <button type="button" className="btn btn-ink btn-lg btn-block" onClick={() => navigate(`/wallet/${voucher.id}`, { state: { fresh: true } })}>
            Use it now
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
        <h2 id="get-title" className="get-title">{reward.name}</h2>
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
      {short > 0 && step === 'ask' && <p className="flash flash-error">You need {formatPoints(short)} more points for this one.</p>}
      <div className="stack" style={{ gap: 4 }}>
        <button type="button" className="btn btn-red btn-lg btn-block" onClick={get} disabled={short > 0 || step === 'busy'}>
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
  const [explaining, setExplaining] = useState(false)

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').sort((a, b) => a.expiresAt - b.expiresAt)
  const past = vouchers.filter((v) => voucherStatus(v) !== 'ready').slice(0, 10)
  const next = nextReward(balance)
  const progress = next ? Math.min(100, (balance / next.points) * 100) : 100
  // A voucher got in the last few seconds pops in.
  const isFresh = (v) => Date.now() - v.issuedAt < 4000

  return (
    <>
      <PageHead title="Rewards" />
      <div className="rewards">
        {member ? (
          <section className="summary card rise" aria-label="Your points">
            <div className="summary-points">
              <strong className="num" aria-hidden="true">{formatPoints(shown)}</strong>
              <span aria-hidden="true">points</span>
              <span className="sr-only">{formatPoints(balance)} points</span>
            </div>
            <div className="progress-row">
              <div className="progress-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to your next reward">
                <span className="progress-fill" style={{ width: `${entered ? progress : 0}%` }} />
              </div>
              {next && <img className="progress-goal" src={next.image} alt="" />}
            </div>
            <p className="num">{next ? `${formatPoints(next.points - balance)} points to a free ${shortName(next.name)}` : 'You can have anything on the list'}</p>
          </section>
        ) : (
          <section className="join-card poster rise">
            <span className="eyebrow">Join free</span>
            <p>Get {club.welcomeBonus} points today – enough for a free Garlic Bread.</p>
            <Link className="btn btn-gold btn-block" to="/join?next=/rewards">Join free</Link>
          </section>
        )}

        {ready.length > 0 && (
          <section className="group rise" style={{ '--i': 1 }}>
            <h2 className="section-title">Ready to use</h2>
            {ready.map((v) => (
              <div key={v.id} className={isFresh(v) ? 'pop' : undefined}>
                <Link to={`/wallet/${v.id}`} className="voucher-card card">
                  <img src={v.image} alt="" />
                  <span className="voucher-card-text">
                    <span className="ready-label">
                      <span className="live-dot" aria-hidden="true" />
                      {isFresh(v) ? 'Just added' : 'Ready to use'}
                    </span>
                    <strong>Free {v.name}</strong>
                    <span>Use by {formatDay(v.expiresAt)}</span>
                  </span>
                  <span className="pill-btn">Use</span>
                </Link>
              </div>
            ))}
          </section>
        )}

        <section className="group">
          <div className="rise" style={{ '--i': 2 }}>
            <h2 className="section-title">Get with your points</h2>
            <p className="section-sub">1 point for every LKR {club.spendPerPoint} you spend in store.</p>
          </div>
          <ul className="list-card card">
            {rewards.map((r, i) => {
              const open = member && r.points <= balance
              const share = member ? Math.min(1, balance / r.points) : 0
              return (
                <li key={r.id} className="reward-row rise" style={{ '--i': 3 + i }}>
                  <span className="reward-ring">
                    <svg viewBox="0 0 60 60" aria-hidden="true">
                      <circle className="ring-bg" cx="30" cy="30" r="28" />
                      <circle className={`ring-fg ${open ? 'done' : ''}`} cx="30" cy="30" r="28" strokeDasharray={RING} strokeDashoffset={entered ? RING * (1 - share) : RING} />
                    </svg>
                    <img src={r.image} alt="" loading="lazy" />
                  </span>
                  <span className="reward-row-text">
                    <strong>{r.name}</strong>
                    <span className="num">{formatPoints(r.points)} points</span>
                  </span>
                  {open ? (
                    <button type="button" className="pill-btn red" onClick={() => setPicked(r)} aria-label={`Get ${r.name}`}>
                      Get
                    </button>
                  ) : (
                    member && (
                      <span className="need">
                        <LockIcon width={14} height={14} /> {formatPoints(r.points - balance)} more
                      </span>
                    )
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <ul className="list-card card rise" style={{ '--i': 9 }}>
          {member && (
            <li>
              <Link className="list-row" to="/history">
                <span className="icon-tile sm gold"><ReceiptIcon width={16} height={16} /></span>
                <span className="grow">Points history</span>
                <ChevronIcon width={16} height={16} />
              </Link>
            </li>
          )}
          <li>
            <button type="button" className="list-row" onClick={() => setExplaining(true)}>
              <span className="icon-tile sm"><InfoIcon width={16} height={16} /></span>
              <span className="grow">How points work</span>
              <ChevronIcon width={16} height={16} />
            </button>
          </li>
        </ul>

        {past.length > 0 && (
          <section className="group">
            <h2 className="section-title">Used &amp; expired</h2>
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

      {explaining && (
        <Sheet title="How points work" onClose={() => setExplaining(false)}>
          <ol className="how-steps">
            <li><span className="how-n">1</span><span>Show your code at the counter before you pay.</span></li>
            <li><span className="how-n">2</span><span>Get 1 point for every LKR {club.spendPerPoint} at any branch.</span></li>
            <li><span className="how-n">3</span><span>Use your points for free food. Vouchers last {club.voucherValidDays} days.</span></li>
          </ol>
          <p className="footnote">Uber Eats and PickMe orders don’t earn points.</p>
        </Sheet>
      )}
    </>
  )
}
