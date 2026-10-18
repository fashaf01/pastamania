import { Link, useLocation, useParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { CheckIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { formatDate } from '../lib/format.js'

// One voucher, full screen, for the counter to scan. It turns to "Enjoy!" the moment staff mark it used.
export default function Voucher() {
  const { id } = useParams()
  const { state } = useLocation()
  const { vouchers } = useClub()
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

  return (
    <>
      <AppBar title="Voucher" back="/wallet" />
      <div className="pad">
        {status === 'ready' && state?.fresh && <p className="lead center">It’s yours! Show this at the counter.</p>}

        <article className={`code-card voucher-${status}`}>
          <div className="code-head">
            <div>
              <span className="code-label">Free</span>
              <strong>{voucher.name}</strong>
            </div>
            <img src={brand.logo} alt="" width="48" height="48" />
          </div>

          {status === 'used' ? (
            <div className="voucher-done">
              <span className="done-tick"><CheckIcon width={44} height={44} /></span>
              <strong>Enjoy!</strong>
              <span>Used {formatDate(voucher.usedAt)}</span>
            </div>
          ) : status === 'expired' ? (
            <div className="voucher-done">
              <strong>Expired</strong>
              <span>This voucher ended on {formatDate(voucher.expiresAt)}</span>
            </div>
          ) : (
            <>
              <div className="code-qr">
                <QRCode value={`PASTAMANIA:VOUCHER:${voucher.code}`} size={220} label="Voucher QR code" />
              </div>
              <p className="code-number">{voucher.code}</p>
              <p className="code-points">Valid until {formatDate(voucher.expiresAt)} · one use</p>
            </>
          )}
        </article>

        {status === 'ready' ? (
          <p className="hint">Staff scan this code and hand over your free {voucher.name}. It works once.</p>
        ) : (
          <Link className="btn btn-outline btn-block back-btn" to="/rewards">
            Get another reward
          </Link>
        )}
      </div>
    </>
  )
}
