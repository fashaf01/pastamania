import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowIcon, CallIcon, ChevronIcon, CopyIcon, InstagramIcon, MailIcon, PinIcon } from '../components/Icons.jsx'
import Sheet, { useSheetClose } from '../components/Sheet.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { branches, getBranch, openStatus } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, upcomingSessions, workshop } from '../data/workshops.js'
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

function Row({ to, href, Icon, tone, label, aside, chevron = !aside }) {
  const content = (
    <>
      <span className={`icon-tile sm ${tone ?? ''}`}><Icon width={16} height={16} /></span>
      <span className="grow">{label}</span>
      {aside && <small>{aside}</small>}
      {chevron && <ChevronIcon width={16} height={16} />}
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

// The Me tab: you, your bookings, the two things you can book (kids workshops and catering), and how to
// visit or contact PastaMania.
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

  const openNow = branches.filter((b) => openStatus(b, now)?.state === 'open').length
  const nextSession = upcomingSessions(now)[0]

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
          <h2 className="block-title cd">Book with us</h2>
          <div className="book-tiles">
            <Link to="/book" className="book-tile kids grain">
              <img src={workshop.image} alt="" />
              <span className="eyebrow">Kids workshop</span>
              <strong className="cd">Little chefs, real pizza</strong>
              <small>
                <span>Ages {workshop.minAge}–{workshop.maxAge}</span> · <span>{formatLKR(workshop.pricePerChild)}</span>
                {nextSession && <><br />Next: {formatSessionDate(nextSession)}</>}
              </small>
              <span className="book-cta">Book a seat <ArrowIcon width={16} height={16} /></span>
            </Link>
            <Link to="/catering" className="book-tile catering">
              <img src="/images/promo/double-penne.jpg" alt="" />
              <span className="eyebrow">Event catering</span>
              <strong className="cd">Pasta for your party</strong>
              <small>Birthdays, offices and celebrations</small>
              <span className="book-cta">Get a quote <ArrowIcon width={16} height={16} /></span>
            </Link>
          </div>
        </section>

        <section className="block rise" style={{ '--i': 4 }}>
          <h2 className="block-title cd">Visit &amp; contact</h2>
          <ul className="list-card card">
            <Row to="/branches" Icon={PinIcon} label="Branches & hours" aside={openNow > 0 ? `${openNow} open now` : `${branches.length} in Colombo`} chevron />
            <Row href={`tel:${brand.phone}`} Icon={CallIcon} tone="green" label="Call us" aside={formatPhone(brand.phone)} />
            <Row href={`mailto:${brand.email}`} Icon={MailIcon} tone="gold" label="Email us" />
            <Row href={brand.socials.instagram} Icon={InstagramIcon} label="Instagram" aside="@pastamaniasrilanka" />
          </ul>
        </section>

        <div className="me-foot rise" style={{ '--i': 5 }}>
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
