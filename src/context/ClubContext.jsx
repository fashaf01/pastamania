import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { club, pointsForSpend } from '../data/club.js'

// Member, points, vouchers and bookings for the prototype, kept on this device (localStorage) and
// kept in sync across open tabs. The action names mirror the API a real backend would expose, so this
// file is the one place to swap for server calls later.

const STORAGE_KEY = 'pm.club.v2'

const EMPTY = { member: null, balance: 0, activity: [], vouchers: [], bookings: [] }

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

const UNDO_WINDOW = 30 * 60 * 1000

const addActivity = (s, entry) => ({
  ...s,
  activity: [{ id: randomCode(8), at: Date.now(), ...entry }, ...s.activity],
})

// Member numbers are shown as PM 1234 5678; accept them typed with or without spaces.
const normaliseCode = (value) => value.replace(/\s/g, '').toUpperCase()
const normalisePhone = (value) => value.replace(/[\s-]/g, '').replace(/^\+94/, '0')

export const voucherStatus = (v, now = Date.now()) => (v.usedAt ? 'used' : v.expiresAt <= now ? 'expired' : 'ready')

const ClubContext = createContext(null)

export const useClub = () => useContext(ClubContext)

export function ClubProvider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => save(state), [state])

  // Another tab changed the data: pick it up immediately instead of waiting for a refresh.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setState(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const join = useCallback(({ name, phone, birthday }) => {
    setState((s) =>
      addActivity(
        {
          ...s,
          member: { id: `PM${randomDigits(8)}`, name, phone, birthday, joinedAt: Date.now() },
          balance: s.balance + club.welcomeBonus,
        },
        { type: 'bonus', points: club.welcomeBonus, label: 'Welcome gift' },
      ),
    )
  }, [])

  // --- Counter actions (the staff screen). A backend would run these after checking the staff login.

  // Finds the member by card number or mobile. On this prototype only members saved on this device exist.
  const findMember = useCallback(
    (query) => {
      const m = state.member
      if (!m || !query) return null
      return normaliseCode(query) === m.id || normalisePhone(query) === m.phone ? m : null
    },
    [state.member],
  )

  // Points for a bill at the counter. Returns the award so it can be undone.
  const recordPurchase = useCallback((amount, label = 'Visit') => {
    const award = { id: randomCode(8), at: Date.now(), type: 'earn', points: pointsForSpend(amount), label, amount }
    setState((s) => ({ ...s, balance: s.balance + award.points, activity: [award, ...s.activity] }))
    return award
  }, [])

  // Takes a mistyped award back: within 30 minutes, once, and only if the points haven't been spent.
  const undoAward = useCallback(
    (awardId) => {
      const award = state.activity.find((a) => a.id === awardId && a.type === 'earn')
      if (!award || award.undone) return { error: 'That award can’t be undone.' }
      if (Date.now() - award.at > UNDO_WINDOW) return { error: 'Too late to undo – awards can be undone for 30 minutes.' }
      if (state.balance < award.points) return { error: 'Those points have already been spent.' }
      setState((s) =>
        addActivity(
          {
            ...s,
            balance: s.balance - award.points,
            activity: s.activity.map((a) => (a.id === awardId ? { ...a, undone: true } : a)),
          },
          { type: 'adjust', points: -award.points, label: 'Correction at the counter' },
        ),
      )
      return { ok: true }
    },
    [state.activity, state.balance],
  )

  // Marks a voucher as used when the counter hands over the free item.
  const markVoucherUsed = useCallback(
    (code) => {
      const voucher = state.vouchers.find((v) => v.code === normaliseCode(code))
      if (!voucher) return { error: 'No voucher with that code.' }
      const status = voucherStatus(voucher)
      if (status === 'used') return { error: 'This voucher has already been used.' }
      if (status === 'expired') return { error: 'This voucher has expired.' }
      setState((s) => ({
        ...s,
        vouchers: s.vouchers.map((v) => (v.code === voucher.code ? { ...v, usedAt: Date.now() } : v)),
      }))
      return { ok: true, voucher }
    },
    [state.vouchers],
  )

  const redeem = useCallback(
    (reward) => {
      if (state.balance < reward.points) return null
      const now = Date.now()
      const voucher = {
        id: randomCode(8),
        code: `PMV-${randomCode(6)}`,
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
    () => ({ ...state, join, findMember, recordPurchase, undoAward, markVoucherUsed, redeem, book, cancelBooking, signOut }),
    [state, join, findMember, recordPurchase, undoAward, markVoucherUsed, redeem, book, cancelBooking, signOut],
  )

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>
}
