import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'
import { CalendarIcon, GiftIcon, HomeIcon, MenuIcon } from './Icons.jsx'
import QRCode from './QRCode.jsx'

const TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/menu', label: 'Menu', Icon: MenuIcon },
  { to: '/rewards', label: 'Rewards', Icon: GiftIcon },
  { to: '/book', label: 'Book', Icon: CalendarIcon },
]

// Phone-width app shell. On wide screens the app sits beside a QR code for opening it on a phone.
export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="stage">
      <aside className="stage-panel" aria-hidden="true">
        <img src={brand.logo} alt="" width="104" height="104" />
        <p className="retro retro-gold stage-title">{club.name}</p>
        <p className="stage-text">Scan to open on your phone</p>
        <QRCode value={window.location.origin} size={150} label="Open on your phone" />
      </aside>

      <div className="app">
        <main className="screen">
          <Outlet />
        </main>

        <nav className="tabbar" aria-label="Main">
          {TABS.map(({ to, label, Icon, end }) => (
            <NavLink key={to} to={to} end={end}>
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
