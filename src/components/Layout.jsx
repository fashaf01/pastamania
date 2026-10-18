import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'
import { CalendarIcon, GiftIcon, HomeIcon, MenuIcon, QrIcon } from './Icons.jsx'
import QRCode from './QRCode.jsx'

const TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/menu', label: 'Menu', Icon: MenuIcon },
  { to: '/card', label: 'My Card', Icon: QrIcon, centre: true },
  { to: '/rewards', label: 'Rewards', Icon: GiftIcon },
  { to: '/bookings', label: 'Bookings', Icon: CalendarIcon },
]

// Phone-width app shell. On wide screens the app sits beside a brand panel with a QR code
// for opening it on a phone.
export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="stage">
      <aside className="stage-panel" aria-hidden="true">
        <img src={brand.logo} alt="" width="120" height="120" />
        <p className="retro retro-gold stage-title">{club.name}</p>
        <p className="caps-white">Earn · Redeem · Book</p>
        <p className="stage-text">Scan to open the app on your phone, then add it to your home screen.</p>
        <QRCode value={window.location.origin} size={160} label="Open on your phone" />
      </aside>

      <div className="app">
        <main className="screen">
          <Outlet />
        </main>

        <nav className="tabbar" aria-label="Main">
          {TABS.map(({ to, label, Icon, end, centre }) => (
            <NavLink key={to} to={to} end={end} className={centre ? 'tab-centre' : undefined}>
              <span className="tab-icon">
                <Icon />
              </span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
