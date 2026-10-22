import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BowlIcon, CallIcon, ChevronIcon, CopyIcon, InstagramIcon, MailIcon, PinIcon } from '../components/Icons.jsx'
import Sheet, { useSheetClose } from '../components/Sheet.jsx'
import Sticker from '../components/Sticker.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch, openStatus } from '../data/branches.js'
import { formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { daysUntil, formatLKR, formatMemberCode, formatMonthYear, formatPhone, monthShort, weekdayShort } from '../lib/format.js'
import { useNow } from '../lib/useNow.js'
import { BUILD_ID } from '../lib/updates.js'
import { isPhoneOrTablet, switchView } from '../lib/view.js'

const todayKey = () => new Date().toISOString().slice(0, 10)

const whenLabel = (days) => (days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`)

// 'Dilini Perera' -> 'DP', 'Dilini' -> 'D'
const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join('')

const statusText = (status) => {
  if (!status) return { tone: '', text: 'Dine-in hours to confirm' }
  if (status.state === 'open') return { tone: 'open', text: `Open now · until ${status.closes}` }
  if (status.state === 'later') return { tone: 'later', text: `Opens today at ${status.opens}` }
  return { tone: 'closed', text: 'Closed now' }
}

function Row({ to, href, Icon, tone, label, aside }) {
  const content = (
    <>
      <span className={`icon-tile sm ${tone ?? ''}`}><Icon width={16} height={16} /></span>
      <span className="grow">{label}</span>
      {aside ? <small>{aside}</small> : <ChevronIcon width={16} height={16} />}
    </>
  )
  return (
    <li>
      {to ? (
        <Link className="list-row" to={to}>{content}</Link>
      ) : (
        <a className="list-row" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{content}</a>
      )}
    </li>
  )
}

function SignOutBody({ onConfirm }) {
  const close = useSheetClose()
  return (
    <>
      <div className="stack center" style={{ gap: 4 }}>
        <h2 id="signout-title" className="get-title">Sign out?</h2>
        <p className="muted">Your points on this phone will be cleared.</p>
      </div>
      <div className="stack" style={{ gap: 4 }}>
        <button type="button" className="btn btn-red btn-lg btn-block" onClick={onConfirm}>Sign out</button>
        <button type="button" className="text-btn muted" onClick={close}>Cancel</button>
      </div>
    </>
  )
}

// The Me tab: you, your bookings, and everything about visiting or contacting PastaMania.
// The staff counter is not linked from here; staff open /staff directly.
export default function Profile() {
  const { member, bookings, signOut } = useClub()
  const toast = useToast()
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)
  const now = useNow(60 * 1000)

  if (!member) return <Navigate to="/join?next=/me" replace />

  const upcoming = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({ ...b, session: getSession(b.sessionId) }))
    .filter((b) => b.session && b.session.date >= todayKey())
    .sort((a, b) => a.session.date.localeCompare(b.session.date))

  const copyNumber = async () => {
    try {
      await navigator.clipboard?.writeText(member.id)
    } catch {
      // clipboard blocked – the number is still on screen
    }
    toast('Member number copied')
  }

  return (
    <>
      <header className="wine-head grain">
        <div className="me-head rise">
          <span className="avatar xl pop" aria-hidden="true">{initials(member.name)}</span>
          <div>
            <h1 className="cd">{member.name}</h1>
            <span>Member since {formatMonthYear(member.joinedAt)}</span>
          </div>
        </div>
        <div className="rise" style={{ '--i': 1 }}>
          <button type="button" className="member-chip press" onClick={copyNumber} aria-label={`Copy member number ${formatMemberCode(member.id)}`}>
            {formatMemberCode(member.id)} <CopyIcon width={16} height={16} />
          </button>
        </div>
      </header>

      <div className="me">
        {upcoming.length > 0 && (
          <section className="block rise" style={{ '--i': 2 }}>
            <h2 className="block-title cd">My bookings</h2>
            <ul className="list-card card">
              {upcoming.map((b) => {
                const when = new Date(`${b.session.date}T${b.session.time}`)
                return (
                  <li key={b.ref}>
                    <Link to={`/book/ticket/${b.ref}`} className="booking-row">
                      <span className="date-tile">
                        <small>{weekdayShort(when)}</small>
                        <b>{when.getDate()}</b>
                        <small>{monthShort(when)}</small>
                      </span>
                      <span className="booking-text">
                        <strong>{workshop.title}</strong>
                        <span>
                          {getBranch(b.session.branchId).shortName} · {formatSessionTime(b.session)} · {b.children.length} {b.children.length === 1 ? 'child' : 'children'}
                        </span>
                      </span>
                      <span className="pill pill-gold">{whenLabel(daysUntil(when.getTime()))}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <section className="block rise" style={{ '--i': 3 }}>
          <h2 className="block-title cd">Branches</h2>
          <ul className="list-card card">
            {branches.map((b) => {
              const status = statusText(openStatus(b, now))
              return (
                <li key={b.id}>
                  <Link className="list-row" to="/branches">
                    <span className="icon-tile sm"><PinIcon width={16} height={16} /></span>
                    <span className="grow branch-line">
                      {b.name}
                      <small><span className={`status-dot ${status.tone}`} aria-hidden="true" />{status.text}</small>
                    </span>
                    <ChevronIcon width={16} height={16} />
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>

        <Link to="/book" className="workshop-card grain rise" style={{ '--i': 4 }}>
          <span className="workshop-photo">
            <img src={workshop.image} alt="" />
            <Sticker size={62} tilt={-10} className="workshop-sticker">
              <small>Ages</small>
              <b className="cd">{workshop.minAge}–{workshop.maxAge}</b>
            </Sticker>
          </span>
          <span className="workshop-text">
            <span className="eyebrow">{workshop.title}</span>
            <strong className="cd">Little chefs, <span>real pizza</span></strong>
            <small>{formatLKR(workshop.pricePerChild)} per child</small>
            <span className="btn btn-gold btn-sm">Book a session</span>
          </span>
        </Link>

        <section className="block rise" style={{ '--i': 5 }}>
          <h2 className="block-title cd">Get in touch</h2>
          <ul className="list-card card">
            <Row href={`tel:${brand.phone}`} Icon={CallIcon} label="Call us" aside={formatPhone(brand.phone)} />
            <Row to="/catering" Icon={BowlIcon} tone="gold" label="Event catering" />
            <Row href={`mailto:${brand.email}`} Icon={MailIcon} tone="green" label="Email us" />
            <Row href={brand.socials.instagram} Icon={InstagramIcon} label="Instagram" aside="@pastamaniasrilanka" />
          </ul>
        </section>

        <div className="me-foot rise" style={{ '--i': 6 }}>
          <button type="button" className="text-btn danger" onClick={() => setLeaving(true)}>Sign out</button>
          {!isPhoneOrTablet() && (
            <button type="button" className="text-btn muted" onClick={() => switchView('site')}>Open the website</button>
          )}
          <p className="version">PastaMania Club · version {BUILD_ID}</p>
        </div>
      </div>

      {leaving && (
        <Sheet labelledBy="signout-title" onClose={() => setLeaving(false)}>
          <SignOutBody
            onConfirm={() => {
              signOut()
              navigate('/', { replace: true })
            }}
          />
        </Sheet>
      )}
    </>
  )
}
