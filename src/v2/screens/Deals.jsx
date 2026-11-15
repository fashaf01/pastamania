import { Link } from 'react-router-dom'
import { CalendarIcon, ClockIcon } from '../../components/Icons.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { useNow } from '../../lib/useNow.js'
import { levers, quietLabel, weekDeals } from '../config.js'
import { useV2 } from '../store.jsx'
import { BoltIcon, Burst, useBranch } from '../ui.jsx'
import { BoostBanner } from './Home.jsx'

export default function Deals() {
  const club = useClub()
  const v2 = useV2()
  const now = useNow(30000)
  const [branch] = useBranch()
  const boost = v2.boostAt(branch.id, now.getTime())
  const deals = weekDeals(v2.switches, now)
  const treats = club.member ? v2.treatsFor(club.member.id) : []

  return (
    <>
      <header className="v2-head" style={{ gap: 2, paddingBottom: 18 }}>
        <h1 className="v2-cd v2-title">Deals</h1>
        <p className="v2-body">Show your code at the counter to use any deal.</p>
      </header>

      <main className="v2-main tight">
        {boost ? (
          <BoostBanner boost={boost} branch={branch} live />
        ) : (
          v2.switches.quiet && (
            <section className="v2-row">
              <span className="v2-row-icon"><BoltIcon width={22} height={22} /></span>
              <span className="v2-grow" style={{ gap: 2 }}>
                <strong className="v2-cd v2-row-title">Double points</strong>
                <span className="v2-small v2-muted">Every {quietLabel()}, all branches</span>
              </span>
            </section>
          )
        )}

        {treats.map((t) => (
          <article key={t.id} className="v2-ticket col">
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <img className="v2-ticket-img" src={t.image} alt="" />
              <div className="v2-grow" style={{ gap: 3 }}>
                <span className="v2-eyebrow">Just for you</span>
                <h2 className="v2-cd" style={{ fontSize: 28, lineHeight: '26px' }}>Free {t.name}</h2>
                <span className="v2-small v2-strong">Your come-back treat, with any main</span>
              </div>
            </div>
            <div className="v2-perf" aria-hidden="true"><span /></div>
            <div className="v2-split">
              <span className="v2-when" style={{ color: 'var(--wine)', fontWeight: 800 }}>
                <ClockIcon width={16} height={16} />
                Use by {new Date(t.expiresAt).getDate()} {new Date(t.expiresAt).toLocaleString('en-GB', { month: 'short' })}
              </span>
              <Link to="/v2/code" className="v2-btn v2-btn-wine v2-btn-sm">Use treat</Link>
            </div>
          </article>
        ))}

        {deals.map((d) =>
          d.kind === 'goal' ? (
            <article key={d.id} className="v2-deal">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="v2-deal-art" aria-hidden="true">
                  <span className="v2-eyebrow" style={{ color: 'var(--cream)', letterSpacing: '0.1em', fontStretch: '100%' }}>Rs.</span>
                  <span className="v2-slab" style={{ fontSize: 23, lineHeight: 1, color: 'var(--gold)' }}>{levers.goal.off.toLocaleString('en-US')}</span>
                  <span className="v2-eyebrow" style={{ color: 'var(--cream)', letterSpacing: '0.1em', fontStretch: '100%' }}>off</span>
                </span>
                <div className="v2-grow" style={{ gap: 4 }}>
                  <span className="v2-tag">{d.where}</span>
                  <h2 className="v2-cd v2-card-title">{d.title}</h2>
                  <span className="v2-small v2-muted">{d.sub}</span>
                </div>
              </div>
              <div className="v2-deal-foot">
                <span className="v2-when"><ClockIcon width={16} height={16} />{d.when}</span>
                <Link to={`/v2/deals/${d.id}`} className="v2-btn v2-btn-red v2-btn-sm">Use deal</Link>
              </div>
            </article>
          ) : (
            <article key={d.id} className="v2-deal">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span className="v2-deal-art" style={{ background: 'none' }}>
                  <img src={d.image} alt={d.sub} />
                  <Burst size={46} fontSize={13}>1+1</Burst>
                </span>
                <div className="v2-grow" style={{ gap: 4 }}>
                  <span className="v2-tag">{d.where}</span>
                  <h2 className="v2-cd v2-card-title">{d.title}</h2>
                  <span className="v2-small v2-muted">{d.sub}</span>
                </div>
              </div>
              <div className="v2-deal-foot">
                <span className="v2-when"><CalendarIcon width={16} height={16} />{d.when}</span>
                {d.today ? (
                  <Link to={`/v2/deals/${d.id}`} className="v2-btn v2-btn-red v2-btn-sm">Use deal</Link>
                ) : (
                  <span className="v2-tag" style={{ alignSelf: 'center', padding: '12px 16px', borderRadius: 22 }}>Opens Friday</span>
                )}
              </div>
            </article>
          ),
        )}

        {v2.switches.parties && (
          <Link to="/v2/celebrate" className="v2-poster v2-press">
            <Burst size={52} tilt={-8} fontSize={12}>Party</Burst>
            <span className="v2-grow" style={{ gap: 3 }}>
              <strong className="v2-cd v2-poster-title">Kids parties and catering</strong>
              <span className="v2-small">Pick a date and see the price in seconds</span>
            </span>
          </Link>
        )}
      </main>
    </>
  )
}
