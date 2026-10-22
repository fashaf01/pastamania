import { Link, Navigate } from 'react-router-dom'
import { useBack } from '../components/AppBar.jsx'
import { ChevronIcon, CloseIcon, SunIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { formatMemberCode } from '../lib/format.js'

// The counter screen: the member's code, big, with nothing else competing for the camera.
export default function MemberCard() {
  const { member, vouchers } = useClub()
  const close = useBack('/')

  if (!member) return <Navigate to="/join?next=/card" replace />

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready')

  return (
    <div className="code-screen grain">
      <div className="code-top">
        <button type="button" className="round-btn on-red" onClick={close} aria-label="Close">
          <CloseIcon width={22} height={22} />
        </button>
      </div>

      <div className="code-title rise">
        <span className="eyebrow">My code</span>
        <h1 className="cd">Show this<br />when you pay</h1>
      </div>

      <article className="code-card">
        <span className="corner c1" aria-hidden="true" />
        <span className="corner c2" aria-hidden="true" />
        <span className="corner c3" aria-hidden="true" />
        <span className="corner c4" aria-hidden="true" />
        <div className="qr-wrap">
          <QRCode value={`PASTAMANIA:MEMBER:${member.id}`} size={240} level="H" label="Member QR code" />
          <span className="qr-logo" aria-hidden="true">
            <img src={brand.logo} alt="" />
          </span>
          <span className="scan-line" aria-hidden="true" />
        </div>
      </article>

      <div className="code-number rise" style={{ '--i': 2 }}>
        <span className="eyebrow">Member number</span>
        <strong>{formatMemberCode(member.id)}</strong>
      </div>

      {ready.length > 0 && (
        <div className="rise" style={{ '--i': 3 }}>
          <Link to={`/wallet/${ready[0].id}`} className="ticket-row on-wine">
            <img src={ready[0].image} alt="" />
            <span className="ticket-row-text">
              <small className="eyebrow">Using a reward?</small>
              <strong className="cd">Show {ready[0].name}</strong>
            </span>
            <ChevronIcon width={22} height={22} strokeWidth={2.4} />
          </Link>
        </div>
      )}

      <p className="code-hint">
        <SunIcon width={16} height={16} />
        Turn your screen brightness up so it scans first time.
      </p>
    </div>
  )
}
