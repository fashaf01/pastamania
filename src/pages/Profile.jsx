import { Link, Navigate, useNavigate } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { ChevronIcon } from '../components/Icons.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { formatDate, formatPhone, formatPoints } from '../lib/format.js'
import { BUILD_ID } from '../lib/updates.js'

export default function Profile() {
  const { member, activity, signOut } = useClub()
  const navigate = useNavigate()

  if (!member) return <Navigate to="/join" replace />

  const leave = () => {
    if (window.confirm('Sign out? Your points on this phone will be cleared.')) {
      signOut()
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      <AppBar title="Profile" back="/" />
      <div className="pad">
        <section className="profile">
          <span className="avatar big">{member.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{member.name}</strong>
            <span className="muted">{member.phone}</span>
            <span className="muted">Member since {formatDate(member.joinedAt)}</span>
          </div>
        </section>

        <ul className="list links">
          <li><Link to="/branches">Branches & opening hours <ChevronIcon width={18} height={18} /></Link></li>
          <li><Link to="/catering">Event catering <ChevronIcon width={18} height={18} /></Link></li>
          <li><Link to="/staff">Counter screen (staff demo) <ChevronIcon width={18} height={18} /></Link></li>
          <li><a href={`tel:${brand.phone}`}>Call us · {formatPhone(brand.phone)}</a></li>
          <li><a href={brand.socials.instagram} target="_blank" rel="noreferrer">Instagram</a></li>
        </ul>

        <section className="block">
          <h2 className="h2">Points history</h2>
          <ul className="list">
            {activity.slice(0, 20).map((a) => (
              <li key={a.id} className="list-row">
                <span className="row-text">
                  <strong>{a.label}</strong>
                  <span>{formatDate(a.at)}</span>
                </span>
                <span className={`points-delta ${a.points < 0 ? 'minus' : ''}`}>
                  {a.points > 0 ? '+' : ''}
                  {formatPoints(a.points)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <button className="text-btn" onClick={leave}>Sign out</button>
        <p className="version">Version {BUILD_ID}</p>
      </div>
    </>
  )
}
