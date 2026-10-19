import { Link, Navigate } from 'react-router-dom'
import { useBack } from '../components/AppBar.jsx'
import { ChevronIcon, CloseIcon, SunIcon, TicketIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { rewards } from '../data/club.js'
import { formatMemberCode, formatPoints } from '../lib/format.js'

// The counter screen: the member's code, big, with nothing else competing for the camera.
export default function MemberCard() {
  const { member, balance, vouchers } = useClub()
  const close = useBack('/')

  if (!member) return <Navigate to="/join?next=/card" replace />

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready')
  const treats = rewards.filter((r) => r.points <= balance).length

  return (
    <div className="code-screen">
      <div className="code-top">
        <button type="button" className="round-btn on-red" onClick={close} aria-label="Close">
          <CloseIcon width={20} height={20} />
        </button>
        <span className="club-word">
          PastaMania <b>Club</b>
        </span>
        <span />
      </div>

      <div className="code-title">
        <h1 className="hatch">Scan to earn</h1>
        <p>Show this at the counter before you pay.</p>
      </div>

      <article className="code-card">
        <div className="code-name">
          <strong>{member.name}</strong>
          <span>{formatMemberCode(member.id)}</span>
        </div>
        <div className="qr-wrap">
          <QRCode value={`PASTAMANIA:MEMBER:${member.id}`} size={232} level="H" label="Member QR code" />
          <span className="qr-logo" aria-hidden="true">
            <img src={brand.logo} alt="" />
          </span>
        </div>
        <div className="code-stats">
          <div>
            <strong key={balance}>{formatPoints(balance)}</strong>
            <span>Points</span>
          </div>
          <div>
            <strong>{treats}</strong>
            <span>Treats ready</span>
          </div>
        </div>
      </article>

      {ready.length > 0 ? (
        <Link to={`/wallet/${ready[0].id}`} className="code-link">
          <span className="icon-tile md"><TicketIcon width={20} height={20} /></span>
          <span className="code-link-text">
            <strong>{ready.length === 1 ? `Free ${ready[0].name} is ready` : `${ready.length} vouchers are ready`}</strong>
            <small>Using it today? Show the voucher instead.</small>
          </span>
          <ChevronIcon width={18} height={18} />
        </Link>
      ) : (
        <span />
      )}

      <p className="code-hint">
        <SunIcon width={16} height={16} />
        Turn your screen brightness up if the scanner struggles.
      </p>
    </div>
  )
}
