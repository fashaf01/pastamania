import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PickMeLink, UberEatsLink } from '../components/DeliveryLinks.jsx'
import DishImage from '../components/DishImage.jsx'
import { ChevronIcon, CloseIcon, PinIcon, SearchIcon } from '../components/Icons.jsx'
import Sheet from '../components/Sheet.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch } from '../data/branches.js'
import { club, pointsForSpend } from '../data/club.js'
import { categories, dishSlug, isLocalFavourite, menus } from '../data/menu.js'
import { fridayMania } from '../data/offers.js'
import { formatLKR, loadBranchId, saveBranchId } from '../lib/format.js'
import { prefersReducedMotion } from '../lib/motion.js'

const initialBranch = () => {
  const saved = loadBranchId()
  return saved && menus[saved] ? saved : 'ogf'
}

const sectionId = (name) => `menu-${dishSlug(name)}`

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

// The whole menu in one scroll, like a delivery app: the category bar sticks to the top, follows the section
// you're reading, and jumps to a section when you tap it.
export default function Menu() {
  const [branchId, setBranchId] = useState(initialBranch)
  const [picking, setPicking] = useState(false)
  const [searching, setSearching] = useState(false)
  const [query, setQuery] = useState('')
  const items = menus[branchId]
  const sections = categories
    .map((c) => ({ name: c.name, items: items.filter((i) => i.category === c.name) }))
    .filter((s) => s.items.length > 0)
  const [active, setActive] = useState(sections[0]?.name)
  const bar = useRef(null)
  // While a tap is scrolling the page, the scroll position shouldn't move the highlight.
  const lockUntil = useRef(0)

  const q = query.trim().toLowerCase()
  const shown = q
    ? sections.map((s) => ({ ...s, items: s.items.filter((i) => i.name.toLowerCase().includes(q)) })).filter((s) => s.items.length > 0)
    : sections
  const branch = getBranch(branchId)

  // Where the sticky bar ends once it's stuck: the line a section has to pass to count as the one you're reading.
  const barBottom = () => (bar.current ? bar.current.offsetHeight + (parseFloat(getComputedStyle(bar.current).top) || 0) : 0)

  useEffect(() => {
    if (q) return undefined
    let frame = 0
    const follow = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (Date.now() < lockUntil.current) return
        const line = barBottom() + 24
        let current = sections[0]?.name
        for (const s of sections) {
          const el = document.getElementById(sectionId(s.name))
          if (el && el.getBoundingClientRect().top <= line) current = s.name
        }
        // The last sections are too short to reach the bar: at the very bottom, the last one is the one you're reading.
        const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        setActive(atBottom ? sections[sections.length - 1]?.name : current)
      })
    }
    window.addEventListener('scroll', follow, { passive: true })
    follow()
    return () => {
      window.removeEventListener('scroll', follow)
      cancelAnimationFrame(frame)
    }
    // `sections` only changes with the branch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [branchId, q])

  // Keep the highlighted category in view inside the bar.
  useEffect(() => {
    const strip = bar.current
    const tab = strip?.querySelector('[aria-current="true"]')
    if (strip && tab) strip.scrollTo({ left: tab.offsetLeft - 20, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }, [active])

  const jumpTo = (name) => {
    const el = document.getElementById(sectionId(name))
    if (!el) return
    setActive(name)
    lockUntil.current = Date.now() + 800
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - barBottom() - 8, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  const selectBranch = (id) => {
    setBranchId(id)
    setActive(categories.find((c) => menus[id].some((i) => i.category === c.name))?.name)
    saveBranchId(id)
    setPicking(false)
  }

  const closeSearch = () => {
    setSearching(false)
    setQuery('')
  }

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
          <span className="deliver-btns">
            <UberEatsLink href={branch.uberEatsUrl} />
            <PickMeLink />
          </span>
        </div>

        {!q && (
          <nav ref={bar} className="cat-tabs" aria-label="Menu sections">
            {sections.map((s) => (
              <button key={s.name} type="button" aria-current={s.name === active} className="cat-tab" onClick={() => jumpTo(s.name)}>
                {s.name}
                <sup>{s.items.length}</sup>
              </button>
            ))}
          </nav>
        )}

        {shown.length === 0 && <p className="empty">No dishes match “{query}”.</p>}

        {shown.map((s) => (
          <section key={`${branchId}-${s.name}`} id={sectionId(s.name)} className="menu-section" aria-labelledby={`${sectionId(s.name)}-title`}>
            <h2 id={`${sectionId(s.name)}-title`} className="cd menu-section-title">
              {s.name}
              <sup>{s.items.length}</sup>
            </h2>
            <div className="dish-grid">
              {s.items.map((item, n) => (
                <DishCard key={item.name} item={item} variant={n % 3} branchId={branchId} />
              ))}
            </div>
          </section>
        ))}

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
