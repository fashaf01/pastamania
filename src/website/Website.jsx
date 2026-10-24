import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { PickMeLink, UberEatsLink } from '../components/DeliveryLinks.jsx'
import { ArrowIcon, BagIcon, ChefIcon, CloseIcon, PinIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch } from '../data/branches.js'
import { club, rewards } from '../data/club.js'
import { fridayMania } from '../data/offers.js'
import { workshop } from '../data/workshops.js'
import { formatPhone } from '../lib/format.js'
import { isPhoneOrTablet, switchView } from '../lib/view.js'
import BranchesSection from './BranchesSection.jsx'
import ClubSection from './ClubSection.jsx'
import FaqSection from './FaqSection.jsx'
import FridaySection from './FridaySection.jsx'
import MenuSection from './MenuSection.jsx'
import WorkshopsSection from './WorkshopsSection.jsx'
import './website.css'

const Squiggle = ({ flip }) => (
  <svg viewBox="0 0 34 12" width="34" height="12" aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
    <path d="M2 8c3-7 6 3 9-2s6 4 9-1 6 4 9-1" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

const Sparkle = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 0l2.6 8.4L23 12l-8.4 2.6L12 24l-2.6-8.4L1 12l8.4-3.6z" fill="currentColor" />
  </svg>
)

const SECTIONS = [
  { id: 'menu', short: 'Menu', label: 'Menu', note: 'Prices and the points each dish earns' },
  { id: 'fridaymania', short: 'FridayMania', label: 'FridayMania', note: 'Buy 1, get 1 free every Friday' },
  { id: 'club', short: 'Club', label: 'The Club', note: 'Eat pasta, earn free pasta' },
  { id: 'branches', short: 'Branches', label: 'Branches', note: 'Hours, directions and phone numbers' },
  { id: 'workshops', short: 'Kids workshops', label: 'Kids workshops', note: `${workshop.title}, ages ${workshop.minAge}–${workshop.maxAge}` },
  { id: 'faq', short: 'FAQ', label: 'Questions', note: 'Points, rewards and catering' },
]

