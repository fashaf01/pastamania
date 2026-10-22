import { Link, useParams, useSearchParams } from 'react-router-dom'
import AppBar, { useBack } from '../components/AppBar.jsx'
import { PickMeLink, UberEatsLink } from '../components/DeliveryLinks.jsx'
import DishImage from '../components/DishImage.jsx'
import { BackIcon, ChevronIcon, PinIcon } from '../components/Icons.jsx'
import Sticker from '../components/Sticker.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { club, pointsForSpend } from '../data/club.js'
import { branchesServing, dishSlug, findDish, isLocalFavourite, menus } from '../data/menu.js'
import { fridayMania } from '../data/offers.js'
import { formatLKR, loadBranchId } from '../lib/format.js'

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
  const isLocal = isLocalFavourite(item.name)
  const points = pointsForSpend(item.price)
  const pairs = pairings(branchId, item)

  return (
    <>
      <div className="dish-hero grain">
        <button type="button" className="round-btn on-red" onClick={back} aria-label="Back to menu">
          <BackIcon width={22} height={22} />
        </button>
        <svg className="steam" viewBox="0 0 90 60" aria-hidden="true">
          <path d="M24 58c-7-9 7-14 0-23s7-14 0-23" />
          <path d="M45 54c-7-9 7-14 0-23s7-14 0-23" />
          <path d="M66 58c-7-9 7-14 0-23s7-14 0-23" />
        </svg>
        <span className="dish-rings" aria-hidden="true" />
        {/* Keyed by dish so the plate spins in again when you open a pairing. */}
        <DishImage key={item.name} item={item} alt={item.name} className="dish-hero-plate" />
        {(isHero || isLocal) && (
          <Sticker size={96} tilt={-10} className="dish-hero-sticker">
            <small>{isHero ? 'Fridays' : 'Local'}</small>
            <b className="cd">{isHero ? '1+1' : 'fave!'}</b>
          </Sticker>
        )}
      </div>

      <div className="dish-body">
        <span className="eyebrow">{item.category}{isLocal ? ' · Sri Lankan fusion' : ''}</span>
        <h1 className="cd dish-name">{item.name}</h1>
        <div className="chip-row">
          <span className="price-pill big num">{formatLKR(item.price)}</span>
          <span className="pts-pill gold big num">+{points} {points === 1 ? 'point' : 'points'} when you eat in</span>
        </div>
        {isHero && <p className="dish-note">FridayMania: buy 1, get 1 free every Friday, for dine-in, takeaway and delivery.</p>}
        <p className="dish-where">
          <PinIcon width={18} height={18} />
          On the menu at {branchesServing(item.name).map((id) => getBranch(id).name).join(', ')}
        </p>

        {pairs.length > 0 && (
          <section className="block">
            <h2 className="block-title cd">Goes well with</h2>
            {pairs.map((p) => (
              <Link key={p.name} className="pair-row" to={`/menu/${dishSlug(p.name)}?branch=${branchId}`} replace>
                <DishImage item={p} />
                <span className="pair-text">
                  <strong>{p.name}</strong>
                  <small className="num">{formatLKR(p.price)} · +{pointsForSpend(p.price)} pts</small>
                </span>
                <ChevronIcon width={18} height={18} />
              </Link>
            ))}
          </section>
        )}
        <p className="footnote">
          Price from {branch.name}’s delivery menu, {brand.dataAsOf}. 1 point for every LKR {club.spendPerPoint} in store.
        </p>
      </div>

      <div className="order-bar">
        <div className="btns">
          <UberEatsLink className="lg" href={branch.uberEatsUrl} />
          <PickMeLink className="lg" />
        </div>
        <p>Delivery orders don’t earn points. Eat in or take away to earn.</p>
      </div>
    </>
  )
}
