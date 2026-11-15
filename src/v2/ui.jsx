import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { BackIcon, ChevronIcon, CloseIcon, GiftIcon, HomeIcon, MenuIcon, PinIcon, UserIcon } from '../components/Icons.jsx'
import QRCode from '../components/QRCode.jsx'
import { branches, getBranch } from '../data/branches.js'
import { brand } from '../data/brand.js'
import { loadBranchId, saveBranchId } from '../lib/format.js'

const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }

export const TagIcon = (p) => (
  <svg {...base} {...p}><path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" /><circle cx="7.5" cy="7.5" r="1" /></svg>
)
export const BoltIcon = (p) => (
  <svg {...base} {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" /></svg>
)
export const ShareIcon = (p) => (
  <svg {...base} {...p}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" /></svg>
)
export const TrendIcon = (p) => (
  <svg {...base} {...p}><path d="M22 7 13.5 15.5l-5-5L2 17M16 7h6v6" /></svg>
)
export const ScanIcon = (p) => (
  <svg {...base} {...p}><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10" /></svg>
)
export const PassIcon = (p) => (
  <svg {...base} {...p}><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" /></svg>
)
export const CakeIcon = (p) => (
  <svg {...base} {...p}><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1M2 21h20M7 8v3M12 8v3M17 8v3M7 4h.01M12 4h.01M17 4h.01" /></svg>
)
export const BriefcaseIcon = (p) => (
  <svg {...base} {...p}><rect width="20" height="14" x="2" y="7" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
)
export const StarShape = (p) => (
  <svg {...base} strokeWidth={1.6} {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
)
export const QrSmallIcon = (p) => (
  <svg {...base} strokeWidth={2.2} {...p}><rect width="5" height="5" x="3" y="3" rx="1" /><rect width="5" height="5" x="16" y="3" rx="1" /><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1" /></svg>
)

// The branch the guest picked, shared with the old app so both remember the same one.
export function useBranch() {
  const [id, setId] = useState(() => (getBranch(loadBranchId()) ? loadBranchId() : 'havelock'))
  const choose = (next) => {
    setId(next)
    saveBranchId(next)
  }
  return [getBranch(id), choose]
}

export function BranchPick({ branch, onChange, only }) {
  const list = only ? branches.filter((b) => only.includes(b.id)) : branches
  return (
    <label className="v2-pick">
      <PinIcon width={18} height={18} />
      <span>{branch.shortName}</span>
      <ChevronIcon width={16} height={16} style={{ rotate: '90deg' }} />
      <select value={branch.id} onChange={(e) => onChange(e.target.value)} aria-label="Branch">
        {list.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
    </label>
  )
}

// Back to where you came from, or to `fallback` when the screen was opened directly.
export function useBackTo(fallback) {
  const navigate = useNavigate()
  return () => (window.history.state?.idx > 0 ? navigate(-1) : navigate(fallback))
}

export function BackButton({ to = '/v2', label = 'Back', close = false }) {
  const back = useBackTo(to)
  return (
    <button type="button" className="v2-round" onClick={back} aria-label={label}>
      {close ? <CloseIcon width={20} height={20} /> : <BackIcon width={22} height={22} />}
    </button>
  )
}

// Wine header for pushed screens: back button and a title.
export function SubHead({ title, back = '/v2', sub, close = false, children }) {
  return (
    <header className="v2-head sm">
      <BackButton to={back} close={close} label={close ? 'Close' : 'Back'} />
      <div className="v2-grow" style={{ gap: 2 }}>
        <h1 className="v2-cd" style={{ fontSize: 30, lineHeight: '28px' }}>{title}</h1>
        {sub && <span className="v2-small">{sub}</span>}
      </div>
      {children}
    </header>
  )
}

export function Burst({ size = 52, tilt = 10, fontSize = 18, children, style }) {
  return (
    <span className="v2-burst" style={{ width: size, height: size, fontSize, '--tilt': `${tilt}deg`, ...style }}>
      <span>{children}</span>
    </span>
  )
}

export function MemberQr({ value, size = 160, label = 'Your member code' }) {
  return (
    <span className="v2-qr">
      <QRCode value={value} size={size} label={label} />
    </span>
  )
}

export const Logo = ({ className = 'v2-logo' }) => <img className={className} src={brand.logo} alt="PastaMania" />

const TABS = [
  { to: '/v2', label: 'Home', Icon: HomeIcon, end: true },
  { to: '/v2/menu', label: 'Menu', Icon: MenuIcon },
  { to: '/v2/deals', label: 'Deals', Icon: TagIcon },
  { to: '/v2/rewards', label: 'Rewards', Icon: GiftIcon },
  { to: '/v2/me', label: 'Me', Icon: UserIcon },
]

export function TabBar({ dots = {} }) {
  return (
    <nav className="v2-tabbar" aria-label="Main">
      {TABS.map(({ to, label, Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => `v2-tab ${isActive ? 'active' : ''}`}>
          <span className="v2-tab-icon">
            <Icon width={24} height={24} />
            {dots[label] > 0 && <span className="v2-tab-dot" />}
          </span>
          <span>
            {label}
            {dots[label] > 0 && <span className="sr-only">, {dots[label]} ready</span>}
          </span>
        </NavLink>
      ))}
    </nav>
  )
}
