import { Link, Navigate } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import QRCode from '../components/QRCode.jsx'
import RewardProgress from '../components/RewardProgress.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'
import { formatLKR, formatPoints } from '../lib/format.js'

// Sample bills to demonstrate a staff scan in the prototype.
const DEMO_BILLS = [2290, 4290, 12500]

export default function MemberCard() {
  const { member, balance, recordPurchase } = useClub()
  const toast = useToast()

  if (!member) return <Navigate to="/join?next=/card" replace />

  const scan = (amount) => toast(`+${recordPurchase(amount, 'Visit')} points added`)

  return (
    <>
      <AppBar title="My card" back="/" />
      <div className="pad">
        <article className="member-card">
          <div className="member-head">
            <img src={brand.logo} alt="" width="44" height="44" />
            <div>
              <strong>{member.name}</strong>
              <span>{club.name}</span>
            </div>
          </div>
          <div className="member-qr">
            <QRCode value={`PASTAMANIA:MEMBER:${member.id}`} size={200} label="Member QR code" />
          </div>
          <p className="member-id">{member.id}</p>
          <p className="balance center">
            <span className="retro retro-gold">{formatPoints(balance)}</span> points
          </p>
        </article>

        <p className="hint">Show this code when you pay. You earn 1 point for every LKR {club.spendPerPoint}.</p>

        <section className="card-box">
          <RewardProgress balance={balance} />
          <Link to="/rewards" className="link">See rewards →</Link>
        </section>

        <section className="demo">
          <p>
            <strong>Demo:</strong> simulate the till scanning your card
          </p>
          <div className="demo-buttons">
            {DEMO_BILLS.map((amount) => (
              <button key={amount} className="chip" onClick={() => scan(amount)}>
                {formatLKR(amount)} bill
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
