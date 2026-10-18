// PastaMania Club – proposed loyalty programme. Every number here is a proposal for the brand to confirm.

export const club = {
  name: 'PastaMania Club',
  pointsName: 'Mania Points',
  spendPerPoint: 100, // LKR spent per point earned
  welcomeBonus: 100,
  birthdayBonus: 200,
  voucherValidDays: 30,
}

// Tier is based on points earned in the last 12 months.
export const tiers = [
  {
    id: 'al-dente',
    name: 'Al Dente',
    minPoints: 0,
    multiplier: 1,
    colour: '#c8161e',
    perks: ['1 point for every LKR 100', '100 welcome points', 'Birthday treat: 200 points'],
  },
  {
    id: 'bella',
    name: 'Bella',
    minPoints: 1500,
    multiplier: 1.25,
    colour: '#c77d0a',
    perks: ['1.25× points on every visit', 'Free Garlic Bread every month', 'Early access to Dough Workz dates'],
  },
  {
    id: 'maestro',
    name: 'Maestro',
    minPoints: 4000,
    multiplier: 1.5,
    colour: '#231f20',
    perks: ['1.5× points on every visit', 'Free dessert or soda every month', 'Priority Dough Workz booking', 'Invites to new menu tastings'],
  },
]

export const rewards = [
  { id: 'garlic-bread', name: 'Garlic Bread', points: 150, image: '/images/menu/garlic-bread.jpg', category: 'Starters' },
  { id: 'cheesy-garlic-bread', name: 'Cheesy Garlic Bread', points: 250, image: '/images/menu/cheesy-garlic-bread.jpg', category: 'Starters' },
  { id: 'italian-soda', name: 'Any Italian Soda', points: 300, image: '/images/menu/strawberry-italian-soda.jpg', category: 'Drinks' },
  { id: 'aglio-pasta', name: 'Any Aglio Pasta', points: 500, image: '/images/menu/basil-chicken-aglio-pasta.jpg', category: 'Mains' },
  { id: 'dough-workz-off', name: 'LKR 1,000 off Dough Workz', points: 600, image: '/images/menu/margherita-pizza-7inch.jpg', category: 'Experiences' },
  { id: 'classic-pasta', name: 'Any Classic Pasta', points: 800, image: '/images/menu/carbonara-pasta.jpg', category: 'Mains' },
  { id: 'pizza', name: 'Any Regular Pizza', points: 900, image: '/images/menu/pepperoni-pizza.jpg', category: 'Mains' },
]

export const getTier = (lifetimePoints) => [...tiers].reverse().find((t) => lifetimePoints >= t.minPoints)

export const getNextTier = (lifetimePoints) => tiers.find((t) => t.minPoints > lifetimePoints) ?? null

export const pointsForSpend = (amount, tier = tiers[0]) => Math.floor((amount / club.spendPerPoint) * tier.multiplier)
