import { Link, Navigate } from 'react-router-dom'
import { ChevronIcon } from '../../components/Icons.jsx'
import { useClub, voucherStatus } from '../../context/ClubContext.jsx'
import { formatMemberCode } from '../../lib/format.js'
import { memberQr } from '../config.js'
import { passLeft, useV2 } from '../store.jsx'
import { BackButton, MemberQr } from '../ui.jsx'

// One code for everything: points, the come-back treat, the Pasta Pass and money-off deals. The counter sees
// what's on it when they scan.
export default function Code() {
  const club = useClub()
  const v2 = useV2()
  if (!club.member) return <Navigate to="/v2/join" replace />

  const treats = v2.treatsFor(club.member.id)
  const pass = v2.switches.pass ? v2.passFor(club.member.id) : null
  const vouchers = club.vouchers.filter((v) => voucherStatus(v) === 'ready')
  const extras = [
    ...treats.map((t) => ({ key: t.id, image: t.image, text: `Free ${t.name}`, note: 'Come-back treat' })),
    ...(pass ? [{ key: pass.id, text: `Pasta Pass · ${passLeft(pass)} left`, note: 'Ask for your lunch', to: '/v2/pass' }] : []),
    ...vouchers.map((v) => ({ key: v.id, image: v.image, text: `Free ${v.name}`, note: 'Reward', to: `/v2/voucher/${v.id}` })),
  ]

  return (
    <div className="v2-full">
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <BackButton close label="Close" />
      </div>
      <div className="v2-stack" style={{ gap: 4, alignItems: 'center', textAlign: 'center' }}>
        <span className="v2-eyebrow">My code</span>
        <h1 className="v2-cd" style={{ fontSize: 44, lineHeight: '40px' }}>Show this<br />when you pay</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MemberQr value={memberQr(club.member.id)} size={232} />
      </div>
      <div className="v2-stack" style={{ gap: 2, alignItems: 'center' }}>
        <span className="v2-eyebrow">Member number</span>
        <strong className="v2-cd" style={{ fontSize: 30, lineHeight: '30px' }}>{formatMemberCode(club.member.id)}</strong>
      </div>
      {extras.length > 0 && (
        <section className="v2-stack" style={{ gap: 10 }}>
          <span className="v2-eyebrow" style={{ textAlign: 'center' }}>Also on your code</span>
          {extras.map((x) => {
            const Tag = x.to ? Link : 'div'
            return (
              <Tag key={x.key} {...(x.to ? { to: x.to } : {})} className="v2-ticket" style={{ padding: '10px 14px' }}>
                {x.image ? <img className="v2-ticket-img" src={x.image} alt="" style={{ width: 44, height: 44 }} /> : null}
                <span className="v2-grow" style={{ gap: 2 }}>
                  <span className="v2-eyebrow" style={{ color: 'var(--wine)' }}>{x.note}</span>
                  <strong className="v2-cd" style={{ fontSize: 22, lineHeight: '22px' }}>{x.text}</strong>
                </span>
                {x.to && <ChevronIcon width={20} height={20} strokeWidth={2.4} />}
              </Tag>
            )
          })}
        </section>
      )}
      <p className="v2-small" style={{ textAlign: 'center', opacity: 0.85 }}>Turn your screen brightness up so it scans first time.</p>
    </div>
  )
}
