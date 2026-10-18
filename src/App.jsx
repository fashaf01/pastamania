import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { OrderProvider } from './components/OrderSheet.jsx'
import { ToastProvider } from './components/Toast.jsx'
import { ClubProvider } from './context/ClubContext.jsx'
import BookingDetail from './pages/BookingDetail.jsx'
import Bookings from './pages/Bookings.jsx'
import Branches from './pages/Branches.jsx'
import Catering from './pages/Catering.jsx'
import Home from './pages/Home.jsx'
import Join from './pages/Join.jsx'
import MemberCard from './pages/MemberCard.jsx'
import Menu from './pages/Menu.jsx'
import NotFound from './pages/NotFound.jsx'
import Offers from './pages/Offers.jsx'
import Profile from './pages/Profile.jsx'
import Rewards from './pages/Rewards.jsx'
import WorkshopBooking from './pages/WorkshopBooking.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <ClubProvider>
        <ToastProvider>
          <OrderProvider>
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="menu" element={<Menu />} />
                <Route path="card" element={<MemberCard />} />
                <Route path="rewards" element={<Rewards />} />
                <Route path="bookings" element={<Bookings />} />
                <Route path="bookings/workshop/:sessionId" element={<WorkshopBooking />} />
                <Route path="bookings/:ref" element={<BookingDetail />} />
                <Route path="join" element={<Join />} />
                <Route path="me" element={<Profile />} />
                <Route path="offers" element={<Offers />} />
                <Route path="branches" element={<Branches />} />
                <Route path="catering" element={<Catering />} />
                <Route path="events" element={<Bookings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </OrderProvider>
        </ToastProvider>
      </ClubProvider>
    </BrowserRouter>
  )
}
