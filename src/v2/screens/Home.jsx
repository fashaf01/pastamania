import { Link } from 'react-router-dom'
import { ChevronIcon } from '../../components/Icons.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { club as clubRules, nextReward, rewards } from '../../data/club.js'
import { firstName, formatPoints } from '../../lib/format.js'
import { useNow } from '../../lib/useNow.js'
import { clock, levers, quietLabel, rupees, weekDeals } from '../config.js'
import { passLeft, useV2 } from '../store.jsx'
import { BoltIcon, BranchPick, Burst, CakeIcon, Logo, PassIcon, QrSmallIcon, useBranch } from '../ui.jsx'

export function PassDots({ pass }) {
  const total = levers.pass.paid + levers.pass.free
  return (
    <span className="v2-dots" role="img" aria-label={`${pass.used} of ${total} lunches used`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={i < pass.used ? 'on' : i >= levers.pass.paid ? 'free' : ''} />
      ))}
    </span>
  )
}

export function TreatTicket({ treat, to = '/v2/code', eyebrow = 'Come-back treat' }) {
  const until = new Date(treat.expiresAt)
  return (
    <Link to={to} className="v2-ticket v2-press">
      <img className="v2-ticket-img" src={treat.image} alt="" />
      <span className="v2-grow" style={{ gap: 3 }}>
        <span className="v2-eyebrow">{eyebrow}</span>
        <strong className="v2-cd v2-ticket-name">Free {treat.name}</strong>
        <span className="v2-small v2-strong">Use by {until.getDate()} {until.toLocaleString('en-GB', { month: 'short' })}</span>
      </span>
      <ChevronIcon width={20} height={20} strokeWidth={2.4} style={{ marginRight: 4 }} />
    </Link>
  )
}

export function BoostBanner({ boost, branch, live }) {
  return (
    <Link to="/v2/deals" className="v2-poster v2-press">
      <Burst size={52} tilt={-8}>x{levers.quiet.multiplier}</Burst>
      <span className="v2-grow" style={{ gap: 3 }}>
        <strong className="v2-cd v2-poster-title">Double points right now</strong>
        <span className="v2-small">
          {branch.shortName} · until {clock(boost.until)}
        </span>
      </span>
      {live ? <span className="v2-tag live">Live</span> : <ChevronIcon width={20} height={20} strokeWidth={2.4} />}
    </Link>
  )
}

export function DealTiles({ deals, showParty }) {
  return (
    <div className="v2-scroll-row">
      {deals.map((d) =>
        d.kind === 'goal' ? (
          <Link key={d.id} to={`/v2/deals/${d.id}`} className="v2-deal-tile v2-press">
            <span className="v2-deal-tile-top">
              <span className="v2-slab" style={{ fontSize: 30, lineHeight: 1, color: 'var(--gold)' }}>{rupees(levers.goal.off)}</span>
              <span className="v2-cd" style={{ fontSize: 22, lineHeight: '22px', color: 'var(--cream)' }}>off your bill</span>
            </span>
            <span className="v2-deal-tile-body">
              <span className="v2-body v2-strong">{d.sub.replace(' or more', '')}</span>
              <span className="v2-small v2-muted">{d.where} · {d.when.replace('Until', 'until')}</span>
            </span>
          </Link>
        ) : (
          <Link key={d.id} to={d.today ? `/v2/deals/${d.id}` : '/v2/deals'} className="v2-deal-tile v2-press">
            <img src={d.image} alt={d.sub} />
            <Burst size={60} style={{ position: 'absolute', left: 8, top: 8 }}>1+1</Burst>
            <span className="v2-deal-tile-body">
              <span className="v2-body v2-strong">{d.title}</span>
              <span className="v2-small v2-muted">{d.sub} · {d.when}</span>
            </span>
          </Link>
        ),
      )}
      {showParty && (
        <Link to="/v2/celebrate" className="v2-deal-tile v2-press">
          <img src="/images/menu/margherita-pizza-7inch.jpg" alt="" />
          <span className="v2-deal-tile-body">
            <span className="v2-body v2-strong">Planning a party?</span>
            <span className="v2-small v2-muted">Kids parties, office lunch, catering</span>
          </span>
        </Link>
      )}
    </div>
  )
}

