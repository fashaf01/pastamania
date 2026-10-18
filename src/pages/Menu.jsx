import { useState } from 'react'
import AppBar from '../components/AppBar.jsx'
import DishImage from '../components/DishImage.jsx'
import { SearchIcon } from '../components/Icons.jsx'
import Sheet from '../components/Sheet.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch } from '../data/branches.js'
import { club, pointsForSpend, tiers } from '../data/club.js'
import { categories, categoryIcon, menus } from '../data/menu.js'
import { formatLKR, loadBranchId, saveBranchId } from '../lib/format.js'

const initialBranch = () => {
  const saved = loadBranchId()
  return saved && menus[saved] ? saved : 'ogf'
}

export default function Menu() {
  const { member, tier } = useClub()
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
  const earn = (price) => pointsForSpend(price, member ? tier : tiers[0])

  return (
    <>
      <AppBar title="Menu" />
      <div className="screen-pad">
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
                <li key={i.name}>
                  <button className="menu-item" onClick={() => setSelected(i)}>
                    <DishImage item={i} className="menu-thumb" />
                    <span className="menu-text">
                      <span className="menu-name">{i.name}</span>
                      <span className="earn">+{earn(i.price)} pts</span>
                    </span>
                    <span className="price">{formatLKR(i.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="muted small menu-note">
          Prices as listed for {branch.name} delivery on {brand.dataAsOf}. Dine-in prices, portions and availability may
          vary – please check with the branch.
        </p>
      </div>

      {selected && (
        <Sheet title={selected.name} onClose={() => setSelected(null)}>
          <DishImage item={selected} className="sheet-photo" />
          <div className="sheet-row">
            <span className="price big">{formatLKR(selected.price)}</span>
            <span className="pts-pill ready">+{earn(selected.price)} {club.pointsName}</span>
          </div>
          <p className="muted small">
            {selected.category} · {branch.name}
          </p>
          <a className="btn btn-uber btn-block" href={branch.uberEatsUrl} target="_blank" rel="noreferrer">
            Order on Uber Eats
          </a>
          <p className="muted small center">Dining in? Show your member card at the counter to earn points.</p>
        </Sheet>
      )}
    </>
  )
}
