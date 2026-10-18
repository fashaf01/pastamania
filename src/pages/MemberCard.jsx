import { Link } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { JoinPrompt, TierProgress } from '../components/Loyalty.jsx'
import QRCode from '../components/QRCode.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'
import { formatDate, formatPoints } from '../lib/format.js'

export default function MemberCard() {
  const { member, balance, tier, vouchers } = useClub()

  if (!member) {
    return (
      <>
        <AppBar title="My Card" />
        <div className="screen-pad">
          <JoinPrompt text={`Your member card lives here. Show it at the counter to earn ${club.pointsName} on every visit.`} />
        </div>
      </>
    )
  }

  const activeVouchers = vouchers.filter((v) => v.expiresAt > Date.now()).length

  return (
    <>
      <AppBar title="My Card" />
      <div className="screen-pad">
        <article className="member-card red-paper">
          <div className="member-card-top">
            <img src={brand.logo} alt="" width="56" height="56" />
            <div>
              <p className="retro retro-gold member-club">{club.name}</p>
              <span className="tier-badge">{tier.name}</span>
            </div>
          </div>
          <div className="member-qr">
            <QRCode value={`PASTAMANIA:MEMBER:${member.id}`} size={196} label="Member QR code" />
          </div>
          <p className="member-id">{member.id}</p>
          <div className="member-meta">
            <div>
              <span className="caps-gold">Member</span>
              <strong>{member.name}</strong>
            </div>
            <div>
              <span className="caps-gold">{club.pointsName}</span>
              <strong>{formatPoints(balance)}</strong>
            </div>
          </div>
        </article>

        <p className="center muted small card-hint">Show this code at the counter. Our team will scan it to add your points.</p>

        <section className="panel">
          <TierProgress />
          <p className="muted small">Member since {formatDate(member.joinedAt)}</p>
        </section>

        <div className="link-list">
          <Link to="/rewards?tab=vouchers">
            My vouchers <span className="count">{activeVouchers}</span>
          </Link>
          <Link to="/rewards">Redeem rewards</Link>
          <Link to="/me">Profile & settings</Link>
        </div>
      </div>
    </>
  )
}
