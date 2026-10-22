import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { PageHead } from '../components/AppBar.jsx'
import { BowlIcon, CallIcon, ChefIcon, ChevronIcon, CopyIcon, InstagramIcon, MailIcon, PinIcon } from '../components/Icons.jsx'
import Sheet, { useSheetClose } from '../components/Sheet.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { daysUntil, formatMemberCode, formatMonthYear, formatPhone, formatPoints, monthShort, weekdayShort } from '../lib/format.js'
import { BUILD_ID } from '../lib/updates.js'

const todayKey = () => new Date().toISOString().slice(0, 10)

const whenLabel = (days) => (days <= 0 ? 'Today' : days === 1 ? 'Tomorrow' : `In ${days} days`)

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
  const { member, balance, bookings, signOut } = useClub()
  const toast = useToast()
  const navigate = useNavigate()
  const [leaving, setLeaving] = useState(false)

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
      <PageHead title="Me" />
      <div className="me">
        <section className="profile-card card rise">
          <span className="avatar xl pop">{member.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{member.name}</strong>
            <span>
              Member since {formatMonthYear(member.joinedAt)} · {formatPoints(balance)} points
            </span>
            <button type="button" className="member-chip press" onClick={copyNumber} aria-label={`Copy member number ${formatMemberCode(member.id)}`}>
              {formatMemberCode(member.id)} <CopyIcon width={14} height={14} />
            </button>
          </div>
        </section>

        {upcoming.length > 0 && (
          <section className="group rise" style={{ '--i': 1 }}>
            <h2 className="section-title">My bookings</h2>
            {upcoming.map((b) => {
              const when = new Date(`${b.session.date}T${b.session.time}`)
              return (
                <Link key={b.ref} to={`/book/ticket/${b.ref}`} className="booking-row card">
                  <span className="date-tile poster">
                    <small>{monthShort(when)}</small>
                    <b>{when.getDate()}</b>
                  </span>
                  <span className="booking-text">
                    <strong>{workshop.title}</strong>
                    <span>
                      {weekdayShort(when)} · {formatSessionTime(b.session)} · {getBranch(b.session.branchId).shortName}
                    </span>
                  </span>
                  <span className="pill pill-gold">{whenLabel(daysUntil(when.getTime()))}</span>
                </Link>
              )
            })}
          </section>
        )}

        <section className="group rise" style={{ '--i': 2 }}>
          <h2 className="section-title">Visit us</h2>
          <ul className="list-card card">
            <Row to="/branches" Icon={PinIcon} label="Branches & opening hours" />
            <Row to="/book" Icon={ChefIcon} tone="gold" label="Kids workshops" />
            <Row to="/catering" Icon={BowlIcon} tone="green" label="Event catering" />
          </ul>
        </section>

        <section className="group rise" style={{ '--i': 3 }}>
          <h2 className="section-title">Get in touch</h2>
          <ul className="list-card card">
            <Row href={`tel:${brand.phone}`} Icon={CallIcon} label="Call us" aside={formatPhone(brand.phone)} />
            <Row href={`mailto:${brand.email}`} Icon={MailIcon} label="Email us" />
            <Row href={brand.socials.instagram} Icon={InstagramIcon} label="Instagram" aside="@pastamaniasrilanka" />
          </ul>
        </section>

        <div className="me-foot rise" style={{ '--i': 4 }}>
          <button type="button" className="text-btn danger" onClick={() => setLeaving(true)}>Sign out</button>
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
