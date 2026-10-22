import { useEffect, useRef, useState } from 'react'

export const prefersReducedMotion = () => !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Counts up (or down) to `value` with an ease-out, from 0 the first time it shows.
// People who turn motion off see the number straight away.
export function useCountUp(value, duration = 900) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0))
  const current = useRef(shown)

  useEffect(() => {
    if (prefersReducedMotion()) {
      current.current = value
      setShown(value)
      return
    }
    const from = current.current
    const start = performance.now()
    let frame
    const step = (now) => {
      const k = Math.min(1, (now - start) / duration)
      current.current = Math.round(from + (value - from) * (1 - (1 - k) ** 3))
      setShown(current.current)
      if (k < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [value, duration])

  return shown
}

// False on the first paint, then true: lets a progress bar or ring fill in from empty when a screen opens.
export function useEntered() {
  const [entered, setEntered] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setEntered(true), 60)
    return () => clearTimeout(timer)
  }, [])
  return entered
}
