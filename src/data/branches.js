// Branch registry. Restaurant (dine-in) hours are not yet confirmed by the branches,
// so delivery and directory hours are kept as separate, labelled observations.
export const branches = [
  {
    id: 'havelock',
    name: 'Havelock City Mall',
    shortName: 'Havelock',
    address: 'Level 1, Unit L01-01, Havelock City Mall, 324/10 Havelock Road, Colombo',
    phones: ['+94112087087'], // U01 – supplied by client, to confirm
    uberEatsUrl: 'https://www.ubereats.com/lk/store/pastamania-havelock-city-mall/Y-WPqXo3VomXkuMt_d8nlQ', // M01
    hours: [
      {
        label: 'Delivery (Uber Eats)',
        rows: [
          { days: 'Mon – Thu', time: '10:00 – 22:00' },
          { days: 'Fri – Sun', time: '10:00 – 23:00' },
        ],
      },
    ],
    highlights: ['Dough Workz kids workshops', 'Mall dining'],
  },
  {
    id: 'alfred',
    name: 'Alfred House Gardens',
    shortName: 'Alfred House',
    address: '502 R. A. De Mel Mawatha, Colombo 00300',
    phones: ['+94112553618'], // B04, S01
    uberEatsUrl: 'https://www.ubereats.com/lk/store/pastamania/BTmKR8HaTHOCgzzjcSI2tw', // M03
    hours: [
      {
        label: 'Restaurant',
        rows: [
          { days: 'Mon – Thu', time: '11:00 – 21:30' },
          { days: 'Fri', time: '13:30 – 22:00' },
          { days: 'Sat – Sun', time: '12:00 – 22:00' },
        ],
      },
      {
        label: 'Delivery (Uber Eats)',
        rows: [
          { days: 'Sat – Thu', time: '12:00 – 22:00' },
          { days: 'Fri', time: '13:30 – 22:00' },
        ],
      },
    ],
    highlights: ['Flagship', 'Street-side dining'],
  },
  {
    id: 'ogf',
    name: 'One Galle Face',
    shortName: 'One Galle Face',
    address: 'No. 6, Level 5, One Galle Face Mall, Colombo 02',
    phones: ['+94744120647', '+94112422093'], // Q01, B04 – both listed, to confirm
    uberEatsUrl: 'https://www.ubereats.com/lk/store/pastamania-ogf/cbgIRKY5UjS9fg6yYB1xgg', // M02
    hours: [
      {
        label: 'Restaurant',
        rows: [{ days: 'Daily', time: '10:00 – 21:45' }],
      },
      {
        label: 'Delivery (Uber Eats)',
        rows: [
          { days: 'Sat – Thu', time: '12:00 – 22:00' },
          { days: 'Fri', time: '13:30 – 22:00' },
        ],
      },
    ],
    highlights: ['Dough Workz kids workshops', 'Ocean-front mall'],
  },
]

export const getBranch = (id) => branches.find((b) => b.id === id)

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Whether an hours row ('Daily', 'Fri', 'Mon – Thu', 'Sat – Thu' …) covers a weekday (0 = Sunday).
const coversDay = (label, day) => {
  if (label === 'Daily') return true
  const [from, to = from] = label.split('–').map((s) => DAYS.indexOf(s.trim()))
  if (from < 0 || to < 0) return false
  return from <= to ? day >= from && day <= to : day >= from || day <= to
}

// Today's restaurant hours ('12:00 – 22:00'), or null when the branch hasn't confirmed them.
export const todaysHours = (branch, date = new Date()) => {
  const restaurant = branch.hours.find((h) => h.label === 'Restaurant')
  return restaurant?.rows.find((r) => coversDay(r.days, date.getDay()))?.time ?? null
}

export const mapsUrl = (branch) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`PastaMania ${branch.address}`)}`
