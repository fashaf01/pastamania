import { createContext, useCallback, useContext, useState } from 'react'
import { branches } from '../data/branches.js'
import { brand } from '../data/brand.js'
import Sheet from './Sheet.jsx'

const OrderContext = createContext(() => {})

export const useOrder = () => useContext(OrderContext)

export function OrderProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openSheet = useCallback(() => setOpen(true), [])
  const close = useCallback(() => setOpen(false), [])

  return (
    <OrderContext.Provider value={openSheet}>
      {children}
      {open && (
        <Sheet title="Order delivery" onClose={close}>
          <p className="muted">Choose your nearest branch.</p>
          <ul className="order-list">
            {branches.map((b) => (
              <li key={b.id} className="order-row">
                <div>
                  <strong>{b.name}</strong>
                  <span className="muted small">{b.address}</span>
                </div>
                <a className="btn btn-uber btn-sm" href={b.uberEatsUrl} target="_blank" rel="noreferrer">
                  Uber Eats
                </a>
              </li>
            ))}
          </ul>
          <a className="btn btn-outline btn-block" href={brand.pickmeUrl} target="_blank" rel="noreferrer">
            Also on PickMe Food
          </a>
          <p className="footnote">Delivery platforms set their own prices. Points are earned in store only, not on delivery orders.</p>
        </Sheet>
      )}
    </OrderContext.Provider>
  )
}
