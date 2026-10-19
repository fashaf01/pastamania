import { formatDay } from '../lib/format.js'

// Dough Workz kids pizza-making workshops.
// Format and price come from the 30 Sep 2026 registration post (P12).
// SAMPLE SESSIONS: the dates below are placeholders following the Oct pattern
// (One Galle Face 1:00 PM, Havelock 5:00 PM). Replace with the real schedule.

export const workshop = {
  title: 'Dough Workz',
  subtitle: 'Kids pizza-making workshop',
  pricePerChild: 3000,
  minAge: 4,
  maxAge: 12,
  maxChildrenPerBooking: 4,
  includes: ['Chef apron & cap', 'Make & bake their own pizza', 'A drink'],
  image: '/images/menu/margherita-pizza-7inch.jpg',
}

export const sessions = [
  { id: '2026-11-07-ogf', date: '2026-11-07', time: '13:00', branchId: 'ogf', capacity: 16 },
  { id: '2026-11-07-havelock', date: '2026-11-07', time: '17:00', branchId: 'havelock', capacity: 16 },
  { id: '2026-11-21-ogf', date: '2026-11-21', time: '13:00', branchId: 'ogf', capacity: 16 },
  { id: '2026-11-21-havelock', date: '2026-11-21', time: '17:00', branchId: 'havelock', capacity: 16 },
  { id: '2026-12-12-ogf', date: '2026-12-12', time: '13:00', branchId: 'ogf', capacity: 16, label: 'Christmas special' },
  { id: '2026-12-12-havelock', date: '2026-12-12', time: '17:00', branchId: 'havelock', capacity: 16, label: 'Christmas special' },
]

export const getSession = (id) => sessions.find((s) => s.id === id)

// Seats remaining after the bookings we know about.
export const seatsLeft = (session, bookings) =>
  session.capacity -
  bookings
    .filter((b) => b.sessionId === session.id && b.status !== 'cancelled')
    .reduce((sum, b) => sum + b.children.length, 0)

const localDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Sessions from today onwards.
export const upcomingSessions = (today = new Date()) => sessions.filter((s) => s.date >= localDate(today))

export const formatSessionDate = (s) => formatDay(new Date(`${s.date}T${s.time}`))

export const formatSessionTime = (s) =>
  new Date(`${s.date}T${s.time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
