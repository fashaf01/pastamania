import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { OrderProvider } from './components/OrderSheet.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { ClubProvider } from './context/ClubContext.jsx'
import { ThemeProvider } from './lib/theme.jsx'
import BookingDetail from './pages/BookingDetail.jsx'
import Bookings from './pages/Bookings.jsx'
import Branches from './pages/Branches.jsx'
import Catering from './pages/Catering.jsx'
import Dish from './pages/Dish.jsx'
import History from './pages/History.jsx'
import Home from './pages/Home.jsx'
import Join from './pages/Join.jsx'
import MemberCard from './pages/MemberCard.jsx'
import Menu from './pages/Menu.jsx'
import NotFound from './pages/NotFound.jsx'
import Profile from './pages/Profile.jsx'
import Rewards from './pages/Rewards.jsx'
import Staff from './pages/Staff.jsx'
import Voucher from './pages/Voucher.jsx'
import Wallet from './pages/Wallet.jsx'

// Old links to a single session (/book/<id>) open the booking page with that session picked.
function SessionLink() {
  const { sessionId } = useParams()
  return <Navigate to={`/book?session=${encodeURIComponent(sessionId)}`} replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ClubProvider>
          <ToastProvider>
            <OrderProvider>
              <Routes>
                <Route element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="menu/:slug" element={<Dish />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="wallet" element={<Wallet />} />
                  <Route path="wallet/:id" element={<Voucher />} />
                  <Route path="book" element={<Bookings />} />
                  <Route path="book/ticket/:ref" element={<BookingDetail />} />
                  <Route path="book/:sessionId" element={<SessionLink />} />
                  <Route path="card" element={<MemberCard />} />
                  <Route path="join" element={<Join />} />
                  <Route path="me" element={<Profile />} />
                  <Route path="history" element={<History />} />
                  <Route path="staff" element={<Staff />} />
                  <Route path="branches" element={<Branches />} />
                  <Route path="catering" element={<Catering />} />
                  <Route path="offers" element={<Navigate to="/" replace />} />
                  <Route path="bookings" element={<Navigate to="/book" replace />} />
                  <Route path="events" element={<Navigate to="/book" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </OrderProvider>
          </ToastProvider>
        </ClubProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
