import { useState } from 'react'
import DishImage from '../components/DishImage.jsx'
import { SearchIcon } from '../components/Icons.jsx'
import { useOrder } from '../components/OrderSheet.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch } from '../data/branches.js'
import { categories, categoryIcon, menus } from '../data/menu.js'
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
    <div className="container page">
      <h1 className="page-title retro retro-red">Menu</h1>

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

      <div className="menu-tools">
        <label className="search">
          <SearchIcon width={18} height={18} />
          <input
            type="search"
            placeholder="Search dishes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search dishes"
          />
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
              {name === 'All' ? 'All' : `${categoryIcon(name)} ${name}`}
            </button>
          ))}
        </div>
      </div>

      {branchId === 'alfred' && (
        <p className="notice">Showing popular dishes at Alfred House. The full menu is available in-store and on Uber Eats.</p>
      )}

      {groups.length === 0 && <p className="empty">No dishes match “{query}”.</p>}

      {groups.map((g) => (
        <section key={g.name} className="menu-group">
          <h2 className="retro retro-red">{g.name}</h2>
          <ul className="menu-list">
            {g.items.map((i) => (
              <li key={i.name} className="menu-item">
                <DishImage item={i} className="menu-thumb" />
                <span className="menu-name">{i.name}</span>
                <span className="price">{formatLKR(i.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="menu-footer">
        <p className="muted small">
          Prices as listed for {branch.name} delivery on {brand.dataAsOf}. Dine-in prices, portions and availability
          may vary – please check with the branch.
        </p>
        <button className="btn btn-primary btn-block" onClick={openOrder}>Order delivery</button>
      </div>
    </div>
  )
}
