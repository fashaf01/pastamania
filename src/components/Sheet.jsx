import { useEffect, useRef } from 'react'
import { CloseIcon } from './Icons.jsx'

// Bottom sheet dialog. Closes on backdrop tap and Escape. Without a `title` it shows only the grab handle
// (the content then carries its own heading, labelled by `labelledBy`).
export default function Sheet({ title, labelledBy, onClose, children }) {
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
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : title}
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="sheet-handle" aria-hidden="true" />
        {title && (
          <div className="sheet-head">
            <h2 className="title-l">{title}</h2>
            <button type="button" className="round-btn" onClick={() => close.current()} aria-label="Close">
              <CloseIcon width={20} height={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
