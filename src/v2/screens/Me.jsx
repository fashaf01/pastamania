import { Link, useNavigate } from 'react-router-dom'
import { BagIcon, CalendarIcon, CallIcon, ChevronIcon, PinIcon, TicketIcon } from '../../components/Icons.jsx'
import { useToast } from '../../components/Toast.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { getBranch } from '../../data/branches.js'
import { brand } from '../../data/brand.js'
import { rewards } from '../../data/club.js'
import { formatDay, formatMemberCode, formatPhone } from '../../lib/format.js'
import { getPartyType } from '../config.js'
import { useV2 } from '../store.jsx'
import { CakeIcon, ShareIcon, useBranch } from '../ui.jsx'

function Row({ to, href, icon: Icon, gold, title, note }) {
  const inner = (
    <>
      <span className={`v2-list-icon ${gold ? 'gold' : ''}`}><Icon width={20} height={20} /></span>
      <span className="v2-grow">
        <span className="v2-body v2-strong">{title}</span>
        <span className="v2-small v2-muted">{note}</span>
      </span>
      <ChevronIcon width={20} height={20} style={{ color: 'var(--muted)' }} />
    </>
  )
  if (to) return <Link to={to} className="v2-list-item">{inner}</Link>
  return <a href={href} className="v2-list-item" target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{inner}</a>
}

export default function Me() {
  const club = useClub()
  const v2 = useV2()
  const toast = useToast()
  const navigate = useNavigate()
  const [branch] = useBranch()
  const member = club.member
  const mine = member ? v2.requests.filter((r) => r.memberId === member.id) : []

  const invite = async () => {
    const url = `${window.location.origin}/v2/join?ref=${member.id}`
    const text = `Join the PastaMania Club with my link and your first ${rewards[0].name} is free.`
    try {
      if (navigator.share) await navigator.share({ title: 'PastaMania Club', text, url })
      else {
        await navigator.clipboard.writeText(`${text} ${url}`)
        toast('Link copied. Send it to a friend!')
      }
    } catch {
      // the share sheet was closed
    }
  }

  const signOut = () => {
    if (window.confirm('Sign out of the PastaMania Club on this phone?')) {
      club.signOut()
      navigate('/v2')
    }
  }

  return (
    <>
      <header className="v2-head sm" style={{ gap: 14, paddingBottom: 22, borderRadius: '0 0 34px 34px' }}>
        <span className="v2-avatar lg" aria-hidden="true">{member ? member.name.trim()[0]?.toUpperCase() : 'P'}</span>
        <div className="v2-grow" style={{ gap: 4 }}>
          <h1 className="v2-cd" style={{ fontSize: 34, lineHeight: '32px' }}>{member ? member.name : 'Welcome'}</h1>
          <span className="v2-small">{member ? `Member ${formatMemberCode(member.id)}` : 'Join free to collect points'}</span>
        </div>
      </header>

      <main className="v2-main" style={{ gap: 16 }}>
        {member ? (
          <section className="v2-poster" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 14, padding: '18px 18px 22px' }}>
            <div className="v2-stack" style={{ gap: 4 }}>
              <h2 className="v2-cd" style={{ fontSize: 34, lineHeight: '32px' }}>Invite a friend</h2>
              <p className="v2-body" style={{ color: '#ffe9dc' }}>Send your link. Friends who join get a free {rewards[0].name} on their first visit.</p>
            </div>
            <button type="button" className="v2-btn v2-btn-gold v2-btn-block" onClick={invite}>
              <ShareIcon width={18} height={18} />
              Share my invite link
            </button>
          </section>
        ) : (
          <Link to="/v2/join" className="v2-btn v2-btn-red v2-btn-lg v2-btn-block">Join free</Link>
        )}

        <section className="v2-stack">
          <h2 className="v2-cd v2-section">Book with us</h2>
          <div className="v2-list">
            {v2.switches.parties && <Row to="/v2/celebrate" icon={CakeIcon} title="Celebrate with us" note="Kids parties, office lunch, catering" />}
            <Row to="/book" icon={CalendarIcon} title="Kids pizza workshop" note="Dough Workz sessions and tickets" />
          </div>
        </section>

        {mine.length > 0 && (
          <section className="v2-stack">
            <h2 className="v2-cd v2-section">My requests</h2>
            <div className="v2-list">
              {mine.map((r) => (
                <div key={r.id} className="v2-list-item">
                  <span className="v2-list-icon gold"><TicketIcon width={20} height={20} /></span>
                  <span className="v2-grow">
                    <span className="v2-body v2-strong">{r.title}</span>
                    <span className="v2-small v2-muted">
                      {formatDay(`${r.date}T12:00`)} · {r.count} {getPartyType(r.type).unit} · {getBranch(r.branchId)?.shortName}
                    </span>
                  </span>
                  <span className={`v2-tag ${r.status === 'confirmed' ? 'gold' : ''}`} style={{ alignSelf: 'center' }}>{r.status === 'confirmed' ? 'Confirmed' : 'Sent'}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="v2-stack">
          <h2 className="v2-cd v2-section">PastaMania</h2>
          <div className="v2-list">
            <Row to="/branches" icon={PinIcon} title="Branches and hours" note="Havelock, Alfred House, One Galle Face" />
            <Row href={branch.uberEatsUrl} icon={BagIcon} title="Order delivery" note="Uber Eats · delivery doesn’t earn points" />
            <Row href={`tel:${brand.phone}`} icon={CallIcon} title="Call us" note={formatPhone(brand.phone)} />
          </div>
        </section>

        {member && (
          <button type="button" className="v2-btn v2-btn-ghost" onClick={signOut} style={{ color: 'var(--muted)' }}>Sign out</button>
        )}
      </main>
    </>
  )
}
