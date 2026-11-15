import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CheckIcon, CloseIcon } from '../../components/Icons.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { pointsForSpend } from '../../data/club.js'
import { menus } from '../../data/menu.js'
import { formatMemberCode, pointsText } from '../../lib/format.js'
import { levers, memberQr, rupees, weekDeals } from '../config.js'
import { useV2 } from '../store.jsx'
import { MemberQr, SubHead, useBranch } from '../ui.jsx'

function CodeCard() {
  const { member } = useClub()
  if (!member) {
    return (
      <section className="v2-code">
        <h2 className="v2-cd" style={{ fontSize: 26, lineHeight: '26px' }}>Join free to use deals</h2>
        <p className="v2-body">Your phone becomes your card. Your first Garlic Bread is on us.</p>
        <Link to="/v2/join" className="v2-btn v2-btn-gold v2-btn-block">Join free</Link>
      </section>
    )
  }
  return (
    <section className="v2-code">
      <MemberQr value={memberQr(member.id)} />
      <div className="v2-stack" style={{ gap: 4, alignItems: 'center' }}>
        <span className="v2-eyebrow">Show this at the counter</span>
        <h2 className="v2-cd" style={{ fontSize: 26, lineHeight: '26px' }}>{formatMemberCode(member.id)}</h2>
      </div>
    </section>
  )
}

// The bigger-bill goal: plan what you'll order and see how far you are from money off.
function GoalPlanner({ branch }) {
  const items = menus[branch.id] ?? []
  const [plan, setPlan] = useState([])
  const goal = levers.goal.spend
  const total = plan.reduce((sum, p) => sum + p.price, 0)
  const left = Math.max(0, goal - total)
  const pays = left === 0 ? total - levers.goal.off : total
  const suggestion = left > 0 && total > 0 ? [...items].sort((a, b) => a.price - b.price).find((i) => i.price >= left && i.image) : null

  const add = (name) => {
    const item = items.find((i) => i.name === name)
    if (item) setPlan((p) => [...p, { key: `${name}-${Date.now()}`, name: item.name, price: item.price }])
  }

  return (
    <section className="v2-card v2-pad v2-stack-lg" style={{ padding: 18 }}>
      <div className="v2-stack" style={{ gap: 10 }}>
        <div className="v2-split" style={{ alignItems: 'baseline' }}>
          <span className="v2-eyebrow" style={{ color: 'var(--gold-ink)' }}>Your bill so far</span>
          <span className="v2-small v2-strong v2-muted">Goal {rupees(goal)}</span>
        </div>
        <span className="v2-cd v2-nums" style={{ fontSize: 54, lineHeight: '48px', textTransform: 'none' }}>{rupees(total)}</span>
        <div className="v2-bar light" role="img" aria-label={`${rupees(total)} of ${rupees(goal)}`}>
          <span style={{ width: `${Math.min(100, (total / goal) * 100)}%` }} />
        </div>
        {left > 0 ? (
          <span className="v2-body">
            <strong style={{ fontWeight: 800, color: 'var(--red)' }}>{rupees(left)} more to go</strong> and {rupees(levers.goal.off)} comes off
          </span>
        ) : (
          <span className="v2-body v2-strong" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="v2-avatar" style={{ width: 22, height: 22, background: 'var(--wine)', color: 'var(--gold)' }}><CheckIcon width={14} height={14} strokeWidth={3} /></span>
            Goal reached. You pay {rupees(pays)}.
          </span>
        )}
      </div>

      <div className="v2-stack v2-divider" style={{ paddingTop: 14 }}>
        <h2 className="v2-eyebrow" style={{ color: 'var(--gold-ink)' }}>Plan your order</h2>
        {plan.length === 0 && <p className="v2-small v2-muted">Add what you’re thinking of ordering to see how close you are.</p>}
        {plan.map((p) => (
          <div key={p.key} className="v2-split v2-body">
            <span>{p.name}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span className="v2-strong" style={{ whiteSpace: 'nowrap' }}>{rupees(p.price)}</span>
              <button type="button" className="v2-step" style={{ border: 0, width: 40, height: 40 }} onClick={() => setPlan((all) => all.filter((x) => x.key !== p.key))} aria-label={`Remove ${p.name}`}>
                <CloseIcon width={18} height={18} />
              </button>
            </span>
          </div>
        ))}
        <label className="v2-field">
          <span className="sr-only">Add a dish</span>
          <select className="v2-input" value="" onChange={(e) => add(e.target.value)}>
            <option value="">+ Add a dish</option>
            {items.map((i) => (
              <option key={i.name} value={i.name}>{i.name} · {rupees(i.price)}</option>
            ))}
          </select>
        </label>
      </div>

      {suggestion && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px 13px 10px', borderRadius: 18, background: 'var(--cream)' }}>
          <img src={suggestion.image} alt="" style={{ width: 48, height: 48, borderRadius: 12, objectFit: 'cover', flex: 'none' }} />
          <div className="v2-grow">
            <span className="v2-body v2-strong">Add {suggestion.name}</span>
            <span className="v2-small v2-muted">{rupees(suggestion.price)} gets you there</span>
          </div>
          <button type="button" className="v2-btn v2-btn-red v2-btn-sm" onClick={() => add(suggestion.name)}>Add</button>
        </div>
      )}

      {total > 0 && <p className="v2-small v2-muted">This bill earns {pointsText(pointsForSpend(pays))} when you show your code.</p>}
    </section>
  )
}

export default function UseDeal() {
  const { id } = useParams()
  const v2 = useV2()
  const [branch] = useBranch()
  const deal = weekDeals(v2.switches, new Date()).find((d) => d.id === id)
  if (!deal) return <Navigate to="/v2/deals" replace />

  return (
    <>
      <SubHead title={deal.title} back="/v2/deals" sub={deal.kind === 'goal' ? `Spend ${rupees(levers.goal.spend)} or more · ${deal.when.replace('Until', 'until')}` : `${deal.sub} · ${deal.when}`} />
      <main className="v2-main" style={{ gap: 14 }}>
        {deal.kind === 'goal' ? (
          <GoalPlanner branch={branch} />
        ) : (
          <section className="v2-card" style={{ overflow: 'hidden' }}>
            <img src={deal.image} alt={deal.sub} style={{ width: '100%', height: 150, objectFit: 'cover' }} />
            <div className="v2-pad v2-stack" style={{ gap: 4 }}>
              <h2 className="v2-cd v2-card-title">Buy one {deal.sub}, get one free</h2>
              <p className="v2-small v2-muted">Every Friday at all branches. Show your code when you pay.</p>
            </div>
          </section>
        )}
        <CodeCard />
      </main>
    </>
  )
}
