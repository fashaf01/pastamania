import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHead } from '../components/AppBar.jsx'
import { ClockIcon, LockIcon, QrIcon } from '../components/Icons.jsx'
import RewardProgress from '../components/RewardProgress.jsx'
import Sheet from '../components/Sheet.jsx'
import Starburst from '../components/Starburst.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { club, rewards } from '../data/club.js'
import { formatPoints } from '../lib/format.js'

function RedeemSheet({ reward, balance, onConfirm, onClose }) {
  return (
    <Sheet labelledBy="redeem-title" onClose={onClose}>
      <div className="redeem-photo">
        <img src={reward.image} alt="" />
        <Starburst size={78}>
          <span className="big" style={{ fontSize: 17 }}>FREE</span>
        </Starburst>
      </div>
      <div className="stack" style={{ gap: 4 }}>
        <span className="eyebrow">Swap your points for</span>
        <h2 id="redeem-title" className="title-l" style={{ fontSize: 28 }}>{reward.name}</h2>
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
          <dd>{formatPoints(balance - reward.points)}</dd>
        </div>
      </dl>
      <p className="note">
        <ClockIcon width={18} height={18} />
        Your voucher lasts {club.voucherValidDays} days. Show it at the counter and it’s free.
      </p>
      <div className="stack" style={{ gap: 4 }}>
        <button type="button" className="btn btn-red btn-lg btn-block" onClick={onConfirm}>
          Swap {formatPoints(reward.points)} points
        </button>
        <button type="button" className="text-btn muted" onClick={onClose}>Not now</button>
      </div>
    </Sheet>
  )
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ready', label: 'Ready' },
  { id: 'later', label: 'Coming up' },
]

export default function Rewards() {
  const { member, balance, redeem } = useClub()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [confirming, setConfirming] = useState(null)

  const ready = rewards.filter((r) => member && r.points <= balance)
  const later = rewards.filter((r) => !ready.includes(r))
  const shown = filter === 'ready' ? ready : filter === 'later' ? later : rewards
  const counts = { all: rewards.length, ready: ready.length, later: later.length }

  const confirmRedeem = () => {
    const voucher = redeem(confirming)
    setConfirming(null)
    if (voucher) navigate(`/wallet/${voucher.id}`, { state: { fresh: true } })
  }

  return (
    <>
      <PageHead title="Rewards">{member && <Link to="/history">Points history</Link>}</PageHead>

      <section className="points-card poster">
        {member ? (
          <>
            <div className="points-card-top">
              <div className="stack" style={{ gap: 2 }}>
                <span className="eyebrow">Your points</span>
                <span key={balance} className="hatch points-big">{formatPoints(balance)}</span>
              </div>
              <Link className="btn btn-gold btn-sm" to="/card">
                <QrIcon width={16} height={16} /> Earn
              </Link>
            </div>
            <RewardProgress balance={balance} />
          </>
        ) : (
          <>
            <span className="eyebrow">Join free</span>
            <p style={{ fontSize: 17, color: '#fff' }}>
              Get {club.welcomeBonus} points today – enough for a free Garlic Bread.
            </p>
            <Link className="btn btn-gold btn-block" to="/join?next=/rewards">Join free</Link>
          </>
        )}
      </section>

      {member && (
        <div className="chips" role="group" aria-label="Filter rewards">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label} · {counts[f.id]}
            </button>
          ))}
        </div>
      )}

      <ul className="reward-grid">
        {shown.map((r) => {
          const open = member && r.points <= balance
          return (
            <li key={r.id} className={`reward-card card ${open || !member ? '' : 'locked'}`}>
              <div className="reward-photo">
                <img src={r.image} alt="" loading="lazy" />
                {open && <span className="ready-badge">Ready</span>}
              </div>
              <div className="reward-body">
                <div>
                  <strong>{r.name}</strong>
                  <span className="num">{formatPoints(r.points)} points</span>
                </div>
                {open ? (
                  <button type="button" className="btn btn-red btn-sm btn-block" onClick={() => setConfirming(r)}>
                    Redeem
                  </button>
                ) : (
                  member && (
                    <span className="locked-pill">
                      <LockIcon width={14} height={14} /> {formatPoints(r.points - balance)} more
                    </span>
                  )
                )}
              </div>
            </li>
          )
        })}
      </ul>
      {shown.length === 0 && <p className="empty">Nothing here yet – keep earning.</p>}

      <div className="info-card soft-card">
        <span className="icon-tile sm gold" style={{ borderRadius: '50%', width: 36, height: 36 }}>
          <ClockIcon width={18} height={18} />
        </span>
        <p>
          1 point for every LKR {club.spendPerPoint} in store. Vouchers last {club.voucherValidDays} days from the day you swap. Uber Eats and
          PickMe orders don’t earn points.
        </p>
      </div>
      <div style={{ height: 32 }} />

      {confirming && <RedeemSheet reward={confirming} balance={balance} onConfirm={confirmRedeem} onClose={() => setConfirming(null)} />}
    </>
  )
}
