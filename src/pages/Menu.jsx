import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/AppBar.jsx'
import DishImage from '../components/DishImage.jsx'
import { BagIcon, ChevronIcon, PinIcon, SearchIcon } from '../components/Icons.jsx'
import { useOrder } from '../components/OrderSheet.jsx'
import Sheet from '../components/Sheet.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch } from '../data/branches.js'
import { club, pointsForSpend } from '../data/club.js'
import { categories, dishSlug, isLocalFavourite, menus } from '../data/menu.js'
import { fridayMania } from '../data/offers.js'
import { formatLKR, loadBranchId, saveBranchId } from '../lib/format.js'

const initialBranch = () => {
  const saved = loadBranchId()
  return saved && menus[saved] ? saved : 'ogf'
}

function DishTag({ name }) {
  if (name === fridayMania.heroDish) return <span className="dish-tag">FridayMania · buy 1, get 1 free</span>
  if (isLocalFavourite(name)) return <span className="dish-tag">Local favourite</span>
  return null
}

export default function Menu() {
  const [branchId, setBranchId] = useState(initialBranch)
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const openOrder = useOrder()

  const selectBranch = (id) => {
    setBranchId(id)
    setCategory('All')
    saveBranchId(id)
    setPicking(false)
  }

  const items = menus[branchId]
  const branchCategories = categories.filter((c) => items.some((i) => i.category === c.name))
  const q = query.trim().toLowerCase()
  const groups = branchCategories
    .filter((c) => category === 'All' || c.name === category)
    .map((c) => ({ ...c, items: items.filter((i) => i.category === c.name && (!q || i.name.toLowerCase().includes(q))) }))
    .filter((g) => g.items.length > 0)

  const branch = getBranch(branchId)

  return (
    <>
      <PageHead title="Menu">
        <button type="button" className="branch-pill press" onClick={() => setPicking(true)} aria-label={`Branch: ${branch.name}. Change branch`}>
          <PinIcon width={16} height={16} /> {branch.shortName}
          <ChevronIcon width={14} height={14} style={{ transform: 'rotate(90deg)' }} />
        </button>
      </PageHead>

      <div className="menu">
        <label className="search rise">
          <SearchIcon width={20} height={20} />
          <input type="search" placeholder="Search pasta, pizza, drinks" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the menu" />
        </label>

        <div className="rise" style={{ '--i': 1 }}>
          <button type="button" className="row-card card" onClick={openOrder}>
            <span className="icon-tile md"><BagIcon width={20} height={20} /></span>
            <span className="row-card-text">
              <strong>Order delivery</strong>
              <span>Uber Eats · PickMe</span>
            </span>
            <ChevronIcon width={16} height={16} />
          </button>
        </div>

        <div className="chips menu-chips rise" role="tablist" aria-label="Category" style={{ '--i': 2 }}>
          {['All', ...branchCategories.map((c) => c.name)].map((name) => (
            <button key={name} type="button" role="tab" aria-selected={name === category} className="chip" onClick={() => setCategory(name)}>
              {name}
            </button>
          ))}
        </div>

        {groups.length === 0 && <p className="empty">No dishes match “{query}”.</p>}

        {/* Keyed by category so the list eases in again when you switch. */}
        <div key={category} className="menu-list">
          {groups.map((g, gi) => (
            <section key={g.name} className="group rise" style={{ '--i': 3 + gi }}>
              <h2 className="section-title">{g.name}</h2>
              <ul className="list-card card">
                {g.items.map((i) => (
                  <li key={i.name}>
                    <Link to={`/menu/${dishSlug(i.name)}?branch=${branchId}`} className="dish-row">
                      <DishImage item={i} />
                      <span className="dish-row-text">
                        <strong>{i.name}</strong>
                        <span className="num">
                          {formatLKR(i.price)} · earns {pointsForSpend(i.price)} points
                        </span>
                        <DishTag name={i.name} />
                      </span>
                      <ChevronIcon width={16} height={16} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="footnote">
          Eat in or take away and get 1 point for every LKR {club.spendPerPoint}. {branchId === 'alfred' ? 'Popular dishes at Alfred House. ' : ''}
          Delivery prices for {branch.name}, {brand.dataAsOf}. Dine-in may differ.
        </p>
      </div>

      {picking && (
        <Sheet title="Choose a branch" onClose={() => setPicking(false)}>
          <div className="branch-options" role="radiogroup" aria-label="Branch">
            {branches.map((b) => (
              <button key={b.id} type="button" role="radio" aria-checked={b.id === branchId} className="branch-option" onClick={() => selectBranch(b.id)}>
                <span className="icon-tile sm"><PinIcon width={16} height={16} /></span>
                <span>
                  <strong>{b.name}</strong>
                  <small>{b.address}</small>
                </span>
              </button>
            ))}
          </div>
        </Sheet>
      )}
    </>
  )
}
