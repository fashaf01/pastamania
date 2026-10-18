// Offers shown in the app. Only items that are not known to be expired are listed.
// status: 'recurring' | 'listed' (platform/bank listing, terms may change)
export const fridayMania = {
  title: 'FridayMania',
  subtitle: 'Buy one, get one free – every Friday',
  description:
    'Each Friday one hero dish is buy-one-get-one-free for dine-in, takeaway, Uber Eats and PickMe Food. ' +
    'The dish changes every week, so follow us on Instagram for this Friday’s pick.',
  terms: 'Selected hero dish only. Cannot be combined with other offers.',
  image: '/images/promo/fridaymania-pizza.jpg',
  pastHeroes: [
    { name: 'Arrabiata with Chicken Rasher', image: '/images/menu/arrabiata-with-chicken-rasher-pasta.jpg' },
    { name: 'Tuscan Chicken Pizza', image: '/images/menu/tuscan-chicken-pizza.jpg' },
    { name: 'Jaffna Calamari', image: '/images/menu/jaffna-calamari-pasta.jpg' },
    { name: 'Hot Basil Chicken Pizza', image: '/images/menu/hot-basil-chicken-pizza.jpg' },
  ],
  sources: ['P13', 'P14', 'P17', 'P19', 'P20', 'P23', 'P24'],
}

export const offers = [
  {
    id: 'solo-spaghetti',
    title: 'Solo Spaghetti',
    price: 2890,
    image: '/images/promo/solo-spaghetti.jpg',
    includes: ['Chicken Bolognese', 'Potato Wedges', 'Soft drink'],
    where: 'Alfred House & One Galle Face · Uber Eats',
    status: 'listed',
    sources: ['M02', 'M03'],
  },
  {
    id: 'double-penne',
    title: 'Double Penne',
    price: 4290,
    image: '/images/promo/double-penne.jpg',
    includes: ['Creamy Chicken Pasta', '7-inch Tuscan Chicken Pizza', 'Two drinks'],
    where: 'Alfred House & One Galle Face · Uber Eats',
    status: 'listed',
    sources: ['M02', 'M03'],
  },
  {
    id: 'ntb-amex',
    title: 'NTB Amex Points Vouchers',
    price: null,
    includes: ['LKR 2,500 voucher for 12,500 points', 'LKR 5,000 voucher for 25,000 points'],
    where: 'In-store redemption · valid six months from issue',
    status: 'listed',
    link: 'https://www.americanexpress.lk/en/rewards/shop-with-your-points',
    sources: ['R01', 'R02'],
  },
]
