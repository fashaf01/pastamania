import { Link, useParams } from 'react-router-dom'
import AppBar, { useBack } from '../components/AppBar.jsx'
import { CloseIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { rewards } from '../data/club.js'
import { daysUntil, formatDay } from '../lib/format.js'

// One voucher, full screen, for the counter to scan. It turns to "Enjoy!" the moment staff mark it used.
export default function Voucher() {
  const { id } = useParams()
  const { vouchers } = useClub()
  const close = useBack('/rewards')
  const voucher = vouchers.find((v) => v.id === id)

  if (!voucher) {
    return (
      <>
        <AppBar title="Voucher" back="/rewards" />
        <p className="empty">We couldn’t find that voucher.</p>
      </>
    )
  }

  const status = voucherStatus(voucher)
  const cost = rewards.find((r) => r.name === voucher.name)?.points
  const left = daysUntil(voucher.expiresAt)

  const heading = { ready: 'Ready to use', used: 'Used', expired: 'Expired' }[status]

  const statusLine = {
    ready: `Valid till ${formatDay(voucher.expiresAt)} · ${left === 1 ? '1 day' : `${left} days`} left`,
    used: `Used ${formatDay(voucher.usedAt ?? Date.now())}`,
    expired: `Ran out on ${formatDay(voucher.expiresAt)}`,
  }[status]

  const hint = {
    ready: `Show this at the counter. Staff scan it and your ${voucher.name} is free.`,
    used: 'Buon appetito! You’ll find it under Used & expired in Rewards.',
    expired: 'This voucher has expired. Use your points for a new one.',
  }[status]

  return (
    <div className="voucher-screen grain">
      <div className="screen-top">
        <span className="eyebrow" role="status">{heading}</span>
        <button type="button" className="round-btn on-red" onClick={close} aria-label="Close">
          <CloseIcon width={22} height={22} />
        </button>
      </div>

      <article className={`vticket ${status}`}>
        {status === 'ready' && <span className="stamp small">It’s yours!</span>}
        <div className="vticket-top">
          {voucher.image && <img className="vticket-photo" src={voucher.image} alt="" />}
          <h1 className="cd">{voucher.name}</h1>
          <span>{statusLine}</span>
        </div>
        <div className="tear" aria-hidden="true" />
        <div className="vticket-code">
          <div className="vticket-qr">
            <QRCode value={`PASTAMANIA:VOUCHER:${voucher.code}`} size={176} label="Voucher QR code" />
            {status === 'used' && <span className="stamp">Enjoy!</span>}
            {status === 'expired' && <span className="stamp grey">Expired</span>}
          </div>
          <span className="code">{voucher.code}</span>
          {cost && <small>Got for {cost} points · {formatDay(voucher.issuedAt)}</small>}
        </div>
      </article>

      <p className="voucher-hint">{hint}</p>

      <Link className="btn btn-ghost btn-block" to="/rewards">{status === 'ready' ? 'Back to rewards' : 'Get another reward'}</Link>
    </div>
  )
}
