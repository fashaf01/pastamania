import { useState } from 'react'
import { MenuIcon } from './Icons.jsx'

// Food photo with a plain placeholder when there is no photo or it fails to load.
export default function DishImage({ item, className = '', alt = '' }) {
  const [failed, setFailed] = useState(false)

  if (!item.image || failed) {
    return (
      <div className={`dish-img dish-img-fallback ${className}`} aria-hidden="true">
        <MenuIcon width={28} height={28} />
      </div>
    )
  }

  return <img className={`dish-img ${className}`} src={item.image} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} />
}
