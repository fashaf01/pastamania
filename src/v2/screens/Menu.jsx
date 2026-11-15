import { useMemo, useState } from 'react'
import { SearchIcon } from '../../components/Icons.jsx'
import { pointsForSpend } from '../../data/club.js'
import { brand } from '../../data/brand.js'
import { categories, isLocalFavourite, menus } from '../../data/menu.js'
import { earnLabel } from '../../lib/format.js'
import { rupees } from '../config.js'
import { BranchPick, Burst, useBranch } from '../ui.jsx'

const shortCategory = (name) => name.replace(' Pasta', ' pasta').replace('Beverages', 'Drinks')

function Dish({ item }) {
  return (
    <article className="v2-dish">
      {item.image ? (
        <img className="v2-dish-img" src={item.image} alt="" loading="lazy" />
      ) : (
        <span className="v2-dish-none"><img src={brand.logo} alt="" /></span>
      )}
      <div className="v2-dish-body">
        <h3 className="v2-dish-name">{item.name}</h3>
        <div className="v2-split" style={{ gap: 6 }}>
          <span className="v2-body v2-strong">{rupees(item.price)}</span>
          <span className="v2-pts">{earnLabel(pointsForSpend(item.price))}</span>
        </div>
      </div>
    </article>
  )
}

export default function Menu() {
  const [branch, setBranch] = useBranch()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const items = menus[branch.id] ?? []

  const present = categories.filter((c) => items.some((i) => i.category === c.name)).map((c) => c.name)
  const q = query.trim().toLowerCase()
  const shown = items.filter((i) => (category === 'All' || i.category === category) && (!q || i.name.toLowerCase().includes(q)))
  const hero = useMemo(() => items.find((i) => isLocalFavourite(i.name) && i.image), [items])
  const showHero = hero && category === 'All' && !q
  const sections = present.map((name) => ({ name, items: shown.filter((i) => i.category === name && !(showHero && i === hero)) })).filter((s) => s.items.length)

  return (
    <>
      <header className="v2-head" style={{ gap: 14, paddingBottom: 20 }}>
        <div className="v2-head-row">
          <h1 className="v2-cd v2-title">Menu</h1>
          <BranchPick branch={branch} onChange={(id) => { setBranch(id); setCategory('All') }} />
        </div>
        <label className="v2-search">
          <SearchIcon width={20} height={20} />
          <span className="sr-only">Search the menu</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search pasta, pizza, sides" />
        </label>
        <div className="v2-chips" role="group" aria-label="Category">
          {['All', ...present].map((name) => (
            <button key={name} type="button" className="v2-chip" aria-pressed={category === name} onClick={() => setCategory(name)}>
              {name === 'All' ? 'All' : shortCategory(name)}
            </button>
          ))}
        </div>
      </header>

      <main className="v2-main" style={{ gap: 18 }}>
        {showHero && (
          <article className="v2-hero-dish">
            <img src={hero.image} alt={hero.name} />
            <Burst size={84} fontSize={17}>Local<br />fave!</Burst>
            <div className="v2-split" style={{ padding: '14px 16px 16px' }}>
              <div className="v2-stack" style={{ gap: 4 }}>
                <h2 className="v2-cd" style={{ fontSize: 28, lineHeight: '26px' }}>{hero.name}</h2>
                <span className="v2-body v2-strong">{rupees(hero.price)}</span>
              </div>
              <span className="v2-pts">{earnLabel(pointsForSpend(hero.price))}</span>
            </div>
          </article>
        )}

        {sections.map((s) => (
          <section key={s.name} className="v2-stack" style={{ gap: 10 }}>
            <h2 className="v2-cd v2-section">{s.name}</h2>
            <div className="v2-dish-grid">
              {s.items.map((item) => <Dish key={item.name} item={item} />)}
            </div>
          </section>
        ))}

        {sections.length === 0 && !showHero && <p className="v2-body v2-muted" style={{ textAlign: 'center', padding: '32px 0' }}>Nothing matches “{query}” at {branch.shortName}.</p>}

        <section className="v2-card v2-pad v2-stack" style={{ gap: 10 }}>
          <span className="v2-body v2-muted">Want it at home? Delivery orders do not earn points.</span>
          <div className="v2-grid2">
            <a className="v2-btn v2-btn-line" href={branch.uberEatsUrl} target="_blank" rel="noreferrer" style={{ textTransform: 'none', fontStretch: '100%', fontSize: 15, fontWeight: 800 }}>Uber Eats</a>
            <a className="v2-btn v2-btn-line" href={brand.pickmeUrl} target="_blank" rel="noreferrer" style={{ textTransform: 'none', fontStretch: '100%', fontSize: 15, fontWeight: 800 }}>PickMe</a>
          </div>
        </section>
      </main>
    </>
  )
}
