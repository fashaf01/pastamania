import { useState } from 'react'
import { CallIcon, CheckIcon, MenuIcon, MinusIcon, PlusIcon } from '../../components/Icons.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { branches, getBranch } from '../../data/branches.js'
import { brand } from '../../data/brand.js'
import { formatDay, formatPhone } from '../../lib/format.js'
import { getPartyType, partyTypes, rupees } from '../config.js'
import { useV2 } from '../store.jsx'
import { BriefcaseIcon, CakeIcon, SubHead, useBranch } from '../ui.jsx'

const ICONS = { kids: CakeIcon, office: BriefcaseIcon, catering: MenuIcon }

const isoDay = (offset) => {
  const d = new Date(Date.now() + offset * 86400000)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Accepts 0771234567, 077 123 4567, +94 77 123 4567 … and returns 0771234567, or null.
const normalisePhone = (value) => {
  const digits = value.replace(/[\s-]/g, '').replace(/^\+94/, '0').replace(/^(7\d{8})$/, '0$1')
  return /^0\d{9}$/.test(digits) ? digits : null
}

// Parties, office lunches and catering: the biggest bills. Pick a date and a head count, see a price, send it.
export default function Celebrate() {
  const club = useClub()
  const v2 = useV2()
  const [home] = useBranch()
  const [typeId, setTypeId] = useState('kids')
  const type = getPartyType(typeId)
  const [count, setCount] = useState(type.start)
  const [date, setDate] = useState(isoDay(14))
  const [branchId, setBranchId] = useState(home.id)
  const [name, setName] = useState(club.member?.name ?? '')
  const [phone, setPhone] = useState(club.member?.phone ?? '')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(null)

  const allowed = branches.filter((b) => type.branches.includes(b.id))
  const branch = allowed.find((b) => b.id === branchId) ?? allowed[0]
  const estimate = count * type.perHead
  const contact = typeId === 'kids' ? brand.workshopPhone : brand.cateringPhone

  const pick = (id) => {
    const next = getPartyType(id)
    setTypeId(id)
    setCount(next.start)
    setError(null)
  }

  const submit = (e) => {
    e.preventDefault()
    const tel = normalisePhone(phone)
    if (!name.trim()) return setError('Add your name so we know who to call.')
    if (!tel) return setError('Add a mobile number we can call, like 077 123 4567.')
    if (!date || date < isoDay(1)) return setError('Pick a date from tomorrow onwards.')
    const request = v2.sendRequest({
      memberId: club.member?.id ?? null,
      type: type.id,
      title: type.title,
      date,
      branchId: branch.id,
      count,
      estimate,
      name: name.trim(),
      phone: tel,
      notes: notes.trim(),
    })
    setSent(request)
  }

  if (!v2.switches.parties) {
    return (
      <>
        <SubHead title="Celebrate with us" back="/v2/me" />
        <main className="v2-main">
          <p className="v2-note">Party bookings are paused. Call us on {formatPhone(brand.cateringPhone)}.</p>
        </main>
      </>
    )
  }

  if (sent) {
    return (
      <>
        <SubHead title="Request sent" back="/v2/me" />
        <main className="v2-main" style={{ gap: 14 }}>
          <section className="v2-ticket col" style={{ padding: 20 }}>
            <span className="v2-eyebrow">Request {sent.id}</span>
            <h2 className="v2-cd" style={{ fontSize: 32, lineHeight: '30px', marginTop: 6 }}>{sent.title}</h2>
            <span className="v2-body v2-strong" style={{ marginTop: 6 }}>
              {formatDay(`${sent.date}T12:00`)} · {sent.count} {getPartyType(sent.type).unit} · {getBranch(sent.branchId)?.shortName}
            </span>
            <div className="v2-perf" style={{ margin: '0 -20px' }} aria-hidden="true"><span /></div>
            <div className="v2-split">
              <span className="v2-eyebrow">Estimate</span>
              <span className="v2-cd v2-nums" style={{ fontSize: 30, lineHeight: '30px', textTransform: 'none' }}>{rupees(sent.estimate)}</span>
            </div>
          </section>
          <p className="v2-body" style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span className="v2-avatar" style={{ width: 24, height: 24, background: 'var(--wine)', color: 'var(--gold)' }}><CheckIcon width={14} height={14} strokeWidth={3} /></span>
            PastaMania will call you on {sent.phone} to confirm the menu and the final price.
          </p>
          <a href={`tel:${contact}`} className="v2-btn v2-btn-line v2-btn-block">
            <CallIcon width={18} height={18} /> Call now · {formatPhone(contact)}
          </a>
          <button type="button" className="v2-btn v2-btn-ghost" onClick={() => setSent(null)}>Plan another one</button>
        </main>
      </>
    )
  }

  return (
    <>
      <SubHead title="Celebrate with us" back="/v2/me" />
      <main className="v2-main" style={{ gap: 14 }}>
        <div className="v2-kinds" role="group" aria-label="What are you planning?">
          {partyTypes.map((t) => {
            const Icon = ICONS[t.id]
            return (
              <button key={t.id} type="button" className="v2-kind" aria-pressed={t.id === typeId} onClick={() => pick(t.id)}>
                <Icon width={24} height={24} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>

        <section className="v2-banner">
          <img src={type.image} alt="" />
          <div className="v2-stack" style={{ gap: 4, padding: '12px 16px 14px' }}>
            <h2 className="v2-cd" style={{ fontSize: 25, lineHeight: '24px', color: 'var(--red)' }}>{type.title}</h2>
            <p className="v2-small v2-muted">{type.blurb}</p>
          </div>
        </section>

        <form className="v2-card v2-pad v2-stack-lg" onSubmit={submit} noValidate>
          <div className="v2-grid2">
            <label className="v2-field">
              <span>Date</span>
              <input className="v2-input" type="date" min={isoDay(1)} value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            <label className="v2-field">
              <span>Branch</span>
              <select className="v2-input" value={branch.id} onChange={(e) => setBranchId(e.target.value)}>
                {allowed.map((b) => <option key={b.id} value={b.id}>{b.shortName}</option>)}
              </select>
            </label>
          </div>

          <div className="v2-split">
            <div className="v2-grow">
              <span className="v2-body v2-strong" style={{ textTransform: 'capitalize' }}>{type.unit}</span>
              <span className="v2-small v2-muted">{type.unitNote}</span>
            </div>
            <div className="v2-stepper">
              <button type="button" className="v2-step" onClick={() => setCount((c) => Math.max(type.min, c - (c > 40 ? 5 : 1)))} aria-label={`Fewer ${type.unit}`}>
                <MinusIcon width={20} height={20} strokeWidth={2.4} />
              </button>
              <span className="v2-cd v2-step-num v2-nums" aria-live="polite">{count}</span>
              <button type="button" className="v2-step" onClick={() => setCount((c) => Math.min(type.max, c + (c >= 40 ? 5 : 1)))} aria-label={`More ${type.unit}`}>
                <PlusIcon width={20} height={20} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <div className="v2-estimate">
            <div className="v2-split">
              <div className="v2-grow" style={{ gap: 2 }}>
                <span className="v2-eyebrow">Estimate</span>
                <span className="v2-small">{count} {type.unit} × {rupees(type.perHead)}</span>
              </div>
              <span className="v2-cd v2-estimate-num v2-nums" style={{ textTransform: 'none' }}>{rupees(estimate)}</span>
            </div>
            <span className="v2-small v2-muted">PastaMania confirms the final price when they call you.</span>
          </div>

          <div className="v2-grid2">
            <label className="v2-field">
              <span>Your name</span>
              <input className="v2-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
            </label>
            <label className="v2-field">
              <span>Mobile</span>
              <input className="v2-input" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="077 123 4567" />
            </label>
          </div>
          <label className="v2-field">
            <span>Anything else? (optional)</span>
            <textarea className="v2-input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Theme, allergies, a cake…" style={{ minHeight: 64 }} />
          </label>

          {error && <p className="v2-error" role="alert">{error}</p>}
          <button type="submit" className="v2-btn v2-btn-red v2-btn-lg v2-btn-block">Send request</button>
        </form>

        <a href={`tel:${contact}`} className="v2-btn v2-btn-ghost">
          <CallIcon width={18} height={18} /> Or call {formatPhone(contact)}
        </a>
      </main>
    </>
  )
}
