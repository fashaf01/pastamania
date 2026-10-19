import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { club } from '../data/club.js'
import ErrorBoundary from './ErrorBoundary.jsx'
import { GiftIcon, HomeIcon, MenuIcon, QrIcon, WalletIcon } from './Icons.jsx'
import QRCode from './QRCode.jsx'

// The tab bar shows on the four tab screens only. Pushed screens, and the counter-facing screens
// (My code, vouchers), get the whole phone.
const TAB_SCREENS = ['/', '/menu', '/rewards', '/wallet']

function TabBar({ readyVouchers }) {
  const tab = ({ isActive }) => `tab ${isActive ? 'active' : ''}`
  return (
    <nav className="tabbar" aria-label="Main">
      <NavLink to="/" end className={tab}>
        <HomeIcon width={24} height={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/menu" className={tab}>
        <MenuIcon width={24} height={24} />
        <span>Menu</span>
      </NavLink>
      <NavLink to="/card" className="tab tab-code">
        <span className="tab-code-btn">
          <QrIcon width={26} height={26} />
        </span>
        <span>My code</span>
      </NavLink>
      <NavLink to="/rewards" className={tab}>
        <GiftIcon width={24} height={24} />
        <span>Rewards</span>
      </NavLink>
      <NavLink to="/wallet" end className={tab}>
        <span className="tab-icon">
          <WalletIcon width={24} height={24} />
          {readyVouchers > 0 && <span className="tab-dot" />}
        </span>
        <span>
          Wallet
          {readyVouchers > 0 && <span className="sr-only">, {readyVouchers} ready</span>}
        </span>
      </NavLink>
    </nav>
  )
}

// Phone-width app shell. On wide screens the app sits beside a QR code for opening it on a phone.
export default function Layout() {
  const { pathname } = useLocation()
  const { member, vouchers } = useClub()
  const readyVouchers = vouchers.filter((v) => voucherStatus(v) === 'ready').length
  // A guest's home is the full-screen welcome poster.
  const showTabs = TAB_SCREENS.includes(pathname) && !(pathname === '/' && !member)

  useEffect(() => window.scrollTo(0, 0), [pathname])

  return (
    <div className="stage">
      <aside className="stage-panel" aria-hidden="true">
        <img src={brand.logo} alt="" width="104" height="104" />
        <p className="hatch stage-title">{club.name}</p>
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
        {showTabs && <TabBar readyVouchers={readyVouchers} />}
      </div>
    </div>
  )
}
