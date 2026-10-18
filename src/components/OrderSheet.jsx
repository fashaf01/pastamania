import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { branches } from '../data/branches.js'
import { brand } from '../data/brand.js'
import { CloseIcon } from './Icons.jsx'

const OrderContext = createContext(() => {})

export const useOrder = () => useContext(OrderContext)

export function OrderProvider({ children }) {
  const [open, setOpen] = useState(false)
  const openSheet = useCallback(() => setOpen(true), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <OrderContext.Provider value={openSheet}>
      {children}
      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-head">
              <h2 id="order-title">Order delivery</h2>
              <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            <p className="muted">Choose your nearest branch.</p>
            <ul className="order-list">
              {branches.map((b) => (
                <li key={b.id} className="order-row">
                  <div>
                    <strong>{b.name}</strong>
                    <span className="muted small">{b.address}</span>
                  </div>
                  <a className="btn btn-uber" href={b.uberEatsUrl} target="_blank" rel="noreferrer">
                    Uber Eats
                  </a>
                </li>
              ))}
            </ul>
            <a className="btn btn-outline btn-block" href={brand.pickmeUrl} target="_blank" rel="noreferrer">
              Also on PickMe Food
            </a>
          </div>
        </div>
      )}
    </OrderContext.Provider>
  )
}
