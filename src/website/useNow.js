import { useEffect, useState } from 'react'

// The current time, refreshed every `every` ms (countdowns, open-now badges).
export function useNow(every = 1000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), every)
    return () => clearInterval(id)
  }, [every])
  return now
}
