import { Link } from 'react-router-dom'
import { BowlIcon, GiftIcon, ReceiptIcon } from '../components/Icons.jsx'
import Starburst from '../components/Starburst.jsx'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'

// What a guest sees first: the promise, the welcome gift, and one button to join.
export default function Welcome() {
  return (
    <div className="welcome">
      <img className="welcome-logo" src={brand.logo} alt="PastaMania casual dining" />

      <div className="collage" aria-hidden="true">
        <img className="c1" src="/images/menu/carbonara-pasta.jpg" alt="" />
        <img className="c2" src="/images/menu/pepperoni-pizza.jpg" alt="" />
        <img className="c3" src="/images/menu/garlic-bread.jpg" alt="" />
        <Starburst size={86}>
          <span className="big" style={{ fontSize: 22 }}>{club.welcomeBonus}</span>
          <span className="small" style={{ fontSize: 9 }}>PTS FREE</span>
        </Starburst>
      </div>

      <div className="stack" style={{ alignItems: 'center', gap: 12 }}>
        <h1 className="hatch welcome-title">
          Eat pasta.
          <br />
          Earn free
          <br />
          pasta.
        </h1>
        <p className="welcome-lead">Join the {club.name} and your first Garlic Bread is on us.</p>
      </div>

      <ul className="perks">
        <li><span><GiftIcon width={18} height={18} /></span>{club.welcomeBonus} welcome points</li>
        <li><span><ReceiptIcon width={18} height={18} /></span>1 point per LKR {club.spendPerPoint}</li>
        <li><span><BowlIcon width={18} height={18} /></span>Free pasta &amp; pizza</li>
      </ul>

      <div className="welcome-actions">
        <Link className="btn btn-gold btn-lg btn-block" to="/join">Join free</Link>
        <Link className="text-btn" to="/menu">Browse the menu</Link>
      </div>
    </div>
  )
}
