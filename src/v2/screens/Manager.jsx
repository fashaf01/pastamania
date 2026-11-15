import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CallIcon } from '../../components/Icons.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { branches, getBranch } from '../../data/branches.js'
import { formatDay } from '../../lib/format.js'
import { useNow } from '../../lib/useNow.js'
import { clock, getPartyType, LEVERS, levers, POINT_VALUE, quietLabel, rupees, shortRupees } from '../config.js'
import { useV2 } from '../store.jsx'
import { BoltIcon, Logo, StarShape } from '../ui.jsx'

const sum = (list, f) => list.reduce((s, x) => s + f(x), 0)

const startOf = (range) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  if (range === 'week') d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  else if (range === 'month') d.setDate(1)
  else return 0
  return d.getTime()
}

// What PastaMania would see with a few weeks of data. Shown until the counter records the first visit.
const SAMPLE = {
  rows: {
    comeBack: { note: '138 treats used', sales: 386400, cost: 67620 },
    pass: { note: '64 of 200 sold, Havelock only', sales: 608000, cost: 79800 },
    quiet: { note: `96 visits, ${quietLabel()}`, sales: 211200, cost: 6900 },
    goal: { note: '57 bills reached Rs. 5,000', sales: 302100, cost: 57000 },
    parties: { note: '6 requests, quoted prices', sales: 214000, cost: 0 },
  },
  sales: 1721700,
  cost: 211320,
  visits: 412,
  joined: 86,
  rating: { avg: 4.4, count: 128 },
  complaints: [
    { id: 's1', rating: 2, branchId: 'havelock', at: Date.now() - 3 * 3600e3, note: 'Waited 35 minutes for the pasta.' },
    { id: 's2', rating: 3, branchId: 'ogf', at: Date.now() - 26 * 3600e3, note: 'The pizza was not hot when it came.' },
  ],
  requests: [
    { id: 'RQ-S1', title: 'Dough Workz birthday party', type: 'kids', date: '2026-12-05', count: 12, branchId: 'havelock', estimate: 36000, status: 'new' },
    { id: 'RQ-S2', title: 'Office lunch', type: 'office', date: '2026-11-26', count: 40, branchId: 'alfred', estimate: 96000, status: 'new' },
    { id: 'RQ-S3', title: 'Event catering', type: 'catering', date: '2026-12-12', count: 25, branchId: 'ogf', estimate: 55000, status: 'confirmed' },
  ],
}

function report(v2, club, range, branchId) {
  const from = startOf(range)
  const here = (x) => x.at >= from && (branchId === 'all' || x.branchId === branchId)
  const visits = v2.visits.filter(here)
  const passes = v2.passes.filter((p) => p.soldAt >= from && (branchId === 'all' || p.branchId === branchId))
  const requests = v2.requests.filter(here)

  const treated = visits.filter((v) => v.treatUsed)
  const boosted = visits.filter((v) => v.boost)
  const goals = visits.filter((v) => v.goal)
  const levered = visits.filter((v) => v.treatUsed || v.boost || v.goal)

  const rows = {
    comeBack: { note: `${treated.length} ${treated.length === 1 ? 'treat' : 'treats'} used`, sales: sum(treated, (v) => v.paid), cost: treated.length * levers.comeBack.itemPrice },
    pass: { note: `${v2.passes.length} of ${levers.pass.limit} sold`, sales: sum(passes, (p) => p.price), cost: passes.length * levers.pass.lunchValue },
    quiet: { note: `${boosted.length} ${boosted.length === 1 ? 'visit' : 'visits'} on double points`, sales: sum(boosted, (v) => v.paid), cost: Math.round(sum(boosted, (v) => v.bonus) * POINT_VALUE) },
    goal: { note: `${goals.length} ${goals.length === 1 ? 'bill' : 'bills'} reached ${rupees(levers.goal.spend)}`, sales: sum(goals, (v) => v.paid), cost: goals.length * levers.goal.off },
    parties: { note: `${requests.length} ${requests.length === 1 ? 'request' : 'requests'}, quoted prices`, sales: sum(requests, (r) => r.estimate), cost: 0 },
  }
  const rated = visits.filter((v) => v.rating)
  const joinedAt = club.member?.joinedAt ?? 0
  return {
    rows,
    // A bill can use several levers at once: count it once in the totals.
    sales: sum(levered, (v) => v.paid) + rows.pass.sales + rows.parties.sales,
    cost: sum(LEVERS, (k) => rows[k].cost),
    visits: visits.length,
    joined: joinedAt >= from ? 1 : 0,
    rating: rated.length ? { avg: Math.round((sum(rated, (v) => v.rating) / rated.length) * 10) / 10, count: rated.length } : null,
    complaints: rated.filter((v) => v.rating <= 3).sort((a, b) => b.at - a.at),
    requests: [...requests].sort((a, b) => a.date.localeCompare(b.date)),
  }
}

function Switch({ on, label, onChange }) {
  return (
    <button type="button" className="v2-switch" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}>
      <i aria-hidden="true" />
      <span>{on ? 'On' : 'Off'}</span>
    </button>
  )
}

