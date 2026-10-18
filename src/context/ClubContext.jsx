import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { club, getNextTier, getTier, pointsForSpend } from '../data/club.js'

// Member, points, vouchers and bookings for the prototype. Everything is kept on this device
// (localStorage). The action names mirror the API a real backend would expose, so this file is
// the one place to swap for server calls later.

const STORAGE_KEY = 'pm.club.v1'

const EMPTY = { member: null, balance: 0, lifetimePoints: 0, activity: [], vouchers: [], bookings: [] }

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

const save = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage unavailable – state lives for this session only
  }
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const randomCode = (length) => {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join('')
}
const randomDigits = (length) => Array.from(crypto.getRandomValues(new Uint8Array(length)), (b) => b % 10).join('')

const DAY = 24 * 60 * 60 * 1000

const addActivity = (s, entry) => ({
  ...s,
  activity: [{ id: randomCode(8), at: Date.now(), ...entry }, ...s.activity],
})

const ClubContext = createContext(null)

export const useClub = () => useContext(ClubContext)

export function ClubProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => save(state), [state])

  const join = useCallback(({ name, phone, email, birthday }) => {
    setState((s) =>
      addActivity(
        {
          ...s,
          member: { id: `PM${randomDigits(8)}`, name, phone, email, birthday, joinedAt: Date.now() },
          balance: s.balance + club.welcomeBonus,
          lifetimePoints: s.lifetimePoints + club.welcomeBonus,
        },
        { type: 'bonus', points: club.welcomeBonus, label: 'Welcome to the Club' },
      ),
    )
  }, [])

  const updateMember = useCallback((changes) => {
    setState((s) => ({ ...s, member: { ...s.member, ...changes } }))
  }, [])

  // Staff would record this by scanning the member card at the till.
  const recordPurchase = useCallback((amount, label) => {
    setState((s) => {
      const points = pointsForSpend(amount, getTier(s.lifetimePoints))
      return addActivity(
        { ...s, balance: s.balance + points, lifetimePoints: s.lifetimePoints + points },
        { type: 'earn', points, label, amount },
      )
    })
  }, [])

  const redeem = useCallback(
    (reward) => {
      if (state.balance < reward.points) return null
      const now = Date.now()
      const voucher = {
        id: randomCode(8),
        code: `PMV-${randomCode(6)}`,
        rewardId: reward.id,
        name: reward.name,
        image: reward.image,
        issuedAt: now,
        expiresAt: now + club.voucherValidDays * DAY,
      }
      setState((s) =>
        addActivity(
          { ...s, balance: s.balance - reward.points, vouchers: [voucher, ...s.vouchers] },
          { type: 'redeem', points: -reward.points, label: reward.name },
        ),
      )
      return voucher
    },
    [state.balance],
  )

  const book = useCallback((details) => {
    const booking = { ref: `DW-${randomCode(5)}`, status: 'requested', createdAt: Date.now(), ...details }
    setState((s) => ({ ...s, bookings: [booking, ...s.bookings] }))
    return booking
  }, [])

  const cancelBooking = useCallback((ref) => {
    setState((s) => ({ ...s, bookings: s.bookings.map((b) => (b.ref === ref ? { ...b, status: 'cancelled' } : b)) }))
  }, [])

  const signOut = useCallback(() => setState(EMPTY), [])

  const value = useMemo(
    () => ({
      ...state,
      tier: getTier(state.lifetimePoints),
      nextTier: getNextTier(state.lifetimePoints),
      join,
      updateMember,
      recordPurchase,
      redeem,
      book,
      cancelBooking,
      signOut,
    }),
    [state, join, updateMember, recordPurchase, redeem, book, cancelBooking, signOut],
  )

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>
}
