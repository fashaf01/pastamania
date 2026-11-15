import { useEffect, useState } from 'react'
import { CheckIcon } from '../../components/Icons.jsx'
import QrScanner from '../../components/QrScanner.jsx'
import { useClub, voucherStatus } from '../../context/ClubContext.jsx'
import { branches, getBranch } from '../../data/branches.js'
import { pointsForSpend } from '../../data/club.js'
import { menus } from '../../data/menu.js'
import { formatMemberCode, formatPoints } from '../../lib/format.js'
import { useNow } from '../../lib/useNow.js'
import { dayMonth, goalLive, levers, rupees } from '../config.js'
import { passLeft, useV2 } from '../store.jsx'
import { PassIcon, ScanIcon, TrendIcon } from '../ui.jsx'

const MEMBER_QR = /^PASTAMANIA:MEMBER:(PM\d{8})$/
const VOUCHER_QR = /^PASTAMANIA:VOUCHER:(PMV-[A-Z0-9]{6})$/
const BRANCH_KEY = 'pm.v2.counter-branch'

const loadBranch = () => {
  try {
    return getBranch(localStorage.getItem(BRANCH_KEY))?.id ?? 'havelock'
  } catch {
    return 'havelock'
  }
}

// A side that tips the bill over the goal: the cheapest starter or drink that covers what's missing.
const tipOver = (branchId, short) =>
  [...(menus[branchId] ?? [])]
    .filter((i) => ['Appetizers', 'Beverages', 'Salads'].includes(i.category) && i.price >= short)
    .sort((a, b) => a.price - b.price)[0] ?? null

