import { useRef, useState } from 'react'
import { ArrowIcon } from '../components/Icons.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { pointsForSpend } from '../data/club.js'
import { categories, isLocalFavourite, menus } from '../data/menu.js'
import { fridayMania } from '../data/offers.js'
import { formatLKR } from '../lib/format.js'

// The website shows Havelock City Mall's menu: it is the fullest one, and its prices are labelled as such.
const BRANCH_ID = 'havelock'
const items = menus[BRANCH_ID]
const tabs = categories.map((c) => c.name).filter((name) => items.some((i) => i.category === name))

const sticker = (item) => {
  if (item.name === fridayMania.heroDish) return 'Fridays 1+1'
  if (isLocalFavourite(item.name)) return 'Local fave!'
  return null
}

function DishCard({ item, variant }) {
  const tag = sticker(item)
  return (
    <article className={`w-card w-v${variant}`}>
      {item.image ? (
        <img className="w-plate" src={item.image} alt={item.name} loading="lazy" decoding="async" />
      ) : (
        <div className="w-plate w-plate-none" aria-hidden="true">
          <img src={brand.logo} alt="" />
        </div>
      )}
      {tag && <span className="w-stk">{tag}</span>}
      <h3 className="w-cd">{item.name}</h3>
      <div className="w-pills">
        <span className="w-pill">{formatLKR(item.price)}</span>
        <span className="w-pill w-pts">+{pointsForSpend(item.price)} pts</span>
      </div>
    </article>
  )
}

export default function MenuSection() {
  const [tab, setTab] = useState(tabs[0])
  const rail = useRef(null)
  const branch = getBranch(BRANCH_ID)

  const scrollBy = (dir) => rail.current?.scrollBy({ left: dir * rail.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <section id="menu" className="w-menu">
      <div className="w-wrap">
        <div className="w-mhead w-rv">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 }}>
            <p className="w-cd"><span className="w-strike">Plain Italian</span></p>
            <h2 className="w-cd" style={{ fontSize: 'clamp(56px, 7.4vw, 116px)', color: 'var(--red)' }}>
              Italian,
              <br />
              Colombo style
            </h2>
          </div>
          <div id="order" className="w-order">
            <p style={{ fontSize: 17, color: '#4a3f38' }}>
              Prices from {branch.name}. Each dish shows the Club points it earns when you eat in or take away.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              <a className="w-btn w-b-red w-b-sm" href={branch.uberEatsUrl}>Uber Eats</a>
              <a className="w-btn w-b-line w-b-sm" href={brand.pickmeUrl}>PickMe Food</a>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Delivery orders don't earn Club points.</p>
          </div>
        </div>

        <div className="w-tabs" role="tablist" aria-label="Menu categories">
          {tabs.map((name) => (
            <button
              key={name}
              type="button"
              role="tab"
              className="w-tab"
              aria-selected={tab === name}
              aria-controls="w-dishes"
              onClick={() => setTab(name)}
            >
              {name}
              <sup>{items.filter((i) => i.category === name).length}</sup>
            </button>
          ))}
        </div>

        <div className="w-railwrap">
          {/* Keyed by tab so the cards deal in again when the category changes. */}
          <div key={tab} id="w-dishes" ref={rail} className="w-rail" role="tabpanel" aria-label={tab}>
            {items
              .filter((i) => i.category === tab)
              .map((item, n) => (
                <DishCard key={item.name} item={item} variant={n % 3} />
              ))}
          </div>
          <div className="w-railnav">
            <div className="w-track"><i /></div>
            <button type="button" className="w-rbtn" aria-label="Previous dishes" onClick={() => scrollBy(-1)}>
              <ArrowIcon width={20} height={20} strokeWidth={2.4} style={{ transform: 'rotate(180deg)' }} />
            </button>
            <button type="button" className="w-rbtn" aria-label="Next dishes" onClick={() => scrollBy(1)}>
              <ArrowIcon width={20} height={20} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
