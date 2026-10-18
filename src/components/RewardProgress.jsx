import { bestReadyReward, nextReward } from '../data/club.js'
import { formatPoints } from '../lib/format.js'

// One clear goal: what the balance unlocks now, or how far the next free item is.
export default function RewardProgress({ balance }) {
  const ready = bestReadyReward(balance)
  const next = nextReward(balance)
  const pct = next ? Math.min(100, (balance / next.points) * 100) : 100

  return (
    <div className="progress">
      <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <p>
        {ready ? (
          <>
            <strong>Free {ready.name}</strong> is ready to redeem
          </>
        ) : (
          <>
            <strong>{formatPoints(next.points - balance)} points</strong> to a free {next.name}
          </>
        )}
      </p>
    </div>
  )
}