// The full-screen menu behind the menu button on a phone: the sections, delivery and the app.
function Drawer({ onClose }) {
  const close = useRef(null)
  const branch = getBranch('havelock')

  // Layout effect, so the page can scroll again before a section link scrolls it.
  useLayoutEffect(() => {
    document.documentElement.classList.add('w-locked')
    close.current?.focus()
    return () => document.documentElement.classList.remove('w-locked')
  }, [])

  const go = (id) => (e) => {
    e.preventDefault()
    onClose()
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  return (
    <div id="w-drawer" className="w-drawer w-grain" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={(e) => e.key === 'Escape' && onClose()}>
      <div className="w-drawer-top">
        <img src={brand.logo} alt="PastaMania" />
        <button ref={close} type="button" className="w-drawer-x" aria-label="Close the menu" onClick={onClose}>
          <CloseIcon width={22} height={22} strokeWidth={2.6} />
        </button>
      </div>
      <nav aria-label="Sections">
        <ul className="w-dlinks">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} onClick={go(s.id)}>
                <span>
                  <span className="w-cd">{s.label}</span>
                  <small>{s.note}</small>
                </span>
                <ArrowIcon width={22} height={22} strokeWidth={2.4} />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="w-drawer-foot">
        <div className="w-deliver-head">
          <p className="w-cd">Order delivery</p>
          <p>Doesn't earn points</p>
        </div>
        <div className="w-deliver-btns">
          <UberEatsLink href={branch.uberEatsUrl} />
          <PickMeLink />
        </div>
        <a className="w-btn w-b-gold" href="/app">Open the app</a>
      </div>
    </div>
  )
}

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <header className="w-nav">
      <div className="w-nav-in">
        <a className="w-logo" href="#top" aria-label="PastaMania home">
          <img src={brand.logo} alt="" />
        </a>
        <nav className="w-links" aria-label="Main">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`}>{s.short}</a>
          ))}
        </nav>
        <a className="w-btn w-b-ink w-b-sm w-nav-end" href="#order">Order now</a>
        <button type="button" className="w-burger" aria-label="Open the menu" aria-expanded={open} aria-controls="w-drawer" onClick={() => setOpen(true)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      {open && <Drawer onClose={() => setOpen(false)} />}
    </header>
  )
}

const FLOATING = [
  { className: 'w-fl1', image: '/images/menu/jaffna-calamari-pasta.jpg', name: 'Jaffna Calamari' },
  { className: 'w-fl2', image: '/images/menu/hot-basil-chicken-pizza.jpg', name: 'Hot Basil Chicken Pizza' },
  { className: 'w-fl3', image: '/images/menu/italian-sodas.jpg', name: 'Italian Sodas' },
  { className: 'w-fl4', image: '/images/menu/chilli-crab-pasta.jpg', name: 'Chilli Crab Pasta' },
]

function Hero() {
  return (
    <section id="top" className="w-hero w-grain">
      {FLOATING.map((f) => (
        <figure key={f.name} className={`w-fl ${f.className}`}>
          <img src={f.image} alt={f.name} />
          <figcaption>{f.name}</figcaption>
        </figure>
      ))}
      <div className="w-wrap w-hero-in">
        <p className="w-ornament w-eb">
          <Squiggle />
          <span>Casual Italian · Colombo since 2018</span>
          <Squiggle flip />
        </p>
        <h1 className="w-h1">
          <span className="w-mk w-cd w-l1">
            <span className="w-ln w-d1">
              <span>Eat</span>
              <span className="w-bowlwrap">
                <img className="w-bowl" src="/images/menu/carbonara-pasta.jpg" alt="" />
                <span className="w-sticker w-hsticker w-narrow-only" aria-hidden="true">
                  <span className="w-sticker-bg w-burst" />
                  <span className="w-hs-txt">
                    <b>{club.welcomeBonus}</b>
                    <small>pts free</small>
                  </span>
                </span>
              </span>
              <span className="w-pasta">pasta.</span>
            </span>
          </span>
          <span className="w-mk w-slab w-l2">
            <span className="w-ln w-d2">Earn free pasta.</span>
          </span>
        </h1>
        <p className="w-lead">
          Creamy pastas, hand-made pizzas and Sri Lankan favourites like Jaffna Calamari. Show your {club.name} code
          when you pay and <span className="w-hl">every LKR {club.spendPerPoint} earns a point.</span>
        </p>
        <div className="w-ctas">
          <a className="w-btn w-b-gold w-wide-only" href="#menu">
            See the menu <ArrowIcon className="w-ar" width={20} height={20} strokeWidth={2.6} />
          </a>
          <a className="w-btn w-b-ghost w-wide-only" href="#club">Join the Club free</a>
          <a className="w-btn w-b-gold w-narrow-only" href="/app/join">Join free in the app</a>
          <a className="w-btn w-b-ghost w-narrow-only" href="#menu">See the menu</a>
        </div>
        <ul className="w-perks">
          <li className="w-perk"><PinIcon />{branches.length} branches in Colombo</li>
          <li className="w-perk"><BagIcon />Dine-in, takeaway &amp; delivery</li>
          <li className="w-perk"><ChefIcon />Kids pizza workshops</li>
        </ul>
      </div>
    </section>
  )
}

function Tape({ className, words }) {
  const group = (hidden) => (
    <div className="w-grp w-cd" aria-hidden={hidden || undefined}>
      {words.map((w) => (
        <Fragment key={w}>
          <span>{w}</span>
          <Sparkle />
        </Fragment>
      ))}
    </div>
  )
  return (
    <div className={`w-tape ${className}`}>
      <div className="w-mq">
        {group(false)}
        {group(true)}
      </div>
    </div>
  )
}

// Two crossed poster tapes scrolling opposite ways; hover pauses them.
function Tapes() {
  return (
    <div className="w-tapes" aria-hidden="true">
      <Tape className="w-t1" words={['Eat pasta', 'Earn free pasta', 'Join free', 'First Garlic Bread on us']} />
      <Tape className="w-t2" words={['FridayMania', 'Buy 1 get 1 free', 'Every Friday', fridayMania.heroDish]} />
    </div>
  )
}

// On a phone or tablet: a button into the app and how to keep it on the home screen.
function OpenApp({ welcome }) {
  return (
    <section id="app" className="w-cta w-cta-phone">
      {welcome && <img className="w-gb-m" src={welcome.image} alt="" />}
      <div className="w-wrap" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p className="w-eb" style={{ color: '#5c3a00' }}>Join free in 30 seconds</p>
        <h2 className="w-cd w-cta-title">Your first {welcome?.name ?? 'reward'} is waiting</h2>
        <p style={{ fontSize: 16, color: '#4a2a00' }}>
          The Club lives in the PastaMania app: your code, your points and your free food, all in one place.
        </p>
        <a className="w-btn w-b-wine" href="/app/join">
          Open the app <ArrowIcon className="w-ar" width={20} height={20} strokeWidth={2.6} />
        </a>
        <div className="w-home">
          <p className="w-cd" style={{ fontSize: 22, color: 'var(--wine)' }}>Keep it on your home screen</p>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: -4 }}>It opens full screen, like any app. No app store needed.</p>
          <p className="w-howto">
            <span className="w-howicon red">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 15V3M7 8l5-5 5 5" />
                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />
              </svg>
            </span>
            <span><b>iPhone:</b> tap Share, then <b>Add to Home Screen</b></span>
          </p>
          <p className="w-howto">
            <span className="w-howicon gold">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </span>
            <span><b>Android:</b> tap the menu, then <b>Install app</b></span>
          </p>
        </div>
      </div>
    </section>
  )
}

// On a computer the QR code opens this same link, which a phone opens as the app. A phone can't scan its own
// screen, so phones and tablets get a button instead.
function GetApp() {
  const welcome = rewards.find((r) => r.points === club.welcomeBonus)
  const [onPhone] = useState(isPhoneOrTablet)
  if (onPhone) return <OpenApp welcome={welcome} />
  return (
    <section id="app" className="w-cta">
      <div className="w-wrap w-ctag">
        <div className="w-rv" style={{ display: 'flex', flexDirection: 'column', gap: 20, minWidth: 0 }}>
          <p className="w-eb" style={{ color: '#5c3a00' }}>Join free in 30 seconds</p>
          <h2 className="w-cd" style={{ fontSize: 'clamp(52px, 6.6vw, 104px)' }}>
            Your first {welcome?.name ?? 'reward'}
            <br />
            is waiting
          </h2>
          <p style={{ fontSize: 19, maxWidth: 520, color: '#3d2a00' }}>
            Scan the code with your phone camera, join the Club and {club.welcomeBonus} points are yours. Add it to your
            home screen and it opens like an app.
          </p>
          <div>
            <a className="w-btn w-b-ink" href="#club">How the Club works</a>
          </div>
        </div>
        <div className="w-qrwrap w-rv">
          {welcome && <img className="w-gb" src={welcome.image} alt="" />}
          <div className="w-qrbox">
            <div className="w-qr">
              <QRCode value={window.location.origin} size={216} level="H" label="QR code that opens PastaMania on your phone" />
              <img className="w-qr-logo" src={brand.logo} alt="" />
            </div>
            <span>Scan with your phone camera</span>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="w-foot">
      <div className="w-wrap w-fcols">
        <div className="w-fcol w-fcol-about" style={{ flex: '2 1 320px', gap: 16 }}>
          <img src={brand.logo} alt="PastaMania" style={{ width: 72, height: 72 }} />
          <p style={{ color: '#c4b3a8', maxWidth: 420 }}>{brand.about}</p>
        </div>
        <div className="w-fcol w-fcol-eat">
          <p className="w-eb">Eat</p>
          <a href="#menu">Menu</a>
          <a href="#fridaymania">FridayMania</a>
          <a href="#club">{club.name}</a>
        </div>
        <div className="w-fcol">
          <p className="w-eb">Visit</p>
          <a href="#branches">Branches &amp; hours</a>
          <a href="#workshops">Kids workshops</a>
          <span>Catering <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPhone(brand.cateringPhone)}</span></span>
        </div>
        <div className="w-fcol" style={{ flexBasis: 200 }}>
          <p className="w-eb">Say hello</p>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPhone(brand.phone)}</span>
          <span>{brand.email}</span>
          <a href={brand.socials.instagram}>Instagram</a>
          <a href={brand.socials.facebook}>Facebook</a>
        </div>
      </div>
      <p className="w-word w-cd" aria-hidden="true">
        {'PASTAMANIA'.split('').map((letter, i) => (
          <span key={i} className="w-lt">{letter}</span>
        ))}
      </p>
      <div className="w-wrap w-legal" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 }}>
        <p>© {new Date().getFullYear()} PastaMania Sri Lanka. Prices in LKR and may differ between branches.</p>
        <button type="button" className="w-linkbtn" onClick={() => switchView('app')}>Open the app</button>
      </div>
    </footer>
  )
}

// What a computer sees on the same link. `section` is where an address like /menu or /branches lands.
export default function Website({ section = 'top' }) {
  useEffect(() => {
    document.title = 'PastaMania Sri Lanka – pasta & pizza in Colombo'
    if (section !== 'top') document.getElementById(section)?.scrollIntoView()
  }, [section])

  return (
    <div className="site">
      <Nav />
      <Hero />
      <Tapes />
      <FridaySection />
      <MenuSection />
      <ClubSection />
      <BranchesSection />
      <WorkshopsSection />
      <FaqSection />
      <GetApp />
      <Footer />
    </div>
  )
}
