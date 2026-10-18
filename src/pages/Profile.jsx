import { Link, useNavigate } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { ChevronIcon } from '../components/Icons.jsx'
import { JoinPrompt } from '../components/Loyalty.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { club, pointsForSpend } from '../data/club.js'
import { formatDate, formatLKR, formatPhone } from '../lib/format.js'

// Sample bills for demonstrating how points are earned when staff scan the member card.
const DEMO_VISITS = [
  { amount: 2290, label: 'Lunch at One Galle Face' },
  { amount: 4290, label: 'Double Penne combo' },
  { amount: 12500, label: 'Family dinner at Havelock' },
]

export default function Profile() {
  const { member, tier, recordPurchase, signOut } = useClub()
  const toast = useToast()
  const navigate = useNavigate()

  const visit = (v) => {
    recordPurchase(v.amount, v.label)
    toast(`+${pointsForSpend(v.amount, tier)} ${club.pointsName}`)
  }

  const leave = () => {
    if (window.confirm('Sign out and clear this device’s Club data?')) {
      signOut()
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      <AppBar title="Profile" back />
      <div className="screen-pad">
        {member ? (
          <section className="profile-head">
            <span className="avatar big">{member.name.charAt(0).toUpperCase()}</span>
            <div>
              <h2>{member.name}</h2>
              <p className="muted small">
                {tier.name} member since {formatDate(member.joinedAt)}
              </p>
              <p className="small">{member.phone}</p>
            </div>
          </section>
        ) : (
          <JoinPrompt />
        )}

        <div className="link-list">
          <Link to="/bookings">My bookings <ChevronIcon width={18} height={18} /></Link>
          <Link to="/rewards?tab=vouchers">My vouchers <ChevronIcon width={18} height={18} /></Link>
          <Link to="/rewards?tab=activity">Points history <ChevronIcon width={18} height={18} /></Link>
          <Link to="/offers">Offers & FridayMania <ChevronIcon width={18} height={18} /></Link>
          <Link to="/branches">Branches & hours <ChevronIcon width={18} height={18} /></Link>
          <Link to="/catering">Event catering <ChevronIcon width={18} height={18} /></Link>
        </div>

        <div className="link-list">
          <a href={`tel:${brand.phone}`}>Call us · {formatPhone(brand.phone)}</a>
          <a href={`mailto:${brand.email}`}>Email · {brand.email}</a>
          <a href={brand.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={brand.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
        </div>

        {member && (
          <section className="demo-box">
            <h3>Demo: earn points</h3>
            <p className="muted small">
              In the live app, staff scan your card at the till. Tap a sample bill to see points land on your card.
            </p>
            <div className="demo-buttons">
              {DEMO_VISITS.map((v) => (
                <button key={v.label} className="btn btn-outline btn-sm" onClick={() => visit(v)}>
                  {formatLKR(v.amount)}
                </button>
              ))}
            </div>
          </section>
        )}

        {member && (
          <button className="text-btn" onClick={leave}>Sign out</button>
        )}
        <p className="muted small center">Prototype · Club data is stored on this device only.</p>
      </div>
    </>
  )
}
