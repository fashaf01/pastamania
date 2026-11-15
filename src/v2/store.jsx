import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { levers, LEVERS, inQuietHours, quietEnds } from './config.js'

// Everything the new app adds on top of the Club (points and vouchers stay in ClubContext): come-back treats,
// Pasta Passes, visits and their ratings, party requests, the manager's switches and the "Fill it now" deal.
// Kept on this device and in step across open tabs, like ClubContext. A backend replaces this file later.

const STORAGE_KEY = 'pm.v2.v1'
const DAY = 24 * 60 * 60 * 1000

const EMPTY = {
  switches: Object.fromEntries(LEVERS.map((k) => [k, true])),
  flash: null,
  treats: [],
  passes: [],
  visits: [],
  requests: [],
}

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY
    const saved = JSON.parse(raw)
    return { ...EMPTY, ...saved, switches: { ...EMPTY.switches, ...saved.switches } }
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

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const id = (length = 8) => Array.from(crypto.getRandomValues(new Uint8Array(length)), (b) => CHARS[b % CHARS.length]).join('')

export const passLeft = (p) => p.total - p.used
export const treatReady = (t, now = Date.now()) => !t.usedAt && t.expiresAt > now

const V2Context = createContext(null)

export const useV2 = () => useContext(V2Context)

export function V2Provider({ children }) {
  const [state, setState] = useState(load)

  useEffect(() => save(state), [state])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setState(load())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // --- Manager

  const setSwitch = useCallback((key, on) => setState((s) => ({ ...s, switches: { ...s.switches, [key]: on } })), [])

  const startFlash = useCallback((branchId) => {
    const flash = { branchId, startedAt: Date.now(), until: Date.now() + levers.quiet.flashHours * 60 * 60 * 1000 }
    setState((s) => ({ ...s, flash }))
    return flash
  }, [])

  const stopFlash = useCallback(() => setState((s) => ({ ...s, flash: null })), [])

  const setRequestStatus = useCallback(
    (requestId, status) => setState((s) => ({ ...s, requests: s.requests.map((r) => (r.id === requestId ? { ...r, status } : r)) })),
    [],
  )

  // --- Counter

  const sellPass = useCallback(
    (memberId, branchId) => {
      if (!state.switches.pass) return { error: 'The Pasta Pass is switched off on the manager page.' }
      if (state.passes.length >= levers.pass.limit) return { error: `All ${levers.pass.limit} passes are sold.` }
      const pass = { id: id(), memberId, branchId, soldAt: Date.now(), price: levers.pass.price, total: levers.pass.paid + levers.pass.free, used: 0 }
      setState((s) => ({ ...s, passes: [pass, ...s.passes] }))
      return { ok: true, pass }
    },
    [state.switches.pass, state.passes.length],
  )

  // Takes one lunch off the member's oldest pass that still has lunches.
  const takePassLunch = useCallback(
    (memberId) => {
      const pass = [...state.passes].reverse().find((p) => p.memberId === memberId && passLeft(p) > 0)
      if (!pass) return { error: 'No lunches left on a pass.' }
      setState((s) => ({ ...s, passes: s.passes.map((p) => (p.id === pass.id ? { ...p, used: p.used + 1 } : p)) }))
      return { ok: true, left: passLeft(pass) - 1, free: pass.used + 1 > levers.pass.paid }
    },
    [state.passes],
  )

  const redeemTreat = useCallback((treatId) => {
    setState((s) => ({ ...s, treats: s.treats.map((t) => (t.id === treatId ? { ...t, usedAt: Date.now() } : t)) }))
  }, [])

  // A visit at the counter. Sends the guest a come-back treat for their next visit when that's switched on.
  const recordVisit = useCallback(
    (details) => {
      const now = Date.now()
      const visit = { id: id(), at: now, seen: false, rating: null, note: '', ...details }
      const c = levers.comeBack
      const treat = state.switches.comeBack
        ? { id: id(), memberId: details.memberId, visitId: visit.id, name: c.item, image: c.image, issuedAt: now, expiresAt: now + c.days * DAY, usedAt: null }
        : null
      setState((s) => ({ ...s, visits: [visit, ...s.visits], treats: treat ? [treat, ...s.treats] : s.treats }))
      return { visit, treat }
    },
    [state.switches.comeBack],
  )

  // --- Guest

  const markVisitSeen = useCallback(
    (visitId) => setState((s) => ({ ...s, visits: s.visits.map((v) => (v.id === visitId ? { ...v, seen: true } : v)) })),
    [],
  )

  const rateVisit = useCallback(
    (visitId, rating, note = '') =>
      setState((s) => ({ ...s, visits: s.visits.map((v) => (v.id === visitId ? { ...v, rating, note, ratedAt: Date.now() } : v)) })),
    [],
  )

  const sendRequest = useCallback((details) => {
    const request = { id: `RQ-${id(5)}`, at: Date.now(), status: 'new', ...details }
    setState((s) => ({ ...s, requests: [request, ...s.requests] }))
    return request
  }, [])

  // --- Reads

  // Double points right now at this branch: the manager's "Fill it now" deal, or the weekly quiet hours.
  const boostAt = useCallback(
    (branchId, now = Date.now()) => {
      if (!state.switches.quiet) return null
      const f = state.flash
      if (f && f.until > now && (!branchId || f.branchId === branchId)) return { kind: 'flash', branchId: f.branchId, until: f.until }
      if (inQuietHours(new Date(now))) return { kind: 'quiet', until: quietEnds(new Date(now)) }
      return null
    },
    [state.switches.quiet, state.flash],
  )

  const treatsFor = useCallback(
    (memberId) => (state.switches.comeBack ? state.treats.filter((t) => t.memberId === memberId && treatReady(t)) : []),
    [state.treats, state.switches.comeBack],
  )

  const passFor = useCallback(
    (memberId) => [...state.passes].reverse().find((p) => p.memberId === memberId && passLeft(p) > 0) ?? null,
    [state.passes],
  )

  const value = useMemo(
    () => ({
      ...state,
      setSwitch,
      startFlash,
      stopFlash,
      setRequestStatus,
      sellPass,
      takePassLunch,
      redeemTreat,
      recordVisit,
      markVisitSeen,
      rateVisit,
      sendRequest,
      boostAt,
      treatsFor,
      passFor,
    }),
    [state, setSwitch, startFlash, stopFlash, setRequestStatus, sellPass, takePassLunch, redeemTreat, recordVisit, markVisitSeen, rateVisit, sendRequest, boostAt, treatsFor, passFor],
  )

  return <V2Context.Provider value={value}>{children}</V2Context.Provider>
}
