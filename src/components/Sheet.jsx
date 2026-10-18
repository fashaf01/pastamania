import { useEffect, useRef } from 'react'
import { CloseIcon } from './Icons.jsx'

// Bottom sheet dialog. Closes on backdrop tap and Escape.
export default function Sheet({ title, onClose, children }) {
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && close.current()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div className="sheet-backdrop" onClick={() => close.current()}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <h2>{title}</h2>
          <button className="icon-btn" onClick={() => close.current()} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
