import { Link, useLocation, useParams } from 'react-router-dom'
import AppBar, { useBack } from '../components/AppBar.jsx'
import { CloseIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { rewards } from '../data/club.js'
import { daysUntil, formatDay } from '../lib/format.js'

// One voucher, full screen, for the counter to scan. It turns to "Enjoy!" the moment staff mark it used.
export default function Voucher() {
  const { id } = useParams()
  const { state } = useLocation()
  const { vouchers } = useClub()
  const close = useBack('/wallet')
  const voucher = vouchers.find((v) => v.id === id)

  if (!voucher) {
    return (
      <>
        <AppBar title="Voucher" back="/wallet" />
        <p className="empty">We couldn’t find that voucher.</p>
      </>
    )
  }

  const status = voucherStatus(voucher)
  const cost = rewards.find((r) => r.name === voucher.name)?.points
  const left = daysUntil(voucher.expiresAt)

  const statusLine = {
    ready: `Valid till ${formatDay(voucher.expiresAt)} · ${left === 1 ? '1 day' : `${left} days`} left`,
    used: `Used ${formatDay(voucher.usedAt ?? Date.now())}`,
    expired: `Ran out on ${formatDay(voucher.expiresAt)}`,
  }[status]

  const hint = {
    ready: state?.fresh
      ? `It’s yours! Show this at the counter and your ${voucher.name} is free.`
      : `Show this at the counter. Staff scan it and your ${voucher.name} is free.`,
    used: 'Buon appetito! This voucher now sits under Used & expired in your wallet.',
    expired: 'This voucher has expired. Swap more points for a new one.',
  }[status]

  return (
    <div className="voucher-screen">
      <div className="screen-top">
        <button type="button" className="round-btn" onClick={close} aria-label="Close">
          <CloseIcon width={20} height={20} />
        </button>
        <span className="label-caps">Your voucher</span>
        <span />
      </div>

      <article className="ticket">
        {voucher.image && <img className="ticket-photo" src={voucher.image} alt="" />}
        <div className="ticket-head">
          <span className="eyebrow">Free</span>
          <h1>{voucher.name}</h1>
          <span>
            {cost ? `Swapped for ${cost} points · ` : ''}
            {formatDay(voucher.issuedAt)}
          </span>
        </div>
        <div className="perf" aria-hidden="true">
          <span />
        </div>
        <div className="ticket-code">
          <div className={`ticket-qr ${status === 'ready' ? '' : 'faded'}`}>
            <QRCode value={`PASTAMANIA:VOUCHER:${voucher.code}`} size={168} label="Voucher QR code" />
            {status === 'used' && <span className="stamp">Enjoy!</span>}
            {status === 'expired' && <span className="stamp grey">Expired</span>}
          </div>
          <span className="code">{voucher.code}</span>
          <span className={`ticket-status ${status === 'used' ? 'used' : ''}`} role="status">
            {statusLine}
          </span>
        </div>
      </article>

      <p className="voucher-hint">{hint}</p>

      {status === 'ready' ? (
        <Link className="btn btn-outline btn-block" to="/wallet">Back to wallet</Link>
      ) : (
        <Link className="btn btn-outline btn-block" to="/rewards">Get another reward</Link>
      )}
    </div>
  )
}
