import { useState } from 'react'

// The advertising slot: whole pieces of artwork, full width, swiped. Display only – no link.
export default function Banners({ banners }) {
  const [at, setAt] = useState(0)

  if (banners.length === 0) return null

  // Which slide is showing, from how far the rail has been scrolled.
  const onScroll = (e) => {
    const el = e.currentTarget
    const i = Math.round(el.scrollLeft / (el.scrollWidth / banners.length))
    if (i !== at) setAt(Math.max(0, Math.min(banners.length - 1, i)))
  }

  return (
    <div className="banners">
      <ul className="banner-rail" onScroll={onScroll} aria-label="Offers">
        {banners.map((b, i) => (
          <li key={b.id}>
            <img src={b.image} alt={b.title} width="1080" height="540" loading={i === 0 ? 'eager' : 'lazy'} />
          </li>
        ))}
      </ul>
      {banners.length > 1 && (
        <div className="banner-dots" aria-hidden="true">
          {banners.map((b, i) => (
            <span key={b.id} className={i === at ? 'on' : ''} />
          ))}
        </div>
      )}
    </div>
  )
}
