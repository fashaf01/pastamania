import { useState } from 'react'
import AppBar from '../components/AppBar.jsx'
import DishImage from '../components/DishImage.jsx'
import { SearchIcon } from '../components/Icons.jsx'
import { useOrder } from '../components/OrderSheet.jsx'
import Sheet from '../components/Sheet.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch } from '../data/branches.js'
import { pointsForSpend } from '../data/club.js'
import { categories, menus } from '../data/menu.js'
import { formatLKR, loadBranchId, saveBranchId } from '../lib/format.js'

const initialBranch = () => {
  const saved = loadBranchId()
  return saved && menus[saved] ? saved : 'ogf'
}

export default function Menu() {
  const openOrder = useOrder()
  const [branchId, setBranchId] = useState(initialBranch)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState(null)

  const selectBranch = (id) => {
    setBranchId(id)
    setCategory('All')
    saveBranchId(id)
  }

  const items = menus[branchId]
  const branchCategories = categories.filter((c) => items.some((i) => i.category === c.name))
  const q = query.trim().toLowerCase()
  const groups = branchCategories
    .filter((c) => category === 'All' || c.name === category)
    .map((c) => ({
      ...c,
      items: items.filter((i) => i.category === c.name && (!q || i.name.toLowerCase().includes(q))),
    }))
    .filter((g) => g.items.length > 0)

  const branch = getBranch(branchId)

  return (
    <>
      <AppBar
        title="Menu"
        action={
          <button className="appbar-btn" onClick={openOrder}>
            Order
          </button>
        }
      />
      <div className="menu-tools">
        <div className="segmented" role="tablist" aria-label="Branch">
          {branches.map((b) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={b.id === branchId}
              className={b.id === branchId ? 'active' : ''}
              onClick={() => selectBranch(b.id)}
            >
              {b.shortName}
            </button>
          ))}
        </div>
        <label className="search">
          <SearchIcon width={18} height={18} />
          <input type="search" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search dishes" />
        </label>
        <div className="chips" role="tablist" aria-label="Category">
          {['All', ...branchCategories.map((c) => c.name)].map((name) => (
            <button
              key={name}
              role="tab"
              aria-selected={name === category}
              className={`chip ${name === category ? 'active' : ''}`}
              onClick={() => setCategory(name)}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="pad">
        {groups.length === 0 && <p className="empty">No dishes match “{query}”.</p>}

        {groups.map((g) => (
          <section key={g.name} className="menu-group">
            <h2 className="h2">{g.name}</h2>
            <ul className="list">
              {g.items.map((i) => (
                <li key={i.name}>
                  <button className="list-row" onClick={() => setSelected(i)}>
                    <DishImage item={i} className="thumb" />
                    <span className="row-text">
                      <strong>{i.name}</strong>
                      <span>{formatLKR(i.price)}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="footnote">
          {branchId === 'alfred' ? 'Popular dishes at Alfred House. ' : ''}Delivery prices for {branch.name}, {brand.dataAsOf}. Dine-in may
          differ.
        </p>
      </div>

      {selected && (
        <Sheet title={selected.name} onClose={() => setSelected(null)}>
          <DishImage item={selected} className="sheet-photo" />
          <div className="sheet-row">
            <span className="price">{formatLKR(selected.price)}</span>
            <span className="pill pill-gold">{pointsForSpend(selected.price)} points in store</span>
          </div>
          <p className="muted">Dine in or take away and show your code when you pay to earn points.</p>
          <a className="btn btn-outline btn-block" href={branch.uberEatsUrl} target="_blank" rel="noreferrer">
            Order on Uber Eats
          </a>
          <p className="footnote">Points aren’t earned on delivery orders.</p>
        </Sheet>
      )}
    </>
  )
}
