import { Link } from 'react-router-dom'
import { pointsForSpend } from '../data/club.js'
import { dishSlug, isLocalFavourite } from '../data/menu.js'
import { fridayMania } from '../data/offers.js'
import { earnLabel, formatLKR } from '../lib/format.js'
import DishImage from './DishImage.jsx'

const sticker = (name) => {
  if (name === fridayMania.heroDish) return 'Fridays 1+1'
  if (isLocalFavourite(name)) return 'Local fave!'
  return null
}

// A dish as a red, gold or cream card (variant 0, 1 or 2) with its price and the points it earns in store.
export default function DishCard({ item, variant, branchId }) {
  const tag = sticker(item.name)
  const points = pointsForSpend(item.price)
  return (
    <Link to={`/menu/${dishSlug(item.name)}?branch=${branchId}`} className={`dish-card v${variant}`}>
      <DishImage item={item} className="dish-plate" />
      {tag && <span className="dish-sticker">{tag}</span>}
      <h3 className="cd">{item.name}</h3>
      <span className="dish-pills">
        <span className="price-pill num">{formatLKR(item.price)}</span>
        {points > 0 && <span className="pts-pill num">{earnLabel(points)}</span>}
      </span>
    </Link>
  )
}
