import { Link, useParams, useSearchParams } from 'react-router-dom'
import AppBar, { useBack } from '../components/AppBar.jsx'
import DishImage from '../components/DishImage.jsx'
import { BackIcon, PinIcon, StarIcon } from '../components/Icons.jsx'
import Starburst from '../components/Starburst.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { club, pointsForSpend } from '../data/club.js'
import { branchesServing, dishSlug, findDish, menus } from '../data/menu.js'
import { fridayMania, nextFriday } from '../data/offers.js'
import { formatLKR, loadBranchId, monthShort } from '../lib/format.js'

// Two easy add-ons from the same menu: a garlic bread and an Italian soda when the branch has them.
const pairings = (branchId, dish) => {
  const others = menus[branchId].filter((i) => i.name !== dish.name)
  const side = others.find((i) => /garlic bread/i.test(i.name)) ?? others.find((i) => i.category === 'Appetizers')
  const drink = others.find((i) => /italian soda/i.test(i.name)) ?? others.find((i) => i.category === 'Beverages')
  return [side, drink].filter(Boolean)
}

export default function Dish() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const back = useBack('/menu')
  const found = findDish(slug, params.get('branch') || loadBranchId() || 'ogf')

  if (!found) {
    return (
      <>
        <AppBar title="Menu" back="/menu" />
        <p className="empty">We couldn’t find that dish.</p>
      </>
    )
  }

  const { item, branchId } = found
  const branch = getBranch(branchId)
  const isHero = item.name === fridayMania.heroDish
  const friday = nextFriday()
  const points = pointsForSpend(item.price)

  return (
    <>
      <div className="dish-hero">
        <DishImage item={item} alt={item.name} />
        <button type="button" className="round-btn on-photo" onClick={back} aria-label="Back to menu">
          <BackIcon width={20} height={20} />
        </button>
        {isHero && (
          <Starburst size={88}>
            <span className="big" style={{ fontSize: 14 }}>Buy 1</span>
            <span className="big" style={{ fontSize: 14 }}>Get 1</span>
            <span className="small" style={{ fontSize: 9 }}>FRIDAYS</span>
          </Starburst>
        )}
      </div>

      <div className="sheet-body">
        <div className="dish-title">
          <span className="eyebrow">{item.category}</span>
          <h1 className="title-xl">{item.name}</h1>
          <span className="dish-price">{formatLKR(item.price)}</span>
        </div>

        <div className="points-banner">
          <span><StarIcon width={20} height={20} /></span>
          <div>
            <strong>Earn {points} {points === 1 ? 'point' : 'points'}</strong>
            <small>when you eat in or take away and show your code</small>
          </div>
        </div>

        {isHero && (
          <div className="friday-strip poster">
            <div>
              <span className="promo-kicker">FridayMania</span>
              <p>This week’s hero dish. Buy 1, get 1 every Friday, for dine-in, takeaway and delivery.</p>
            </div>
            <span className="date-badge">
              <small>Fri</small>
              <b>{friday.getDate()}</b>
              <small>{monthShort(friday)}</small>
            </span>
          </div>
        )}

        <div className="stack">
          <h2 className="label-caps">Available at</h2>
          <div className="chip-row">
            {branchesServing(item.name).map((id) => (
              <span key={id} className="place-chip">
                <PinIcon width={14} height={14} />
                {getBranch(id).name}
              </span>
            ))}
          </div>
        </div>

        {pairings(branchId, item).length > 0 && (
          <div className="stack">
            <h2 className="title-m" style={{ fontSize: 20 }}>Goes well with</h2>
            <div className="pairs">
              {pairings(branchId, item).map((p) => (
                <Link key={p.name} className="pair card" to={`/menu/${dishSlug(p.name)}?branch=${branchId}`} replace>
                  <DishImage item={p} />
                  <span>
                    <strong>{p.name}</strong>
                    <small>{formatLKR(p.price)}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
        <p className="footnote">
          Price from {branch.name}’s delivery menu, {brand.dataAsOf}. 1 point for every LKR {club.spendPerPoint} in store.
        </p>
      </div>

      <div className="action-bar">
        <div className="action-bar-head">
          <strong>Order for delivery</strong>
          <span>Delivery doesn’t earn points</span>
        </div>
        <div className="btns">
          <a className="btn btn-ink" href={branch.uberEatsUrl} target="_blank" rel="noreferrer">Uber Eats</a>
          <a className="btn btn-outline btn-plain" href={brand.pickmeUrl} target="_blank" rel="noreferrer">PickMe Food</a>
        </div>
      </div>
    </>
  )
}