const ago = (ms) => {
  const h = Math.round((Date.now() - ms) / 3600e3)
  if (h < 1) return 'just now'
  if (h < 24) return `${h} ${h === 1 ? 'hour' : 'hours'} ago`
  return formatDay(ms)
}

export default function Manager() {
  const v2 = useV2()
  const club = useClub()
  const now = useNow(30000)
  const [range, setRange] = useState('week')
  const [branchId, setBranchId] = useState('all')
  const [flashBranch, setFlashBranch] = useState('havelock')

  const hasData = v2.visits.length > 0 || v2.passes.length > 0 || v2.requests.length > 0
  const r = hasData ? report(v2, club, range, branchId) : SAMPLE
  const max = Math.max(1, ...LEVERS.map((k) => r.rows[k].sales))
  const flash = v2.flash && v2.flash.until > now.getTime() ? v2.flash : null
  const phoneOf = (memberId) => (memberId && club.member?.id === memberId ? club.member.phone : null)

  return (
    <div className="v2-desk" style={{ width: '100%' }}>
      <div className="v2-desk-inner">
        <header className="v2-desk-head">
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <Logo />
            <h1 className="v2-cd" style={{ fontSize: 38, lineHeight: '36px' }}>Manager</h1>
            {!hasData && <span className="v2-sample">Sample data until the first visit</span>}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            <select value={branchId} onChange={(e) => setBranchId(e.target.value)} aria-label="Branch" disabled={!hasData}>
              <option value="all">All branches</option>
              {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <select value={range} onChange={(e) => setRange(e.target.value)} aria-label="Period" disabled={!hasData}>
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="all">All time</option>
            </select>
          </div>
        </header>

        <section aria-label="In numbers" className="v2-stats">
          <div className="v2-stat hero">
            <span className="v2-eyebrow">Sales the app brought in</span>
            <span className="v2-cd v2-big" style={{ textTransform: 'none' }}>{shortRupees(r.sales)}</span>
            <span className="v2-body">
              Free food cost {shortRupees(r.cost)}. Left over: <strong style={{ fontWeight: 800, color: 'var(--gold-light)' }}>{shortRupees(r.sales - r.cost)}</strong>
            </span>
          </div>
          <div className="v2-stat">
            <span className="v2-body v2-strong v2-muted">Member visits</span>
            <span className="v2-stat-num">{r.visits.toLocaleString('en-US')}</span>
          </div>
          <div className="v2-stat">
            <span className="v2-body v2-strong v2-muted">New members</span>
            <span className="v2-stat-num">{r.joined}</span>
          </div>
          <div className="v2-stat">
            <span className="v2-body v2-strong v2-muted">Rating</span>
            <span className="v2-stat-num">{r.rating ? r.rating.avg : '–'}</span>
            <span className="v2-small v2-muted">{r.rating ? `of 5, from ${r.rating.count} ${r.rating.count === 1 ? 'rating' : 'ratings'}` : 'No ratings yet'}</span>
          </div>
        </section>

        <section className="v2-panel" style={{ paddingBottom: 8 }}>
          <h2 className="v2-cd v2-section">What each one earned</h2>
          <div className="v2-table-box">
            <table className="v2-table">
              <thead>
                <tr>
                  <th scope="col">Way to earn</th>
                  <th scope="col" className="bar-cell">Sales it brought</th>
                  <th scope="col">Free food cost</th>
                  <th scope="col">Left over</th>
                  <th scope="col">Switch</th>
                </tr>
              </thead>
              <tbody>
                {LEVERS.map((k) => {
                  const row = r.rows[k]
                  return (
                    <tr key={k}>
                      <th scope="row">
                        <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>{levers[k].label}</span>
                        <span className="v2-small v2-muted" style={{ fontWeight: 400 }}>{row.note}</span>
                      </th>
                      <td className="bar-cell">
                        <span className="v2-hbar" title={`${levers[k].label}: ${rupees(row.sales)}`}>
                          {row.sales > 0 && <i style={{ width: `${Math.max(2, (row.sales / max) * 70)}%` }} />}
                          {rupees(row.sales)}
                        </span>
                      </td>
                      <td>{row.cost ? rupees(row.cost) : <span className="v2-muted">None</span>}</td>
                      <td style={{ fontWeight: 800 }}>{rupees(row.sales - row.cost)}</td>
                      <td>
                        <Switch on={v2.switches[k]} label={levers[k].label} onChange={(on) => v2.setSwitch(k, on)} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row">Total <span className="v2-small v2-muted" style={{ fontWeight: 400 }}>(each bill once)</span></th>
                  <td className="bar-cell">{rupees(r.sales)}</td>
                  <td>{rupees(r.cost)}</td>
                  <td>{rupees(r.sales - r.cost)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        <div className="v2-desk-grid">
          <section className="v2-panel">
            <h2 className="v2-cd v2-section">Quiet hours</h2>
            <div className="v2-split">
              <div className="v2-grow">
                <span className="v2-body v2-strong">Double points</span>
                <span className="v2-small v2-muted">{quietLabel()}, all branches</span>
              </div>
              <Switch on={v2.switches.quiet} label="Double points in quiet hours" onChange={(on) => v2.setSwitch('quiet', on)} />
            </div>
            <div className="v2-stack v2-divider" style={{ paddingTop: 16, gap: 10 }}>
              <div className="v2-grow" style={{ gap: 2 }}>
                <span className="v2-body v2-strong">Quiet right now?</span>
                <span className="v2-small v2-muted">Start {levers.quiet.flashHours} hours of double points at one branch. Members see it on Home.</span>
              </div>
              {flash ? (
                <>
                  <p className="v2-note">Live at {getBranch(flash.branchId)?.name} until {clock(flash.until)}.</p>
                  <button type="button" className="v2-btn v2-btn-line v2-btn-block" onClick={v2.stopFlash}>Stop it now</button>
                </>
              ) : (
                <>
                  <label className="v2-field">
                    <span>Branch</span>
                    <select className="v2-input" value={flashBranch} onChange={(e) => setFlashBranch(e.target.value)}>
                      {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </label>
                  <button type="button" className="v2-btn v2-btn-red v2-btn-block" disabled={!v2.switches.quiet} onClick={() => v2.startFlash(flashBranch)}>
                    <BoltIcon width={18} height={18} /> Fill it now
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="v2-panel">
            <div className="v2-split">
              <h2 className="v2-cd v2-section">Complaints inbox</h2>
              {r.complaints.length > 0 && <span className="v2-tag red">{r.complaints.length} to call</span>}
            </div>
            {r.complaints.length === 0 && <p className="v2-small v2-muted">No ratings of 3 stars or less. Low ratings land here privately, with the guest’s number.</p>}
            {r.complaints.map((c, i) => {
              const phone = phoneOf(c.memberId)
              return (
                <article key={c.id} className={`v2-stack ${i ? 'v2-divider' : ''}`} style={{ paddingTop: i ? 14 : 0 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 10px' }}>
                    <span className="v2-body" style={{ display: 'flex', alignItems: 'center', gap: 4, fontWeight: 800 }}>
                      <StarShape width={16} height={16} fill="currentColor" /> {c.rating} of 5
                    </span>
                    <span className="v2-small v2-muted">{getBranch(c.branchId)?.shortName} · {ago(c.at)}</span>
                  </div>
                  <p className="v2-body">{c.note ? `“${c.note}”` : <span className="v2-muted">No comment left.</span>}</p>
                  {phone && (
                    <a className="v2-btn v2-btn-line v2-btn-sm" style={{ alignSelf: 'flex-start' }} href={`tel:${phone}`}>
                      <CallIcon width={16} height={16} /> Call guest
                    </a>
                  )}
                </article>
              )
            })}
          </section>

          <section className="v2-panel">
            <h2 className="v2-cd v2-section">Party and catering requests</h2>
            {r.requests.length === 0 && <p className="v2-small v2-muted">None yet. Guests send them from Celebrate with us, with a price estimate.</p>}
            {r.requests.map((q, i) => (
              <article key={q.id} className={`v2-stack ${i ? 'v2-divider' : ''}`} style={{ paddingTop: i ? 14 : 0, gap: 6 }}>
                <div className="v2-split">
                  <div className="v2-grow">
                    <span className="v2-body v2-strong">{q.title}</span>
                    <span className="v2-small v2-muted">
                      {formatDay(`${q.date}T12:00`)} · {q.count} {getPartyType(q.type).unit} · {getBranch(q.branchId)?.shortName}
                      {q.name ? ` · ${q.name}` : ''}
                    </span>
                  </div>
                  <span className="v2-body v2-nums" style={{ fontWeight: 800, whiteSpace: 'nowrap' }}>{rupees(q.estimate)}</span>
                </div>
                {q.notes && <p className="v2-small">“{q.notes}”</p>}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {q.phone && (
                    <a className="v2-btn v2-btn-line v2-btn-sm" href={`tel:${q.phone}`}><CallIcon width={16} height={16} /> Call</a>
                  )}
                  {q.status === 'confirmed' ? (
                    <span className="v2-tag gold" style={{ alignSelf: 'center' }}>Confirmed</span>
                  ) : (
                    hasData && <button type="button" className="v2-btn v2-btn-wine v2-btn-sm" onClick={() => v2.setRequestStatus(q.id, 'confirmed')}>Mark confirmed</button>
                  )}
                </div>
              </article>
            ))}
          </section>
        </div>

        <p className="v2-small v2-muted" style={{ textAlign: 'center' }}>
          Staff give points on the <Link to="/v2/counter" style={{ color: 'var(--red)', fontWeight: 700 }}>counter screen</Link>. See both apps side by side on <Link to="/compare" style={{ color: 'var(--red)', fontWeight: 700 }}>/compare</Link>.
        </p>
      </div>
    </div>
  )
}
