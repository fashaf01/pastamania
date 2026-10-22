import { Fragment, useEffect } from 'react'
import { ArrowIcon, BagIcon, ChefIcon, PinIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { brand } from '../data/brand.js'
import { branches } from '../data/branches.js'
import { club, rewards } from '../data/club.js'
import { fridayMania } from '../data/offers.js'
import { formatPhone } from '../lib/format.js'
import { switchView } from '../lib/view.js'
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

function Nav() {
  return (
    <header className="w-nav">
      <div className="w-nav-in">
        <a className="w-logo" href="#top" aria-label="PastaMania home">
          <img src={brand.logo} alt="" />
        </a>
        <nav className="w-links" aria-label="Main">
          <a href="#menu">Menu</a>
          <a href="#fridaymania">FridayMania</a>
          <a href="#club">Club</a>
          <a href="#branches">Branches</a>
          <a href="#workshops">Kids workshops</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="w-btn w-b-ink w-b-sm w-nav-end" href="#order">Order now</a>
      </div>
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
              Eat <img className="w-bowl" src="/images/menu/carbonara-pasta.jpg" alt="" /> pasta.
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
          <a className="w-btn w-b-gold" href="#menu">
            See the menu <ArrowIcon className="w-ar" width={20} height={20} strokeWidth={2.6} />
          </a>
          <a className="w-btn w-b-ghost" href="#club">Join the Club free</a>
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

// The QR code opens this same link, which a phone opens as the app.
function GetApp() {
  const welcome = rewards.find((r) => r.points === club.welcomeBonus)
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
        <div className="w-fcol" style={{ flex: '2 1 320px', gap: 16 }}>
          <img src={brand.logo} alt="PastaMania" style={{ width: 72, height: 72 }} />
          <p style={{ color: '#c4b3a8', maxWidth: 420 }}>{brand.about}</p>
        </div>
        <div className="w-fcol">
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
        <button type="button" className="w-linkbtn" onClick={() => switchView('app')}>Open the app view</button>
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
