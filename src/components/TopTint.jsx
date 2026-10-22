import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

const PAGE = { r: 255, g: 246, b: 234 } // cream page background

// 'rgba(63, 10, 13, 0.5)' -> { r, g, b, a }
const parse = (css) => {
  const n = css.match(/[\d.]+/g)?.map(Number) ?? []
  return n.length >= 3 ? { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 } : null
}

// What the screen looks like at one point: every background there, blended top to bottom.
const colourAt = (x, y) => {
  const layers = []
  let texture = null
  for (const el of document.elementsFromPoint(x, y)) {
    const style = getComputedStyle(el)
    const c = parse(style.backgroundColor)
    if (!c || c.a === 0) continue
    layers.push(c)
    if (c.a === 1) {
      if (style.backgroundImage.startsWith('url(')) texture = { image: style.backgroundImage, size: style.backgroundSize }
      break
    }
  }
  const out = layers.reverse().reduce((under, c) => ({
    r: c.r * c.a + under.r * (1 - c.a),
    g: c.g * c.a + under.g * (1 - c.a),
    b: c.b * c.a + under.b * (1 - c.a),
  }), PAGE)
  return { colour: `rgb(${Math.round(out.r)}, ${Math.round(out.g)}, ${Math.round(out.b)})`, texture }
}

// Colours the strip behind the phone's clock and battery to match the top of the screen: wine over Home, Me
// and Rewards, red over a dish, cream over the menu, changing as you scroll.
// Safari on iOS 26 ignores the theme-color tag and takes the colour of whatever is fixed to the top of the page
// (otherwise the body's, which is cream), so a thin fixed strip carries the colour. Older Safari and Android
// read theme-color, which is kept in step.
export default function TopTint() {
  const strip = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]')
    let frame = 0
    const update = () => {
      const el = strip.current
      if (!el) return
      const y = el.offsetHeight + 2
      const app = document.querySelector('.app')?.getBoundingClientRect()
      const left = (app?.left ?? 0) + 8
      const right = (app?.right ?? window.innerWidth) - 8
      const middle = colourAt((left + right) / 2, y)
      // Only when the top is one colour edge to edge: a rounded header end passing under it would
      // otherwise show as a stripe across its corners.
      const even = [left, right].every((x) => colourAt(x, y).colour === middle.colour)
      el.style.visibility = even ? 'visible' : 'hidden'
      el.style.backgroundColor = middle.colour
      el.style.backgroundImage = middle.texture?.image ?? 'none'
      el.style.backgroundSize = middle.texture?.size ?? ''
      meta?.setAttribute('content', middle.colour)
    }
    const schedule = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }
    // Screens ease in, so look again once they've settled.
    schedule()
    const settled = setTimeout(schedule, 700)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    // Sheets and screens that change in place (joining, signing out) change the top without a scroll.
    const watcher = new MutationObserver(schedule)
    watcher.observe(document.body, { childList: true, subtree: true })
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(settled)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      watcher.disconnect()
    }
  }, [pathname])

  return <div ref={strip} className="top-tint" aria-hidden="true" />
}
