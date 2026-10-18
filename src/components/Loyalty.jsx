import { Link, useLocation } from 'react-router-dom'
import { useClub } from '../context/ClubContext.jsx'
import { club } from '../data/club.js'
import { formatPoints } from '../lib/format.js'

export function TierProgress() {
  const { lifetimePoints, tier, nextTier } = useClub()
  if (!nextTier) return <p className="tier-note">You’ve reached our top tier. Grazie!</p>

  const span = nextTier.minPoints - tier.minPoints
  const pct = Math.min(100, ((lifetimePoints - tier.minPoints) / span) * 100)
  return (
    <div className="tier-progress">
      <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="tier-note">
        <strong>{formatPoints(nextTier.minPoints - lifetimePoints)}</strong> more points to <strong>{nextTier.name}</strong>
      </p>
    </div>
  )
}

export function PointsCard({ children }) {
  const { member, balance, tier } = useClub()
  return (
    <section className="points-card">
      <div className="points-top">
        <span className="tier-badge">{tier.name}</span>
        <span className="small">{member.id}</span>
      </div>
      <p className="points-balance">
        <span className="retro retro-gold">{formatPoints(balance)}</span>
        <span className="caps-white">{club.pointsName}</span>
      </p>
      <TierProgress />
      {children}
    </section>
  )
}

export function JoinPrompt({ title = `Join ${club.name}`, text }) {
  const { pathname } = useLocation()
  return (
    <section className="join-card red-paper">
      <span className="starburst join-burst" aria-hidden="true">+{club.welcomeBonus}</span>
      <h2 className="retro retro-gold">{title}</h2>
      <p>{text ?? `Earn ${club.pointsName} on every visit, unlock free food and book Dough Workz in seconds. Get ${club.welcomeBonus} points just for joining.`}</p>
      <Link className="btn btn-gold" to={`/join?next=${encodeURIComponent(pathname)}`}>Join free</Link>
    </section>
  )
}
