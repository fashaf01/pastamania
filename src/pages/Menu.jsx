import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHead } from '../components/AppBar.jsx'
import DishImage from '../components/DishImage.jsx'
import { ChevronIcon, PinIcon, SearchIcon, StarIcon } from '../components/Icons.jsx'
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
  if (name === fridayMania.heroDish) return <span className="tag tag-red">FridayMania</span>
  if (isLocalFavourite(name)) return <span className="tag tag-gold">Local favourite</span>
  return null
}

export default function Menu() {
  const [branchId, setBranchId] = useState(initialBranch)
  const [picking, setPicking] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

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
      <PageHead title="Menu" />
      <div className="menu-head" style={{ paddingTop: 14 }}>
        <button type="button" className="branch-picker card" onClick={() => setPicking(true)}>
          <span className="icon-tile sm" style={{ width: 36, height: 36 }}><PinIcon width={18} height={18} /></span>
          <span>
            <small>Showing the menu for</small>
            <strong>{branch.name}</strong>
          </span>
          <b>Change</b>
        </button>
        <label className="search">
          <SearchIcon width={20} height={20} />
          <input type="search" placeholder="Search pasta, pizza, drinks" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the menu" />
        </label>
      </div>

      <div className="chips" role="tablist" aria-label="Category" style={{ paddingTop: 16 }}>
        {['All', ...branchCategories.map((c) => c.name)].map((name) => (
          <button key={name} type="button" role="tab" aria-selected={name === category} className="chip" onClick={() => setCategory(name)}>
            {name}
          </button>
        ))}
      </div>

      <div className="earn-banner">
        <StarIcon width={18} height={18} />
        Eat in or take away: 1 point for every LKR {club.spendPerPoint}.
      </div>

      {groups.length === 0 && <p className="empty">No dishes match “{query}”.</p>}

      {groups.map((g) => (
        <section key={g.name} className="menu-group">
          <h2 className="title-m">{g.name}</h2>
          <ul className="stack" style={{ gap: 12 }}>
            {g.items.map((i) => (
              <li key={i.name}>
                <Link to={`/menu/${dishSlug(i.name)}?branch=${branchId}`} className="dish-row card">
                  <DishImage item={i} />
                  <span className="dish-row-text">
                    <DishTag name={i.name} />
                    <strong>{i.name}</strong>
                    <span className="price-line">
                      <b>{formatLKR(i.price)}</b>
                      <span className="pill pill-gold num">+{pointsForSpend(i.price)} pts in store</span>
                    </span>
                  </span>
                  <ChevronIcon width={18} height={18} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <p className="footnote pad" style={{ marginTop: 20, marginBottom: 32 }}>
        {branchId === 'alfred' ? 'Popular dishes at Alfred House. ' : ''}Delivery prices for {branch.name}, {brand.dataAsOf}. Dine-in may differ.
      </p>

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
