import { Link, Navigate, useNavigate } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { BowlIcon, CallIcon, CameraIcon, ChefIcon, ChevronIcon, InstagramIcon, MailIcon, MoonIcon, PhoneDeviceIcon, PinIcon, ReceiptIcon, SunIcon } from '../components/Icons.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { formatMemberCode, formatMonthYear, formatPhone, formatPoints } from '../lib/format.js'
import { DARK_MODE, useTheme } from '../lib/theme.jsx'
import { BUILD_ID } from '../lib/updates.js'

const MODES = [
  { id: 'light', label: 'Light', Icon: SunIcon },
  { id: 'dark', label: 'Dark', Icon: MoonIcon },
  { id: 'system', label: 'System', Icon: PhoneDeviceIcon },
]

// '0771234567' -> '+94 77 123 4567'
const displayPhone = (phone = '') => formatPhone(phone.replace(/^0/, '+94'))

const displayBirthday = (iso) => (iso ? new Date(`${iso}T00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : 'Not set')

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

export default function Profile() {
  const { member, balance, signOut } = useClub()
  const { mode, setMode } = useTheme()
  const navigate = useNavigate()

  if (!member) return <Navigate to="/join?next=/me" replace />

  const leave = () => {
    if (window.confirm('Sign out? Your points on this phone will be cleared.')) {
      signOut()
      navigate('/', { replace: true })
    }
  }

  return (
    <>
      <AppBar title="Profile" back="/" />
      <div className="profile">
        <div className="member-card card">
          <span className="avatar xl">{member.name.charAt(0).toUpperCase()}</span>
          <div>
            <strong>{member.name}</strong>
            <span>Member since {formatMonthYear(member.joinedAt)}</span>
            <span className="code" style={{ fontWeight: 600 }}>{formatMemberCode(member.id)}</span>
          </div>
          <span className="pill pill-gold" style={{ fontSize: 13, fontWeight: 800 }}>{formatPoints(balance)} pts</span>
        </div>

        {DARK_MODE && (
          <section>
            <h2 className="label-caps muted">Appearance</h2>
            <div className="segmented" role="radiogroup" aria-label="Appearance">
              {MODES.map(({ id, label, Icon }) => (
                <button key={id} type="button" role="radio" aria-checked={mode === id} onClick={() => setMode(id)}>
                  <Icon width={18} height={18} /> {label}
                </button>
              ))}
            </div>
            <span className="field-hint">System matches your phone’s light or dark setting.</span>
          </section>
        )}

        <section>
          <h2 className="label-caps muted">My details</h2>
          <dl className="list-card card">
            <div className="list-row"><dt className="key">Name</dt><dd className="value">{member.name}</dd></div>
            <div className="list-row"><dt className="key">Mobile</dt><dd className="value">{displayPhone(member.phone)}</dd></div>
            <div className="list-row"><dt className="key">Birthday</dt><dd className="value">{displayBirthday(member.birthday)}</dd></div>
          </dl>
        </section>

        <section>
          <h2 className="label-caps muted">More</h2>
          <ul className="list-card card">
            <Row to="/history" Icon={ReceiptIcon} tone="gold" label="Points history" />
            <Row to="/branches" Icon={PinIcon} label="Branches & hours" />
            <Row to="/book" Icon={ChefIcon} label="Kids workshops" />
            <Row to="/catering" Icon={BowlIcon} label="Event catering" />
            <Row href={`tel:${brand.phone}`} Icon={CallIcon} label="Call us" aside={formatPhone(brand.phone)} />
            <Row href={`mailto:${brand.email}`} Icon={MailIcon} label="Email us" aside="Email" />
            <Row href={brand.socials.instagram} Icon={InstagramIcon} label="Instagram" aside="@pastamaniasrilanka" />
          </ul>
        </section>

        <section>
          <h2 className="label-caps muted">For staff</h2>
          <ul className="list-card card">
            <li>
              <Link className="list-row" to="/staff">
                <span className="icon-tile sm ink"><CameraIcon width={16} height={16} /></span>
                <span className="grow">Counter screen</span>
                <span className="pill pill-soft">Staff only</span>
              </Link>
            </li>
          </ul>
        </section>

        <div className="stack" style={{ alignItems: 'center', gap: 4 }}>
          <button type="button" className="text-btn danger" onClick={leave}>Sign out</button>
          <p className="version">PastaMania Club · version {BUILD_ID}</p>
        </div>
      </div>
    </>
  )
}
