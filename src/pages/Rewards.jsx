import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import QRCode from '../components/QRCode.jsx'
import RewardProgress from '../components/RewardProgress.jsx'
import Sheet from '../components/Sheet.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { club, rewards } from '../data/club.js'
import { formatDate, formatPoints } from '../lib/format.js'

export default function Rewards() {
  const { member, balance, vouchers, redeem } = useClub()
  const [confirming, setConfirming] = useState(null)
  const [voucher, setVoucher] = useState(null)
  const active = vouchers.filter((v) => v.expiresAt > Date.now())

  const confirmRedeem = () => {
    const issued = redeem(confirming)
    setConfirming(null)
    if (issued) setVoucher(issued)
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

        {active.length > 0 && (
          <section className="block">
            <h2 className="h2">Ready to use</h2>
            <ul className="list">
              {active.map((v) => (
                <li key={v.id}>
                  <button className="list-row" onClick={() => setVoucher(v)}>
                    <img src={v.image} alt="" />
                    <span className="row-text">
                      <strong>{v.name}</strong>
                      <span>Use by {formatDate(v.expiresAt)}</span>
                    </span>
                    <span className="pill pill-red">Show</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
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
          <p className="footnote">1 point for every LKR {club.spendPerPoint} · vouchers last {club.voucherValidDays} days</p>
        </section>
      </div>

      {confirming && (
        <Sheet title={`Redeem ${confirming.name}?`} onClose={() => setConfirming(null)}>
          <img className="sheet-photo" src={confirming.image} alt="" />
          <p>
            Uses {formatPoints(confirming.points)} of your {formatPoints(balance)} points. You’ll get a voucher to show at the counter.
          </p>
          <button className="btn btn-primary btn-block" onClick={confirmRedeem}>Redeem</button>
        </Sheet>
      )}

      {voucher && (
        <Sheet title={voucher.name} onClose={() => setVoucher(null)}>
          <div className="voucher-ticket">
            <QRCode value={`PASTAMANIA:VOUCHER:${voucher.code}`} size={190} label="Voucher QR code" />
            <p className="code">{voucher.code}</p>
            <p className="muted">Valid until {formatDate(voucher.expiresAt)}</p>
          </div>
          <p className="center muted">Show this at the counter. One use only.</p>
        </Sheet>
      )}
    </>
  )
}
