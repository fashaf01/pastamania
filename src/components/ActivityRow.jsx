import { formatDay, formatLKR, formatPoints } from '../lib/format.js'
import { GiftIcon, ReceiptIcon, StarIcon } from './Icons.jsx'

// One line of the points history: what happened, when, and the points it added or took.
const describe = (a) => {
  const day = formatDay(a.at)
  switch (a.type) {
    case 'earn':
      return { Icon: ReceiptIcon, tone: 'gold', title: 'In-store visit', sub: `${day}${a.amount ? ` · ${formatLKR(a.amount)}` : ''}${a.undone ? ' · undone' : ''}` }
    case 'bonus':
      return { Icon: StarIcon, tone: 'gold', title: 'Welcome to the Club', sub: `${day} · joining gift` }
    case 'redeem':
      return { Icon: GiftIcon, tone: 'red', title: `Got ${a.label}`, sub: `${day} · voucher in Rewards` }
    default:
      return { Icon: ReceiptIcon, tone: 'red', title: a.label || 'Correction at the counter', sub: day }
  }
}

export default function ActivityRow({ activity }) {
  const { Icon, tone, title, sub } = describe(activity)
  const plus = activity.points > 0
  return (
    <li className={`activity-row ${activity.undone ? 'undone' : ''}`}>
      <span className={`icon-tile md ${tone === 'gold' ? 'gold' : ''}`}>
        <Icon width={20} height={20} />
      </span>
      <span className="activity-text">
        <strong>{title}</strong>
        <span>{sub}</span>
      </span>
      <span className={`delta ${plus ? 'plus' : ''}`}>
        {plus ? '+' : '−'}
        {formatPoints(Math.abs(activity.points))}
      </span>
    </li>
  )
}
