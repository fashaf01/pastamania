// The five ways the new app (/v2) makes PastaMania money, and their settings.
// Every number here is a SAMPLE for PastaMania to set. The manager page switches each one on or off.
import { branches } from '../data/branches.js'
import { fridayMania, nextFriday } from '../data/offers.js'
import { workshop } from '../data/workshops.js'

export const levers = {
  // After every visit the guest gets a small treat that only works on the next visit within `days`.
  comeBack: { label: 'Come-back treats', item: 'Garlic Bread', itemPrice: 490, days: 14, image: '/images/menu/garlic-bread.jpg' },
  // Paid at the counter: `paid` lunches upfront, then `free` more on the house. `lunchValue` costs the free one.
  pass: { label: 'Pasta Pass', paid: 5, free: 1, price: 9500, lunchValue: 1900, limit: 200, counts: 'Any pasta or regular pizza' },
  // Double points in the slow hours (weekday numbers: 0 = Sunday), and the manager's 2-hour "Fill it now" deal.
  quiet: { label: 'Quiet-hour boost', days: [1, 2, 3, 4], from: 15, to: 18, multiplier: 2, flashHours: 2 },
  // Spend `spend` in one bill and `off` comes off. The deal ends after `ends`.
  goal: { label: 'Bigger-bill goal', spend: 5000, off: 1000, ends: '2026-11-24' },
  parties: { label: 'Parties and catering' },
}

export const LEVERS = ['comeBack', 'pass', 'quiet', 'goal', 'parties']

// What one point is worth in free food (Garlic Bread: Rs. 490 for 150 points), to cost the double points.
export const POINT_VALUE = 490 / 150

export const partyTypes = [
  {
    id: 'kids',
    label: 'Kids party',
    title: 'Dough Workz birthday party',
    blurb: 'Kids make and bake their own pizza. Chef apron, cap and a drink for every child.',
    perHead: workshop.pricePerChild,
    unit: 'children',
    unitNote: `Ages ${workshop.minAge} to ${workshop.maxAge}`,
    min: 6,
    max: 30,
    start: 12,
    branches: ['havelock', 'ogf'],
    image: '/images/menu/margherita-pizza-7inch.jpg',
  },
  {
    id: 'office',
    label: 'Office lunch',
    title: 'Office lunch',
    blurb: 'Pasta, pizza and drinks for the team, at a branch or brought to your office.',
    perHead: 2400,
    unit: 'people',
    unitNote: 'Lunch for the whole team',
    min: 10,
    max: 200,
    start: 20,
    branches: branches.map((b) => b.id),
    image: '/images/promo/double-penne.jpg',
  },
  {
    id: 'catering',
    label: 'Catering',
    title: 'Event catering',
    blurb: 'A live pasta station and party trays for birthdays, weddings and celebrations.',
    perHead: 2200,
    unit: 'guests',
    unitNote: 'At your venue',
    min: 20,
    max: 300,
    start: 40,
    branches: branches.map((b) => b.id),
    image: '/images/promo/solo-spaghetti.jpg',
  },
]

export const getPartyType = (id) => partyTypes.find((t) => t.id === id) ?? partyTypes[0]

export const memberQr = (id) => `PASTAMANIA:MEMBER:${id}`
export const voucherQr = (code) => `PASTAMANIA:VOUCHER:${code}`

export const rupees = (n) => `Rs. ${Math.round(n).toLocaleString('en-US')}`

// 'Rs. 1.72M', 'Rs. 211K', 'Rs. 950'
export const shortRupees = (n) => {
  if (n >= 1e6) return `Rs. ${(n / 1e6).toFixed(2).replace(/\.?0+$/, '')}M`
  if (n >= 1e3) return `Rs. ${Math.round(n / 1e3)}K`
  return rupees(n)
}

const hourLabel = (h) => (h === 12 ? '12 pm' : h > 12 ? `${h - 12} pm` : `${h} am`)
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
// 'Mon to Thu, 3 to 6 pm'
export const quietLabel = () => {
  const { days, from, to } = levers.quiet
  return `${DAY_NAMES[days[0]]} to ${DAY_NAMES[days[days.length - 1]]}, ${hourLabel(from).replace(' pm', '')} to ${hourLabel(to)}`
}

export const inQuietHours = (date = new Date()) => {
  const { days, from, to } = levers.quiet
  return days.includes(date.getDay()) && date.getHours() >= from && date.getHours() < to
}

// The end of today's quiet hours, as a time.
export const quietEnds = (date = new Date()) => {
  const end = new Date(date)
  end.setHours(levers.quiet.to, 0, 0, 0)
  return end.getTime()
}

// '6:00 pm'
export const clock = (ms) => new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()

const endOfDay = (iso) => new Date(`${iso}T23:59:59`).getTime()
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// '24 Nov'
export const dayMonth = (ms) => `${new Date(ms).getDate()} ${MONTHS[new Date(ms).getMonth()]}`

export const goalLive = (switches, now = Date.now()) => switches.goal && now <= endOfDay(levers.goal.ends)
export const goalEndsLabel = () => dayMonth(endOfDay(levers.goal.ends))

// This week's deals for everyone (personal treats come from the store).
export const weekDeals = (switches, now = new Date()) => {
  const deals = []
  if (goalLive(switches, now.getTime())) {
    deals.push({
      id: 'bill-goal',
      kind: 'goal',
      title: `${rupees(levers.goal.off)} off your bill`,
      sub: `When you spend ${rupees(levers.goal.spend)} or more`,
      where: 'All branches',
      when: `Until ${goalEndsLabel()}`,
    })
  }
  const friday = nextFriday(now)
  deals.push({
    id: 'fridaymania',
    kind: 'friday',
    title: 'FridayMania: buy 1, get 1',
    sub: fridayMania.heroDish,
    image: fridayMania.image,
    where: 'Every Friday',
    today: now.getDay() === 5,
    when: now.getDay() === 5 ? 'On today' : `Next: Fri ${dayMonth(friday)}`,
  })
  return deals
}