// The counter for the new app: find the guest → use their pass, treat or rewards → enter the bill → give points.
// The double points, the come-back treat and the bigger-bill goal are worked out here, so staff don't have to.
export default function Counter() {
  const club = useClub()
  const v2 = useV2()
  const now = useNow(30000)
  const [branchId, setBranchId] = useState(loadBranch)
  const [scanning, setScanning] = useState(false)
  const [query, setQuery] = useState('')
  const [customer, setCustomer] = useState(null)
  const [amount, setAmount] = useState('')
  const [used, setUsed] = useState({ pass: false, treat: false, vouchers: 0 })
  const [selling, setSelling] = useState(false)
  const [message, setMessage] = useState(null)
  const [done, setDone] = useState(null)

  const flash = (text, tone = 'ok') => setMessage({ text, tone })
  const branch = getBranch(branchId)

  const memberId = club.member?.id
  useEffect(() => {
    if (customer && customer.id !== memberId) {
      setCustomer(null)
      setMessage({ text: 'That guest is no longer on this device. Find them again.', tone: 'error' })
    }
  }, [customer, memberId])

  const chooseBranch = (id) => {
    setBranchId(id)
    try {
      localStorage.setItem(BRANCH_KEY, id)
    } catch {
      // storage unavailable
    }
  }

  const reset = () => {
    setCustomer(null)
    setAmount('')
    setUsed({ pass: false, treat: false, vouchers: 0 })
    setSelling(false)
    setDone(null)
    setMessage(null)
    setQuery('')
  }

  const find = (value) => {
    const member = club.findMember(value)
    if (!member) return flash('No member with that number on this device. In this prototype a member lives on their own phone (or another tab).', 'error')
    reset()
    setCustomer(member)
  }

  const onScan = (text) => {
    setScanning(false)
    const m = text.match(MEMBER_QR)
    const v = text.match(VOUCHER_QR)
    if (m) return find(m[1])
    if (v && club.member && club.vouchers.some((x) => x.code === v[1])) {
      find(club.member.id)
      const r = club.markVoucherUsed(club.member.id, v[1])
      return r.error ? flash(r.error, 'error') : flash(`Used: free ${r.voucher.name}. Hand it over!`)
    }
    flash('That isn’t a PastaMania code. Ask them to open My code.', 'error')
  }

  // --- The visit
  const pass = customer ? v2.passFor(customer.id) : null
  const treats = customer ? v2.treatsFor(customer.id) : []
  const vouchers = customer ? club.vouchers.filter((x) => voucherStatus(x) === 'ready') : []
  const total = Math.floor(Number(amount.replace(/[^\d]/g, ''))) || 0
  const goalOn = goalLive(v2.switches, now.getTime())
  const goalApplies = goalOn && total >= levers.goal.spend
  const short = goalOn ? Math.max(0, levers.goal.spend - total) : 0
  const paid = goalApplies ? total - levers.goal.off : total
  const base = pointsForSpend(paid)
  const boost = v2.boostAt(branchId, now.getTime())
  const bonus = boost ? base * (levers.quiet.multiplier - 1) : 0
  const side = total > 0 && short > 0 ? tipOver(branchId, short) : null

  const takeLunch = () => {
    const r = v2.takePassLunch(customer.id)
    if (r.error) return flash(r.error, 'error')
    setUsed((u) => ({ ...u, pass: true }))
    flash(r.free ? 'That was their free lunch. Enjoy!' : `Lunch taken off. ${r.left} left on the pass.`)
  }

  const spendTreat = (t) => {
    v2.redeemTreat(t.id)
    setUsed((u) => ({ ...u, treat: true }))
    flash(`Used: free ${t.name}. Hand it over!`)
  }

  const spendVoucher = (x) => {
    const r = club.markVoucherUsed(customer.id, x.code)
    if (r.error) return flash(r.error, 'error')
    setUsed((u) => ({ ...u, vouchers: u.vouchers + 1 }))
    flash(`Used: free ${x.name}. Hand it over!`)
  }

  const sell = () => {
    const r = v2.sellPass(customer.id, branchId)
    setSelling(false)
    if (r.error) return flash(r.error, 'error')
    flash(`Pass sold for ${rupees(r.pass.price)}. ${r.pass.total} lunches are on their app.`)
  }

  const give = (e) => {
    e.preventDefault()
    if (!total) return flash('Enter the order total.', 'error')
    if (total > 100000) return flash('That total looks wrong (over Rs. 100,000). Enter it again.', 'error')
    const r = club.recordPurchase(customer.id, paid, 'Visit')
    if (r.error) return flash(r.error, 'error')
    if (bonus) club.addBonus(customer.id, bonus, boost.kind === 'flash' ? 'Double points (Fill it now)' : 'Double points (quiet hours)')
    const { treat } = v2.recordVisit({
      memberId: customer.id,
      branchId,
      total,
      paid,
      points: base,
      bonus,
      boost: boost?.kind ?? null,
      goal: goalApplies,
      passUsed: used.pass,
      treatUsed: used.treat,
      vouchersUsed: used.vouchers,
    })
    setMessage(null)
    setDone({ points: base + bonus, treat, paid })
  }

  return (
    <>
      <header className="v2-head sm" style={{ justifyContent: 'space-between' }}>
        <div className="v2-grow" style={{ gap: 2 }}>
          <label className="v2-eyebrow" style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 4, minHeight: 24 }}>
            {branch.name} ▾
            <select value={branchId} onChange={(e) => chooseBranch(e.target.value)} aria-label="Counter branch" style={{ position: 'absolute', inset: 0, opacity: 0, fontSize: 16 }}>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </label>
          <h1 className="v2-cd" style={{ fontSize: 34, lineHeight: '32px' }}>Counter</h1>
        </div>
        <button type="button" className="v2-btn v2-btn-gold v2-btn-sm" onClick={() => { reset(); setScanning(true) }}>
          <ScanIcon width={18} height={18} />
          {customer ? 'Scan next' : 'Scan'}
        </button>
      </header>

      <main className="v2-main" style={{ gap: 12 }}>
        {boost && (
          <p className="v2-note" style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
            <span>Double points on now{boost.kind === 'flash' ? ' (Fill it now)' : ''}</span>
            <span className="v2-tag wine">x{levers.quiet.multiplier}</span>
          </p>
        )}
        {message && <p className={message.tone === 'error' ? 'v2-error' : 'v2-note'} role="status">{message.text}</p>}

        {scanning && (
          <section className="v2-card v2-pad">
            <QrScanner onResult={onScan} onClose={() => setScanning(false)} />
          </section>
        )}

        {!customer && !scanning && (
          <form className="v2-card v2-pad v2-stack-lg" onSubmit={(e) => { e.preventDefault(); find(query) }}>
            <h2 className="v2-cd v2-section">Find the guest</h2>
            <p className="v2-small v2-muted">Scan their code, or type their member number or mobile.</p>
            <label className="v2-field">
              <span>Member number or mobile</span>
              <input className="v2-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="PM 1234 5678 or 077 123 4567" autoComplete="off" />
            </label>
            <div className="v2-grid2">
              <button type="button" className="v2-btn v2-btn-line" onClick={() => setScanning(true)}><ScanIcon width={18} height={18} /> Scan</button>
              <button type="submit" className="v2-btn v2-btn-red">Find</button>
            </div>
          </form>
        )}

        {customer && done && (
          <section className="v2-stack-lg">
            <div className="v2-code">
              <span className="v2-eyebrow">Done · {customer.name}</span>
              <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="v2-slab" style={{ fontSize: 56, color: 'var(--gold)' }}>+{formatPoints(done.points)}</span>
                <span className="v2-cd" style={{ fontSize: 28, lineHeight: '28px' }}>points</span>
              </span>
              <span className="v2-small">They paid {rupees(done.paid)}. Their phone shows a thank-you and a rating.</span>
            </div>
            {done.treat && (
              <p className="v2-note">Come-back treat sent: free {done.treat.name} on their next visit, by {dayMonth(done.treat.expiresAt)}.</p>
            )}
            <button type="button" className="v2-btn v2-btn-red v2-btn-lg v2-btn-block" onClick={reset}>Next customer</button>
          </section>
        )}

        {customer && !done && (
          <>
            <section className="v2-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px' }}>
              <span className="v2-avatar" aria-hidden="true">{customer.name.trim()[0]?.toUpperCase()}</span>
              <div className="v2-grow">
                <h2 className="v2-body v2-strong" style={{ fontSize: 16 }}>{customer.name}</h2>
                <span className="v2-small v2-muted">{formatMemberCode(customer.id)} · {formatPoints(club.balance)} points</span>
              </div>
              <span className="v2-tag" style={{ alignSelf: 'center', display: 'flex', gap: 4, alignItems: 'center' }}><CheckIcon width={14} height={14} strokeWidth={3} /> Found</span>
            </section>

            <section className="v2-stack">
              <h2 className="v2-cd" style={{ fontSize: 26, lineHeight: '26px', color: 'var(--red)' }}>Use on this visit</h2>
              <div className="v2-list">
                {pass && (
                  <div className="v2-list-item">
                    <div className="v2-grow">
                      <span className="v2-body v2-strong">Pasta Pass</span>
                      <span className="v2-small v2-muted">{passLeft(pass)} {passLeft(pass) === 1 ? 'lunch' : 'lunches'} left{pass.used + 1 > levers.pass.paid ? ' · next one is free' : ''}</span>
                    </div>
                    {used.pass ? <span className="v2-tag gold" style={{ alignSelf: 'center' }}>Used</span> : <button type="button" className="v2-btn v2-btn-line v2-btn-sm" onClick={takeLunch}>Use 1 lunch</button>}
                  </div>
                )}
                {treats.map((t) => (
                  <div key={t.id} className="v2-list-item">
                    <div className="v2-grow">
                      <span className="v2-body v2-strong">Come-back treat</span>
                      <span className="v2-small v2-muted">Free {t.name} · by {dayMonth(t.expiresAt)}</span>
                    </div>
                    <button type="button" className="v2-btn v2-btn-line v2-btn-sm" onClick={() => spendTreat(t)}>Mark used</button>
                  </div>
                ))}
                {vouchers.map((x) => (
                  <div key={x.id} className="v2-list-item">
                    <div className="v2-grow">
                      <span className="v2-body v2-strong">Reward</span>
                      <span className="v2-small v2-muted">Free {x.name} · by {dayMonth(x.expiresAt)}</span>
                    </div>
                    <button type="button" className="v2-btn v2-btn-line v2-btn-sm" onClick={() => spendVoucher(x)}>Mark used</button>
                  </div>
                ))}
                {goalOn && (
                  <div className="v2-list-item">
                    <div className="v2-grow">
                      <span className="v2-body v2-strong">{rupees(levers.goal.off)} off</span>
                      <span className="v2-small v2-muted">Needs a bill of {rupees(levers.goal.spend)}</span>
                    </div>
                    <span className={`v2-tag ${goalApplies ? 'gold' : ''}`} style={{ alignSelf: 'center', padding: '6px 12px', borderRadius: 16 }}>
                      {goalApplies ? 'Applies' : total ? `${rupees(short)} short` : 'Enter the bill'}
                    </span>
                  </div>
                )}
                {!pass && treats.length === 0 && vouchers.length === 0 && !goalOn && (
                  <p className="v2-list-item v2-small v2-muted">Nothing to use today.</p>
                )}
              </div>
            </section>

            <form className="v2-card v2-pad v2-stack" style={{ gap: 10 }} onSubmit={give}>
              <label className="v2-field">
                <span className="v2-eyebrow" style={{ color: 'var(--gold-ink)' }}>Order total</span>
                <span className="v2-bill">
                  <span>Rs.</span>
                  <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" aria-label="Order total in rupees" />
                </span>
              </label>
              {goalOn && total > 0 && !goalApplies && (
                <div className="v2-hint">
                  <span className="v2-hint-icon"><TrendIcon width={18} height={18} strokeWidth={2.2} /></span>
                  <div className="v2-grow">
                    <span className="v2-body" style={{ fontWeight: 800 }}>{rupees(short)} more gets {rupees(levers.goal.off)} off</span>
                    {side && <span className="v2-small v2-muted">Offer {side.name}, {rupees(side.price)}</span>}
                  </div>
                </div>
              )}
              {goalApplies && (
                <div className="v2-hint">
                  <span className="v2-hint-icon"><CheckIcon width={18} height={18} strokeWidth={2.6} /></span>
                  <div className="v2-grow">
                    <span className="v2-body" style={{ fontWeight: 800 }}>Take {rupees(levers.goal.off)} off: they pay {rupees(paid)}</span>
                    <span className="v2-small v2-muted">The bigger-bill goal is reached</span>
                  </div>
                </div>
              )}
              <div className="v2-split">
                <span className="v2-body v2-muted">Points for this bill</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {bonus > 0 && <span className="v2-tag wine">Double points</span>}
                  <span className="v2-slab" style={{ fontSize: 24, lineHeight: '26px', color: 'var(--red)' }}>{formatPoints(base + bonus)}</span>
                </span>
              </div>
              <button type="submit" className="v2-btn v2-btn-red v2-btn-lg v2-btn-block" disabled={!total}>
                Give {formatPoints(base + bonus)} points
              </button>
            </form>

            {v2.switches.pass &&
              (selling ? (
                <section className="v2-card v2-pad v2-stack">
                  <p className="v2-body">Take <strong>{rupees(levers.pass.price)}</strong> and put {levers.pass.paid + levers.pass.free} lunches on {customer.name.split(' ')[0]}’s app?</p>
                  <div className="v2-grid2">
                    <button type="button" className="v2-btn v2-btn-line" onClick={() => setSelling(false)}>Cancel</button>
                    <button type="button" className="v2-btn v2-btn-red" onClick={sell}>Sold</button>
                  </div>
                </section>
              ) : (
                <button type="button" className="v2-btn v2-btn-line v2-btn-block" onClick={() => setSelling(true)}>
                  <PassIcon width={18} height={18} /> Sell a Pasta Pass · {rupees(levers.pass.price)}
                </button>
              ))}
          </>
        )}
      </main>
    </>
  )
}