function Welcome({ deals, switches }) {
  const gift = rewards[0]
  return (
    <>
      <header className="v2-head v2-welcome">
        <Logo className="v2-welcome-logo" />
        <span className="v2-eyebrow">PastaMania Club</span>
        <h1 className="v2-cd">Eat pasta.<br /><span>Earn free pasta.</span></h1>
        <p className="v2-body">Join free and your first {gift.name} is on us. Show your code when you pay and every Rs. {clubRules.spendPerPoint} earns a point.</p>
        <Link to="/v2/join" className="v2-btn v2-btn-gold v2-btn-lg v2-btn-block">Join free</Link>
      </header>
      <main className="v2-main">
        <div className="v2-split">
          <h2 className="v2-cd v2-section">This week</h2>
          <Link to="/v2/deals" className="v2-small v2-strong" style={{ color: 'var(--red)', minHeight: 44, display: 'flex', alignItems: 'center' }}>All deals</Link>
        </div>
        <DealTiles deals={deals} showParty={switches.parties} />
        <Link to="/v2/menu" className="v2-btn v2-btn-line v2-btn-block">See the menu</Link>
      </main>
    </>
  )
}

export default function Home() {
  const club = useClub()
  const v2 = useV2()
  const now = useNow(30000)
  const [branch, setBranch] = useBranch()
  const deals = weekDeals(v2.switches, now)

  if (!club.member) return <Welcome deals={deals} switches={v2.switches} />

  const next = nextReward(club.balance)
  const progress = next ? Math.min(100, Math.round((club.balance / next.points) * 100)) : 100
  const treat = v2.treatsFor(club.member.id)[0]
  const pass = v2.switches.pass ? v2.passFor(club.member.id) : null
  const boost = v2.boostAt(branch.id, now.getTime())

  return (
    <>
      <header className="v2-head">
        <div className="v2-head-row">
          <div className="v2-head-id">
            <Logo />
            <div className="v2-grow" style={{ gap: 2 }}>
              <span className="v2-eyebrow">Welcome back</span>
              <h1 className="v2-cd" style={{ fontSize: 30, lineHeight: '30px' }}>Hi {firstName(club.member.name)}</h1>
            </div>
          </div>
          <BranchPick branch={branch} onChange={setBranch} />
        </div>
        <div className="v2-points">
          <div className="v2-stack" style={{ gap: 6 }}>
            <span className="v2-eyebrow">Your points</span>
            <span className="v2-slab v2-points-num">{formatPoints(club.balance)}</span>
          </div>
          <Link to="/v2/code" className="v2-btn v2-btn-gold">
            <QrSmallIcon width={20} height={20} />
            My code
          </Link>
        </div>
        <div className="v2-stack">
          <div className="v2-bar" role="img" aria-label={next ? `${club.balance} of ${next.points} points` : 'Every reward is ready'}>
            <span style={{ width: `${progress}%` }} />
          </div>
          <span className="v2-goal-line">
            {next ? (
              <><strong>{formatPoints(next.points - club.balance)} more points</strong> for a free {next.name}</>
            ) : (
              <><strong>You can get any reward</strong> in Rewards</>
            )}
          </span>
        </div>
      </header>

      <main className="v2-main">
        {treat && <TreatTicket treat={treat} />}

        {v2.switches.pass && (
          <Link to="/v2/pass" className="v2-row v2-press">
            <span className="v2-row-icon"><PassIcon width={24} height={24} /></span>
            <span className="v2-grow" style={{ gap: 4 }}>
              <strong className="v2-cd v2-row-title">Pasta Pass</strong>
              {pass ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="v2-small v2-muted">{passLeft(pass)} {passLeft(pass) === 1 ? 'lunch' : 'lunches'} left</span>
                  <PassDots pass={pass} />
                </span>
              ) : (
                <span className="v2-small v2-muted">{levers.pass.paid} lunches + {levers.pass.free} free</span>
              )}
            </span>
            <ChevronIcon width={20} height={20} style={{ color: 'var(--muted)' }} />
          </Link>
        )}

        {boost && <BoostBanner boost={boost} branch={branch} />}

        <section className="v2-stack" style={{ gap: 0 }}>
          <div className="v2-split">
            <h2 className="v2-cd v2-section">This week</h2>
            <Link to="/v2/deals" className="v2-small v2-strong" style={{ color: 'var(--red)', minHeight: 44, display: 'flex', alignItems: 'center' }}>All deals</Link>
          </div>
          <DealTiles deals={deals} showParty={v2.switches.parties} />
        </section>

        {!boost && v2.switches.quiet && (
          <p className="v2-small v2-muted" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BoltIcon width={16} height={16} />
            Double points every {quietLabel()}
          </p>
        )}

        {v2.switches.parties && (
          <Link to="/v2/celebrate" className="v2-row v2-press">
            <span className="v2-row-icon"><CakeIcon width={24} height={24} /></span>
            <span className="v2-grow" style={{ gap: 2 }}>
              <strong className="v2-cd v2-row-title">Celebrate with us</strong>
              <span className="v2-small v2-muted">Kids parties, office lunch, catering</span>
            </span>
            <ChevronIcon width={20} height={20} style={{ color: 'var(--muted)' }} />
          </Link>
        )}
      </main>
    </>
  )
}
