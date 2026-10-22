import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion.js'
import { CloseIcon } from './Icons.jsx'

const SheetContext = createContext(() => {})

// Closes the sheet this is rendered in, sliding it away first. For buttons inside a sheet ("Not now", "Done").
export const useSheetClose = () => useContext(SheetContext)

// Bottom sheet dialog. Slides up; closes on backdrop tap, Escape or the close button, sliding back down.
// Without a `title` it shows only the grab handle (the content then carries its own heading, labelled by `labelledBy`).
export default function Sheet({ title, labelledBy, onClose, children }) {
  const close = useRef(onClose)
  close.current = onClose
  const [leaving, setLeaving] = useState(false)
  const timer = useRef()

  const dismiss = useCallback(() => {
    if (prefersReducedMotion()) return close.current()
    setLeaving(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => close.current(), 220)
  }, [])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && dismiss()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(timer.current)
    }
  }, [dismiss])

  return (
    <SheetContext.Provider value={dismiss}>
      <div className={`sheet-backdrop ${leaving ? 'leaving' : ''}`} onClick={dismiss}>
        <div
          className={`sheet ${leaving ? 'leaving' : ''}`}
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
              <button type="button" className="round-btn" onClick={dismiss} aria-label="Close">
                <CloseIcon width={20} height={20} />
              </button>
            </div>
          )}
          {children}
        </div>
      </div>
    </SheetContext.Provider>
  )
}
