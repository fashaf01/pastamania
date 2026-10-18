// PastaMania Club – proposed loyalty programme. Every number here is a proposal for the brand to confirm.
// Kept deliberately simple: spend → points → free food. Joining is worth a free Garlic Bread straight away.

export const club = {
  name: 'PastaMania Club',
  spendPerPoint: 100, // LKR spent per point earned
  welcomeBonus: 150, // = a free Garlic Bread
  voucherValidDays: 30,
}

export const rewards = [
  { id: 'garlic-bread', name: 'Garlic Bread', points: 150, image: '/images/menu/garlic-bread.jpg' },
  { id: 'cheesy-garlic-bread', name: 'Cheesy Garlic Bread', points: 250, image: '/images/menu/cheesy-garlic-bread.jpg' },
  { id: 'italian-soda', name: 'Italian Soda', points: 300, image: '/images/menu/strawberry-italian-soda.jpg' },
  { id: 'aglio-pasta', name: 'Any Aglio Pasta', points: 500, image: '/images/menu/basil-chicken-aglio-pasta.jpg' },
  { id: 'classic-pasta', name: 'Any Classic Pasta', points: 800, image: '/images/menu/carbonara-pasta.jpg' },
  { id: 'pizza', name: 'Any Regular Pizza', points: 900, image: '/images/menu/pepperoni-pizza.jpg' },
]

export const pointsForSpend = (amount) => Math.floor(amount / club.spendPerPoint)

// The cheapest reward the balance can't cover yet.
export const nextReward = (balance) => rewards.find((r) => r.points > balance) ?? null

// The best reward the balance already covers.
export const bestReadyReward = (balance) => [...rewards].reverse().find((r) => r.points <= balance) ?? null
