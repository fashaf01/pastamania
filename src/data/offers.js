// FridayMania: buy 1, get 1 free on the week's hero dish, every Friday (dine-in, takeaway and delivery).
// Change `heroDish` each week to the dish's name exactly as it appears in menu.js.
export const fridayMania = {
  heroDish: 'Hot Basil Chicken Pizza', // from the 25 Sep 2026 poster – confirm each week
  image: '/images/promo/fridaymania-pizza.jpg',
}

// The coming Friday (today, if it is Friday).
export const nextFriday = (from = new Date()) => {
  const d = new Date(from)
  d.setDate(d.getDate() + ((5 - d.getDay() + 7) % 7))
  return d
}
