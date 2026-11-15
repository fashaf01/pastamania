import { useEffect } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import ErrorBoundary from '../components/ErrorBoundary.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import AfterVisit from './screens/AfterVisit.jsx'
import Celebrate from './screens/Celebrate.jsx'
import Code from './screens/Code.jsx'
import Counter from './screens/Counter.jsx'
import Deals from './screens/Deals.jsx'
import Home from './screens/Home.jsx'
import Join from './screens/Join.jsx'
import Manager from './screens/Manager.jsx'
import Me from './screens/Me.jsx'
import Menu from './screens/Menu.jsx'
import Pass from './screens/Pass.jsx'
import Rewards from './screens/Rewards.jsx'
import UseDeal from './screens/UseDeal.jsx'
import Voucher from './screens/Voucher.jsx'
import { useV2, V2Provider } from './store.jsx'
import { TabBar } from './ui.jsx'
import './v2.css'

const TAB_SCREENS = ['/v2', '/v2/menu', '/v2/deals', '/v2/rewards', '/v2/me']
const COUNTER_SCREENS = ['/v2/counter']

// Phone-width shell with the five tabs. When the counter records a visit for the member on this device
// (another tab, or this phone at the till), the app opens the "Thanks" screen with their treat and a rating.
function Shell() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const club = useClub()
  const v2 = useV2()
  const path = pathname.replace(/\/+$/, '') || '/v2'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [path])

  const memberId = club.member?.id
  const fresh = v2.visits.find((v) => v.memberId === memberId && !v.seen && Date.now() - v.at < 2 * 60 * 60 * 1000)
  useEffect(() => {
    if (fresh && !COUNTER_SCREENS.includes(path) && !path.startsWith('/v2/visit/')) navigate(`/v2/visit/${fresh.id}`)
  }, [fresh, path, navigate])

  const ready =
    club.vouchers.filter((v) => voucherStatus(v) === 'ready').length + (memberId ? v2.treatsFor(memberId).length : 0)

  return (
    <div className="v2">
      <div className="v2-app">
        <ErrorBoundary key={path}>
          <Outlet />
        </ErrorBoundary>
        {TAB_SCREENS.includes(path) && <TabBar dots={{ Rewards: ready }} />}
      </div>
    </div>
  )
}

export default function V2App() {
  return (
    <V2Provider>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="menu" element={<Menu />} />
          <Route path="deals" element={<Deals />} />
          <Route path="deals/:id" element={<UseDeal />} />
          <Route path="code" element={<Code />} />
          <Route path="pass" element={<Pass />} />
          <Route path="visit/:id" element={<AfterVisit />} />
          <Route path="celebrate" element={<Celebrate />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="voucher/:id" element={<Voucher />} />
          <Route path="me" element={<Me />} />
          <Route path="join" element={<Join />} />
          <Route path="counter" element={<Counter />} />
        </Route>
        <Route
          path="manager"
          element={
            <div className="v2">
              <Manager />
            </div>
          }
        />
        <Route path="*" element={<Navigate to="/v2" replace />} />
      </Routes>
    </V2Provider>
  )
}
