import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronIcon } from '../../components/Icons.jsx'
import { useToast } from '../../components/Toast.jsx'
import { useClub, voucherStatus } from '../../context/ClubContext.jsx'
import { nextReward, rewards } from '../../data/club.js'
import { formatPoints } from '../../lib/format.js'
import { dayMonth, levers } from '../config.js'
import { passLeft, useV2 } from '../store.jsx'
import { PassIcon, QrSmallIcon } from '../ui.jsx'
import { TreatTicket } from './Home.jsx'

export default function Rewards() {
  const club = useClub()
  const v2 = useV2()
  const toast = useToast()
  const navigate = useNavigate()
  const [asking, setAsking] = useState(null)

  const member = club.member
  const next = nextReward(club.balance)
  const progress = next ? Math.min(100, Math.round((club.balance / next.points) * 100)) : 100
  const treats = member ? v2.treatsFor(member.id) : []
  const pass = member && v2.switches.pass ? v2.passFor(member.id) : null
  const vouchers = club.vouchers.filter((v) => voucherStatus(v) === 'ready')

  const get = (reward) => {
    const voucher = club.redeem(reward)
    setAsking(null)
    if (!voucher) return toast('Not enough points yet')
    toast(`It’s yours! Free ${reward.name}`)
    navigate(`/v2/voucher/${voucher.id}`)
  }

  return (
    <>
      <header className="v2-head" style={{ gap: 14 }}>
        <div className="v2-head-row">
          <h1 className="v2-cd v2-title">Rewards</h1>
          <Link to={member ? '/v2/code' : '/v2/join'} className="v2-btn v2-btn-gold v2-btn-sm">
            <QrSmallIcon width={18} height={18} />
            {member ? 'My code' : 'Join free'}
          </Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span className="v2-slab" style={{ fontSize: 56, color: 'var(--gold)' }}>{formatPoints(club.balance)}</span>
          <span className="v2-cd" style={{ fontSize: 26, lineHeight: '26px' }}>points</span>
        </div>
        <div className="v2-stack">
          <div className="v2-bar" role="img" aria-label={next ? `${club.balance} of ${next.points} points` : 'Every reward is ready'}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="v2-goal-line">
            {member ? (
              next ? <><strong>{formatPoints(next.points - club.balance)} more points</strong> for a free {next.name}</> : <><strong>You can get any reward</strong> below</>
            ) : (
              <><strong>Join free</strong> and your first Garlic Bread is on us</>
            )}
          </span>
        </div>
      </header>

      <main className="v2-main" style={{ gap: 16 }}>
        {(treats.length > 0 || pass || vouchers.length > 0) && (
          <section className="v2-stack">
            <h2 className="v2-cd v2-section">Ready for you</h2>
            {treats.map((t) => <TreatTicket key={t.id} treat={t} />)}
            {vouchers.map((v) => (
              <Link key={v.id} to={`/v2/voucher/${v.id}`} className="v2-ticket v2-press">
                <img className="v2-ticket-img" src={v.image} alt="" />
                <span className="v2-grow" style={{ gap: 3 }}>
                  <span className="v2-eyebrow">Reward</span>
                  <strong className="v2-cd v2-ticket-name">Free {v.name}</strong>
                  <span className="v2-small v2-strong">Use by {dayMonth(v.expiresAt)}</span>
                </span>
                <ChevronIcon width={20} height={20} strokeWidth={2.4} style={{ marginRight: 4 }} />
              </Link>
            ))}
            {pass && (
              <Link to="/v2/pass" className="v2-row v2-press">
                <span className="v2-row-icon"><PassIcon width={24} height={24} /></span>
                <span className="v2-grow" style={{ gap: 3 }}>
                  <strong className="v2-cd v2-row-title">Pasta Pass</strong>
                  <span className="v2-small v2-muted">{passLeft(pass)} {passLeft(pass) === 1 ? 'lunch' : 'lunches'} left, the last one is free</span>
                </span>
                <ChevronIcon width={20} height={20} style={{ color: 'var(--muted)' }} />
              </Link>
            )}
          </section>
        )}

        <section className="v2-stack">
          <h2 className="v2-cd v2-section">Get with your points</h2>
          {rewards.map((r) => {
            const short = r.points - club.balance
            return (
              <div key={r.id} className="v2-row" style={{ padding: '10px 12px 10px 10px', flexWrap: 'wrap' }}>
                <img className="v2-thumb" src={r.image} alt="" />
                <div className="v2-grow">
                  <span className="v2-body v2-strong">{r.name}</span>
                  <span className="v2-small v2-muted">{formatPoints(r.points)} points</span>
                </div>
                {!member ? null : short > 0 ? (
                  <span className="v2-tag" style={{ alignSelf: 'center', padding: '12px 14px', borderRadius: 22, fontSize: 13.5 }}>{formatPoints(short)} more</span>
                ) : asking === r.id ? (
                  <button type="button" className="v2-btn v2-btn-wine v2-btn-sm" onClick={() => get(r)}>Spend {formatPoints(r.points)}</button>
                ) : (
                  <button type="button" className="v2-btn v2-btn-red v2-btn-sm" onClick={() => setAsking(r.id)}>Get</button>
                )}
                {asking === r.id && (
                  <p className="v2-small v2-muted" style={{ width: '100%', paddingLeft: 64 }}>
                    You’ll have {formatPoints(club.balance - r.points)} points left. It lasts 30 days.{' '}
                    <button type="button" className="v2-small v2-strong" style={{ border: 0, background: 'none', padding: '10px 4px', color: 'var(--red)' }} onClick={() => setAsking(null)}>Not now</button>
                  </p>
                )}
              </div>
            )
          })}
        </section>

        <p className="v2-small v2-muted">
          1 point for every Rs. 100 at the counter. Double points every quiet hour, and a free {levers.comeBack.item} to bring you back.
        </p>
      </main>
    </>
  )
}
