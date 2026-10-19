import { Link, Navigate } from 'react-router-dom'
import ActivityRow from '../components/ActivityRow.jsx'
import AppBar from '../components/AppBar.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { formatPoints } from '../lib/format.js'

// Every point earned and spent, newest first.
export default function History() {
  const { member, balance, activity } = useClub()

  if (!member) return <Navigate to="/join?next=/history" replace />

  return (
    <>
      <AppBar title="Points history" back="/me" />
      <div className="page">
        <div className="points-card poster" style={{ margin: 0 }}>
          <span className="eyebrow">Balance</span>
          <span className="hatch points-big">{formatPoints(balance)}</span>
          <Link className="btn btn-gold btn-sm" to="/rewards" style={{ alignSelf: 'flex-start' }}>Spend on free food</Link>
        </div>
        {activity.length > 0 ? (
          <ul className="activity card">
            {activity.map((a) => (
              <ActivityRow key={a.id} activity={a} />
            ))}
          </ul>
        ) : (
          <p className="empty">Nothing yet. Show your code when you pay to start earning.</p>
        )}
      </div>
    </>
  )
}
