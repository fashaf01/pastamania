import { useState } from 'react'
import { categoryIcon } from '../data/menu.js'

// Food photo with a category-icon fallback when there is no photo or it fails to load.
export default function DishImage({ item, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!item.image || failed) {
    return (
      <div className={`dish-img dish-img-fallback ${className}`} aria-hidden="true">
        {categoryIcon(item.category)}
      </div>
    )
  }

  return (
    <img
      className={`dish-img ${className}`}
      src={item.image}
      alt={item.name}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  )
}
