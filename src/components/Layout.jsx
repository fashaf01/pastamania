import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { brand } from '../data/brand.js'
import { formatPhone } from '../lib/format.js'
import { BagIcon, HomeIcon, MenuIcon, PinIcon, StarIcon, TagIcon } from './Icons.jsx'
import { useOrder } from './OrderSheet.jsx'

const NAV = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/menu', label: 'Menu', Icon: MenuIcon },
  { to: '/offers', label: 'Offers', Icon: TagIcon },
  { to: '/branches', label: 'Branches', Icon: PinIcon },
  { to: '/events', label: 'Events', Icon: StarIcon },
]

export default function Layout() {
  const openOrder = useOrder()
  const { pathname } = useLocation()

  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <NavLink to="/" className="logo" aria-label="PastaMania home">
            <span className="logo-mark">P</span>
            <span className="logo-text">
              Pasta<span>Mania</span>
            </span>
          </NavLink>
          <nav className="topnav" aria-label="Main">
            {NAV.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end}>
                {label}
              </NavLink>
            ))}
          </nav>
          <button className="btn btn-primary btn-sm" onClick={openOrder}>
            <BagIcon width={18} height={18} /> Order
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <p className="footer-brand">PastaMania Sri Lanka</p>
            <p className="muted small">{brand.tagline}</p>
          </div>
          <div className="footer-links">
            <a href={`tel:${brand.phone}`}>{formatPhone(brand.phone)}</a>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={brand.socials.instagram} target="_blank" rel="noreferrer">Instagram</a>
            <a href={brand.socials.facebook} target="_blank" rel="noreferrer">Facebook</a>
          </div>
        </div>
      </footer>

      <nav className="tabbar" aria-label="Main">
        {NAV.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  )
}
