import { Link } from 'react-router-dom'
import Banners from '../components/Banners.jsx'
import { ChevronIcon, GiftIcon } from '../components/Icons.jsx'
import RewardProgress from '../components/RewardProgress.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { liveBanners } from '../data/banners.js'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { bestReadyReward, club } from '../data/club.js'
import { formatSessionDate, formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { firstName, formatPoints } from '../lib/format.js'
import { BUILD_ID } from '../lib/updates.js'

const STEPS = [
  ['Join in 30 seconds', `Get ${club.welcomeBonus} points – that’s a free Garlic Bread.`],
  ['Show your code when you pay', `Earn 1 point for every LKR ${club.spendPerPoint} at any branch.`],
  ['Swap points for free food', 'Redeem in the app, show the voucher, enjoy.'],
]

function Row({ to, image, icon, title, text, className = '' }) {
  return (
    <Link to={to} className={`row ${className}`}>
      {image ? <img src={image} alt="" /> : <span className="row-icon">{icon}</span>}
      <span className="row-text">
        <strong>{title}</strong>
        <span>{text}</span>
      </span>
      <ChevronIcon width={18} height={18} />
    </Link>
  )
}

export default function Home() {
  const { member, balance, bookings, vouchers } = useClub()
  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready')
  const myNext = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({ ...b, session: getSession(b.sessionId) }))
    .filter((b) => b.session)
    .sort((a, b) => a.session.date.localeCompare(b.session.date))[0]

  return (
    <>
      {member ? (
        <section className="hero">
          <div className="hero-top">
            <img src={brand.logo} alt="PastaMania" width="40" height="40" />
            <Link to="/me" className="avatar" aria-label="My profile">
              {firstName(member.name).charAt(0).toUpperCase()}
            </Link>
          </div>
          <p className="hello">Hi {firstName(member.name)}</p>
          <p className="balance">
            <span key={balance} className="retro retro-gold">{formatPoints(balance)}</span> points
          </p>
          <RewardProgress balance={balance} />
          <div className="hero-actions">
            <Link className="btn btn-gold" to="/card">Show my code</Link>
            {ready.length > 0 ? (
              <Link className="btn btn-ghost" to="/wallet">Use voucher</Link>
            ) : (
              bestReadyReward(balance) && <Link className="btn btn-ghost" to="/rewards">Redeem</Link>
            )}
          </div>
        </section>
      ) : (
        <section className="hero hero-guest">
          <img src={brand.logo} alt="PastaMania" width="72" height="72" />
          <h1 className="retro retro-gold">
            Eat pasta.
            <br />
            Earn free pasta.
          </h1>
          <p>Join the {club.name} and your first Garlic Bread is on us.</p>
          <Link className="btn btn-gold btn-wide" to="/join">Join free</Link>
          <Link className="hero-link" to="/menu">or browse the menu</Link>
        </section>
      )}

      <div className="pad">
        <section className="block">
          <Banners banners={liveBanners()} />
        </section>

        {member && (ready.length > 0 || myNext) && (
          <section className="block rows">
            {ready.length > 0 && (
              <Row
                to="/wallet"
                className="ready-row"
                icon={<GiftIcon width={20} height={20} />}
                title={ready.length === 1 ? `Free ${ready[0].name} ready` : `${ready.length} free items ready`}
                text="Show the voucher at the counter"
              />
            )}
            {myNext && (
              <Row
                to={`/book/ticket/${myNext.ref}`}
                image={workshop.image}
                title={`Workshop · ${formatSessionDate(myNext.session)}, ${formatSessionTime(myNext.session)}`}
                text={`${getBranch(myNext.session.branchId).name} · ${myNext.children.length} ${myNext.children.length === 1 ? 'child' : 'children'}`}
              />
            )}
          </section>
        )}

        {!member && (
          <section className="block">
            <h2 className="h2">How it works</h2>
            <ol className="steps">
              {STEPS.map(([title, text], i) => (
                <li key={title}>
                  <span className="step-n">{i + 1}</span>
                  <span>
                    <strong>{title}</strong>
                    <span className="muted">{text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <p className="version">Version {BUILD_ID}</p>
      </div>
    </>
  )
}
