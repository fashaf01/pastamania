import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { ChevronIcon, GiftIcon } from '../components/Icons.jsx'
import RewardProgress from '../components/RewardProgress.jsx'
import Sheet from '../components/Sheet.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { club, rewards } from '../data/club.js'
import { formatPoints } from '../lib/format.js'

export default function Rewards() {
  const { member, balance, vouchers, redeem } = useClub()
  const navigate = useNavigate()
  const [confirming, setConfirming] = useState(null)
  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').length
  // The balance can change while the sheet is open (the counter is another tab in this prototype).
  const short = confirming ? confirming.points - balance : 0

  const confirmRedeem = () => {
    const voucher = redeem(confirming)
    setConfirming(null)
    if (voucher) navigate(`/wallet/${voucher.id}`, { state: { fresh: true } })
  }

  return (
    <>
      <AppBar title="Rewards" />
      <div className="pad">
        {member ? (
          <section className="summary-card">
            <p className="balance dark">
              <span key={balance} className="retro">{formatPoints(balance)}</span> points
            </p>
            <RewardProgress balance={balance} />
          </section>
        ) : (
          <section className="summary-card">
            <p>
              <strong>Join free</strong> and get {club.welcomeBonus} points – enough for a free Garlic Bread today.
            </p>
            <Link className="btn btn-primary btn-block" to="/join?next=/rewards">Join free</Link>
          </section>
        )}

        {ready > 0 && (
          <Link to="/wallet" className="row ready-row">
            <span className="row-icon"><GiftIcon width={20} height={20} /></span>
            <span className="row-text">
              <strong>{ready === 1 ? '1 voucher ready' : `${ready} vouchers ready`}</strong>
              <span>In your Wallet</span>
            </span>
            <ChevronIcon width={18} height={18} />
          </Link>
        )}

        <section className="block">
          <h2 className="h2">Free food</h2>
          <ul className="list">
            {rewards.map((r) => {
              const short = r.points - balance
              return (
                <li key={r.id} className="list-row">
                  <img src={r.image} alt="" loading="lazy" />
                  <span className="row-text">
                    <strong>{r.name}</strong>
                    <span>{formatPoints(r.points)} points</span>
                  </span>
                  {member && short <= 0 ? (
                    <button className="btn btn-primary btn-sm" onClick={() => setConfirming(r)}>Redeem</button>
                  ) : (
                    member && <span className="pill">{formatPoints(short)} to go</span>
                  )}
                </li>
              )
            })}
          </ul>
          <p className="footnote">1 point for every LKR {club.spendPerPoint} spent in store · vouchers last {club.voucherValidDays} days</p>
        </section>
      </div>

      {confirming && (
        <Sheet title={`Redeem ${confirming.name}?`} onClose={() => setConfirming(null)}>
          <div className="confirm-item">
            <img src={confirming.image} alt="" />
            <p>A voucher for a free {confirming.name} goes into your Wallet. Show it at the counter within {club.voucherValidDays} days.</p>
          </div>
          <dl className="sum">
            <div>
              <dt>Your points</dt>
              <dd>{formatPoints(balance)}</dd>
            </div>
            <div>
              <dt>This reward</dt>
              <dd>−{formatPoints(confirming.points)}</dd>
            </div>
            <div className="sum-total">
              <dt>Left after</dt>
              <dd>{formatPoints(Math.max(0, balance - confirming.points))} points</dd>
            </div>
          </dl>
          {short > 0 && <p className="flash flash-error">You need {formatPoints(short)} more points for this one.</p>}
          <button className="btn btn-primary btn-block" onClick={confirmRedeem} disabled={short > 0}>Redeem</button>
          <button className="text-btn" onClick={() => setConfirming(null)}>Cancel</button>
        </Sheet>
      )}
    </>
  )
}
