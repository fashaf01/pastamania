import { useState } from 'react'
import { Link } from 'react-router-dom'
import DishImage from '../components/DishImage.jsx'
import { ChevronIcon, CloseIcon, PinIcon, SearchIcon } from '../components/Icons.jsx'
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

const sticker = (name) => {
  if (name === fridayMania.heroDish) return 'Fridays 1+1'
  if (isLocalFavourite(name)) return 'Local fave!'
  return null
}

function DishCard({ item, variant, branchId }) {
  const tag = sticker(item.name)
  return (
    <Link to={`/menu/${dishSlug(item.name)}?branch=${branchId}`} className={`dish-card v${variant}`}>
      <DishImage item={item} className="dish-plate" />
      {tag && <span className="dish-sticker">{tag}</span>}
      <h3 className="cd">{item.name}</h3>
      <span className="dish-pills">
        <span className="price-pill num">{formatLKR(item.price)}</span>
        <span className="pts-pill num">+{pointsForSpend(item.price)} pts</span>
      </span>
    </Link>
  )
}

export default function Menu() {
  const [branchId, setBranchId] = useState(initialBranch)
  const [picking, setPicking] = useState(false)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const items = menus[branchId]
  const branchCategories = categories.filter((c) => items.some((i) => i.category === c.name))
  const [category, setCategory] = useState(() => branchCategories[0]?.name)

  const selectBranch = (id) => {
    setBranchId(id)
    setCategory(categories.find((c) => menus[id].some((i) => i.category === c.name))?.name)
    saveBranchId(id)
    setPicking(false)
  }

  const closeSearch = () => {
    setSearching(false)
    setQuery('')
  }

  // While searching, look across the whole menu; otherwise show the chosen category.
  const q = query.trim().toLowerCase()
  const shown = q ? items.filter((i) => i.name.toLowerCase().includes(q)) : items.filter((i) => i.category === category)
  const branch = getBranch(branchId)

  return (
    <>
      <div className="menu">
        <header className="menu-head rise">
          <div className="menu-title">
            <p className="cd"><span className="strike">Plain Italian</span></p>
            <h1 className="cd">Italian,<br />Colombo style</h1>
          </div>
          <button type="button" className="round-btn" onClick={() => (searching ? closeSearch() : setSearching(true))} aria-label={searching ? 'Close search' : 'Search the menu'} aria-expanded={searching}>
            {searching ? <CloseIcon width={20} height={20} /> : <SearchIcon width={20} height={20} />}
          </button>
        </header>

        {searching && (
          <label className="search">
            <SearchIcon width={20} height={20} />
            <input type="search" autoFocus placeholder="Search pasta, pizza, drinks" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the menu" />
          </label>
        )}

        <div className="rise" style={{ '--i': 1 }}>
          <button type="button" className="branch-pill press" onClick={() => setPicking(true)} aria-label={`Branch: ${branch.name}. Change branch`}>
            <PinIcon width={18} height={18} /> {branch.name}
            <ChevronIcon width={16} height={16} style={{ transform: 'rotate(90deg)' }} />
          </button>
        </div>

        <div className="deliver rise" style={{ '--i': 2 }}>
          <span className="deliver-text">
            <strong className="cd">Order delivery</strong>
            <small>Doesn’t earn points</small>
          </span>
          <a className="btn btn-red btn-sm" href={branch.uberEatsUrl} target="_blank" rel="noreferrer">Uber Eats</a>
          <a className="btn btn-outline btn-sm" href={brand.pickmeUrl} target="_blank" rel="noreferrer">PickMe</a>
        </div>

        {!q && (
          <div className="cat-tabs rise" role="tablist" aria-label="Category" style={{ '--i': 3 }}>
            {branchCategories.map((c) => (
              <button key={c.name} type="button" role="tab" aria-selected={c.name === category} className="cat-tab" onClick={() => setCategory(c.name)}>
                {c.name}
                <sup>{items.filter((i) => i.category === c.name).length}</sup>
              </button>
            ))}
          </div>
        )}

        {shown.length === 0 && <p className="empty">No dishes match “{query}”.</p>}

        {/* Keyed so the cards deal in again when the category, branch or search changes. */}
        <div key={`${branchId}-${q || category}`} className="dish-grid">
          {shown.map((item, n) => (
            <DishCard key={item.name} item={item} variant={n % 3} branchId={branchId} />
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
