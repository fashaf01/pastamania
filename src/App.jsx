import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { OrderProvider } from './components/OrderSheet.jsx'
import Branches from './pages/Branches.jsx'
import Events from './pages/Events.jsx'
import Home from './pages/Home.jsx'
import Menu from './pages/Menu.jsx'
import NotFound from './pages/NotFound.jsx'
import Offers from './pages/Offers.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <OrderProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="offers" element={<Offers />} />
            <Route path="branches" element={<Branches />} />
            <Route path="events" element={<Events />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </OrderProvider>
    </BrowserRouter>
  )
}
