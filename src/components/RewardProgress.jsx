import { nextReward, rewards } from '../data/club.js'
import { formatPoints } from '../lib/format.js'

// Where the balance sits along the reward ladder, as a share of the track (0–100).
// The six rewards are spaced evenly, so the fill moves proportionally between neighbouring stops.
const trackPosition = (balance) => {
  const stops = [0, ...rewards.map((r) => r.points)]
  for (let k = 0; k < stops.length - 1; k++) {
    if (balance < stops[k + 1]) return ((k + (balance - stops[k]) / (stops[k + 1] - stops[k])) / (stops.length - 1)) * 100
  }
  return 100
}

// Home hero: the free-food ladder with a photo at every stop; unlocked stops light up gold.
export function RewardTrack({ balance }) {
  const fill = trackPosition(balance)
  const unlocked = rewards.filter((r) => r.points <= balance).length
  return (
    <div className="track" role="img" aria-label={`${unlocked} of ${rewards.length} rewards unlocked`}>
      <span className="track-line" />
      <span className="track-fill" style={{ width: `${fill}%` }} />
      <span className="track-you" style={{ left: `${fill}%` }} />
      {rewards.map((r, i) => (
        <span key={r.id} className={`track-stop ${r.points <= balance ? 'open' : ''}`} style={{ left: `${((i + 1) / rewards.length) * 100}%` }}>
          <img src={r.image} alt="" />
          <span>{formatPoints(r.points)}</span>
        </span>
      ))}
    </div>
  )
}

const CIRCUMFERENCE = 2 * Math.PI * 36

// The next reward's photo inside a ring that fills as points come in.
export function NextUp({ balance }) {
  const next = nextReward(balance)
  const target = next ?? rewards[rewards.length - 1]
  const share = next ? balance / next.points : 1
  return (
    <div className="next-up card">
      <div className="ring">
        <svg viewBox="0 0 80 80" aria-hidden="true">
          <circle className="ring-track" cx="40" cy="40" r="36" />
          <circle className="ring-fill" cx="40" cy="40" r="36" strokeDasharray={`${share * CIRCUMFERENCE} ${CIRCUMFERENCE}`} />
        </svg>
        <img src={target.image} alt="" />
      </div>
      <div className="next-up-text">
        <span className="eyebrow">Next up</span>
        <strong>{next ? `Free ${next.name.replace(/^Any /, '')}` : 'Everything’s unlocked'}</strong>
        <span className="num">{next ? `${formatPoints(next.points - balance)} points to go` : 'Pick anything on the free food list'}</span>
      </div>
    </div>
  )
}

// A plain progress bar towards the next reward (Rewards screen).
export default function RewardProgress({ balance }) {
  const next = nextReward(balance)
  const pct = next ? Math.min(100, (balance / next.points) * 100) : 100
  return (
    <div className="stack">
      <div className="bar" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to your next reward">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="num">
        {next ? `${formatPoints(next.points - balance)} points to a free ${next.name.replace(/^Any /, '')}` : 'You can have anything on the list'}
      </p>
    </div>
  )
}
