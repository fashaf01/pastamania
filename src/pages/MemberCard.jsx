import { Link, Navigate } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { ChevronIcon, GiftIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'
import { formatMemberCode, formatPoints } from '../lib/format.js'

// The counter screen: the member's code, big, with nothing else competing for the camera.
export default function MemberCard() {
  const { member, balance, vouchers } = useClub()

  if (!member) return <Navigate to="/join?next=/card" replace />

  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready')

  return (
    <>
      <AppBar title="My code" back="/" />
      <div className="pad">
        <p className="lead center">Show this when you pay. You earn 1 point for every LKR {club.spendPerPoint}.</p>

        <article className="code-card">
          <div className="code-head">
            <div>
              <span className="code-label">Member</span>
              <strong>{member.name}</strong>
            </div>
            <img src={brand.logo} alt="" width="48" height="48" />
          </div>
          <div className="code-qr">
            <QRCode value={`PASTAMANIA:MEMBER:${member.id}`} size={220} label="Member QR code" />
          </div>
          <p className="code-number">{formatMemberCode(member.id)}</p>
          <p className="code-points">
            <span key={balance}>{formatPoints(balance)}</span> points on your card
          </p>
        </article>

        {ready.length > 0 && (
          <Link to="/wallet" className="row ready-row">
            <span className="row-icon"><GiftIcon width={20} height={20} /></span>
            <span className="row-text">
              <strong>{ready.length === 1 ? `Free ${ready[0].name} ready` : `${ready.length} free items ready`}</strong>
              <span>Open your Wallet to show the voucher</span>
            </span>
            <ChevronIcon width={18} height={18} />
          </Link>
        )}
      </div>
    </>
  )
}
