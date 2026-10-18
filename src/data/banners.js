// Promotion banners for the Home screen – the app's advertising slot.
//
// A banner is a finished piece of artwork (2:1, 1080 × 540 or larger, JPG/PNG/WebP under ~200 KB,
// text kept 64 px inside the edges). Put the file in public/banners/ and add a row here.
// `starts` / `ends` (YYYY-MM-DD, inclusive) schedule an offer; leave them out to run it until removed.
// Banners are display only, like Chatime's: tapping one goes nowhere, so an ad can never promise
// something a screen doesn't have.
export const banners = [
  { id: 'fridaymania', title: 'FridayMania: buy 1, get 1 free every Friday', image: '/banners/fridaymania.jpg' },
  { id: 'dough-workz', title: 'Dough Workz kids pizza-making workshops, ages 4–12', image: '/banners/dough-workz.jpg' },
  { id: 'christmas', title: 'Christmas menu coming soon', image: '/banners/christmas.jpg', starts: '2026-10-15', ends: '2026-12-31' },
  { id: 'combos', title: 'Double Penne and Solo Spaghetti combos on Uber Eats', image: '/banners/combos.jpg' },
]

const today = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Banners running today, in the order above.
export const liveBanners = (day = today()) =>
  banners.filter((b) => (!b.starts || b.starts <= day) && (!b.ends || b.ends >= day))
