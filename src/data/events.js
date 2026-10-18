import { brand } from './brand.js'

export const events = [
  {
    id: 'christmas',
    title: 'Christmas Menu 2026',
    tag: 'Coming soon',
    icon: '🎄',
    description:
      'Our chefs went head-to-head in a kitchen competition, and the winning creation is joining our festive menu. ' +
      'The dish will be revealed soon.',
    details: [],
    cta: { label: 'Follow for the reveal', href: brand.socials.instagram },
    sources: ['P02'],
  },
  {
    id: 'dough-workz',
    title: 'Dough Workz',
    tag: 'Kids workshop',
    icon: '👩‍🍳',
    description:
      'A hands-on pizza-making workshop for kids. Little chefs get their own apron and cap, make their own pizza ' +
      'and enjoy it with a drink.',
    details: ['Ages 4 – 12', 'Apron, cap, pizza & drink included', 'Limited slots', 'Havelock City Mall & One Galle Face'],
    cta: { label: 'Call to book the next session', href: `tel:${brand.workshopPhone}` },
    sources: ['P04', 'P05', 'P07', 'P12'],
  },
  {
    id: 'catering',
    title: 'Event Catering & Live Pasta',
    tag: 'For your event',
    icon: '🎉',
    description:
      'Bring PastaMania to your birthday, office party or celebration – food, service and a live pasta station.',
    details: ['Birthdays & family events', 'Corporate gatherings', 'Live pasta station'],
    cta: { label: 'Send an enquiry', href: '#enquiry' },
    sources: ['P16'],
  },
]
