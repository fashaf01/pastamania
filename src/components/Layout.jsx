import { useEffect } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { GiftIcon, HomeIcon, MenuIcon, QrIcon, WalletIcon } from './Icons.jsx'

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

// Phone-width app shell. On wide screens it stays a phone-width column on a page of the same colour,
// so it looks like the phone app rather than a website.
export default function Layout() {
  const { pathname } = useLocation()
  const { member, vouchers } = useClub()
  const readyVouchers = vouchers.filter((v) => voucherStatus(v) === 'ready').length
  // A guest's home is the full-screen welcome poster.
  const showTabs = TAB_SCREENS.includes(pathname) && !(pathname === '/' && !member)

  // Braces matter: newer Chrome returns a Promise from scrollTo, and an effect that returns it hands
  // React a "cleanup" that isn't a function, which crashes the next screen change.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="stage">
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
