import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/Icons.jsx'
import Sticker from '../components/Sticker.jsx'
import { brand } from '../data/brand.js'
import { club, rewards } from '../data/club.js'
import { isPhoneOrTablet, switchView } from '../lib/view.js'

// What a guest sees first: one plate, the promise, and one button to join.
export default function Welcome() {
  const gift = rewards.find((r) => r.points === club.welcomeBonus)

  return (
    <div className="welcome grain">
      <img className="welcome-logo" src={brand.logo} alt="PastaMania casual dining" />

      <div className="welcome-main">
        <div className="welcome-plate">
          <img src="/images/menu/carbonara-pasta.jpg" alt="" />
          <Sticker size={88} tilt={12} className="welcome-sticker">
            <b className="slab">{club.welcomeBonus}</b>
            <small>pts free</small>
          </Sticker>
        </div>
        <h1 className="welcome-title">
          <span className="mask"><span className="cd line-up">Eat pasta.</span></span>
          <span className="mask"><span className="slab line-up" style={{ animationDelay: '0.15s' }}>Earn free pasta.</span></span>
        </h1>
        <p className="welcome-lead">
          Join free and <mark className="hl">your first {gift?.name ?? 'reward'} is on us.</mark>
        </p>
      </div>

      <div className="welcome-actions">
        <Link className="btn btn-gold btn-lg btn-block" to="/join">
          Join free <ArrowIcon width={20} height={20} strokeWidth={2.6} />
        </Link>
        <Link className="text-btn" to="/menu">Browse the menu</Link>
        {!isPhoneOrTablet() && (
          <button type="button" className="text-btn" onClick={() => switchView('site')}>Open the website</button>
        )}
      </div>
    </div>
  )
}
