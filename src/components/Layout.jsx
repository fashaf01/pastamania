import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'
import ErrorBoundary from './ErrorBoundary.jsx'
import { CalendarIcon, GiftIcon, HomeIcon, MenuIcon, WalletIcon } from './Icons.jsx'
import QRCode from './QRCode.jsx'

const TABS = [
  { to: '/', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/menu', label: 'Menu', Icon: MenuIcon },
  { to: '/rewards', label: 'Rewards', Icon: GiftIcon },
  { to: '/wallet', label: 'Wallet', Icon: WalletIcon, end: true },
  { to: '/book', label: 'Book', Icon: CalendarIcon },
]

// Screens shown at the counter get the whole phone: no tab bar under the QR.
const FULL_SCREEN = [/^\/card$/, /^\/wallet\/.+/, /^\/staff$/]

// Phone-width app shell. On wide screens the app sits beside a QR code for opening it on a phone.
export default function Layout() {
  const { pathname } = useLocation()
  const { vouchers } = useClub()
  const readyVouchers = vouchers.filter((v) => voucherStatus(v) === 'ready').length
  const showTabs = !FULL_SCREEN.some((re) => re.test(pathname))

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
          {/* Keyed by path so a failed screen recovers as soon as you go somewhere else. */}
          <ErrorBoundary key={pathname}>
            <Outlet />
          </ErrorBoundary>
        </main>

        {showTabs && (
          <nav className="tabbar" aria-label="Main">
            {TABS.map(({ to, label, Icon, end }) => (
              <NavLink key={to} to={to} end={end}>
                <span className="tab-icon">
                  <Icon />
                  {to === '/wallet' && readyVouchers > 0 && <span className="tab-dot" aria-label={`${readyVouchers} ready`} />}
                </span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </div>
  )
}
