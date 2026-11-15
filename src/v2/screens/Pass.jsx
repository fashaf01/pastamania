import { Link } from 'react-router-dom'
import { CheckIcon } from '../../components/Icons.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { levers, rupees } from '../config.js'
import { passLeft, useV2 } from '../store.jsx'
import { Burst, Logo, QrSmallIcon, SubHead } from '../ui.jsx'

const STEPS = [
  ['Buy it at the counter', `Pay for ${levers.pass.paid} lunches in one go.`],
  ['Show your code each visit', 'The cashier takes one lunch off.'],
  [`Your ${levers.pass.paid + levers.pass.free === 6 ? '6th' : 'last'} lunch is free`, 'Then buy your next pass.'],
]

export default function Pass() {
  const club = useClub()
  const v2 = useV2()
  const p = levers.pass
  const total = p.paid + p.free
  const pass = club.member && v2.switches.pass ? v2.passFor(club.member.id) : null

  return (
    <>
      <SubHead title="Pasta Pass" />
      <main className="v2-main" style={{ gap: 14 }}>
        {!v2.switches.pass ? (
          <p className="v2-note">The Pasta Pass isn’t on sale right now.</p>
        ) : (
          <section className="v2-ticket col" style={{ padding: '20px 20px 18px' }}>
            <div className="v2-split">
              <div className="v2-stack" style={{ gap: 6 }}>
                <span className="v2-eyebrow">{pass ? 'Your pass' : 'The Pasta Pass'}</span>
                {pass ? (
                  <span style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span className="v2-slab" style={{ fontSize: 56 }}>{passLeft(pass)}</span>
                    <span className="v2-cd" style={{ fontSize: 32, lineHeight: '30px' }}>{passLeft(pass) === 1 ? 'lunch left' : 'lunches left'}</span>
                  </span>
                ) : (
                  <span className="v2-cd" style={{ fontSize: 34, lineHeight: '32px' }}>{p.paid} lunches<br />+ {p.free} free</span>
                )}
              </div>
              <Logo className="v2-logo" />
            </div>
            <div className="v2-perf" style={{ margin: '0 -20px' }} aria-hidden="true"><span /></div>
            <div className="v2-pass-stamps" role="img" aria-label={pass ? `${pass.used} of ${total} lunches used. The last one is free.` : `${total} lunches, the last one free`}>
              {Array.from({ length: total }, (_, i) =>
                i >= p.paid ? (
                  <Burst key={i} size={undefined} tilt={-8} fontSize={11} style={{ width: '100%', aspectRatio: '1' }}>Free</Burst>
                ) : pass && i < pass.used ? (
                  <span key={i} className="on"><CheckIcon width={20} height={20} strokeWidth={3} /></span>
                ) : (
                  <span key={i}>{i + 1}</span>
                ),
              )}
            </div>
            <span className="v2-small v2-strong" style={{ marginTop: 12 }}>
              {pass ? `${p.paid} lunches paid upfront. The ${total === 6 ? '6th' : 'last'} is free.` : `${p.counts}. ${rupees(p.price)} at the counter.`}
            </span>
          </section>
        )}

        <section className="v2-card v2-stack-lg" style={{ padding: 18 }}>
          <h2 className="v2-cd" style={{ fontSize: 26, lineHeight: '26px', color: 'var(--red)' }}>How it works</h2>
          {STEPS.map(([title, text], i) => (
            <div key={title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={`v2-step-num-dot ${i === 2 ? 'gold' : ''}`}>{i + 1}</span>
              <div className="v2-grow">
                <span className="v2-body v2-strong">{title}</span>
                <span className="v2-small v2-muted">{text}</span>
              </div>
            </div>
          ))}
        </section>

        {v2.switches.pass && (
          <section className="v2-card v2-pad v2-split">
            <div className="v2-grow">
              <span className="v2-body v2-strong">{pass ? 'Next pass' : 'New pass'}</span>
              <span className="v2-small v2-muted">{p.paid} lunches + {p.free} free · {p.counts.toLowerCase()}</span>
            </div>
            <span className="v2-cd v2-nums" style={{ fontSize: 26, lineHeight: '26px', textTransform: 'none', whiteSpace: 'nowrap' }}>{rupees(p.price)}</span>
          </section>
        )}

        <Link to={club.member ? '/v2/code' : '/v2/join'} className="v2-btn v2-btn-red v2-btn-lg v2-btn-block">
          <QrSmallIcon width={20} height={20} />
          {club.member ? (pass ? 'Show my code to use a lunch' : 'Show my code to buy one') : 'Join free to get a pass'}
        </Link>
      </main>
    </>
  )
}
