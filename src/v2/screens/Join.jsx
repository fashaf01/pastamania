import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useToast } from '../../components/Toast.jsx'
import { useClub } from '../../context/ClubContext.jsx'
import { rewards } from '../../data/club.js'
import { BackButton, Logo } from '../ui.jsx'

const gift = rewards[0]

// Accepts 771234567, 0771234567, 077 123 4567, +94 77 123 4567 … and returns 0771234567, or null (as the old Join).
const normalisePhone = (value) => {
  const digits = value.replace(/[\s-]/g, '').replace(/^\+94/, '0').replace(/^(7\d{8})$/, '0$1')
  return /^07\d{8}$/.test(digits) ? digits : null
}

export default function Join() {
  const { member, join } = useClub()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', phone: '', birthday: '' })
  const [error, setError] = useState(null)
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  if (member) return <Navigate to="/v2" replace />

  const submit = (e) => {
    e.preventDefault()
    if (!form.name.trim()) return setError('Add your name.')
    const phone = normalisePhone(form.phone)
    if (!phone) return setError('Enter a Sri Lankan mobile number, like 077 123 4567.')
    join({ name: form.name.trim(), phone, birthday: form.birthday || null })
    toast(`Welcome! Your free ${gift.name} is ready`)
    navigate('/v2', { replace: true })
  }

  return (
    <>
      <header className="v2-head" style={{ gap: 14 }}>
        <div className="v2-head-row">
          <BackButton to="/v2" />
          <Logo />
        </div>
        <span className="v2-eyebrow">PastaMania Club</span>
        <h1 className="v2-cd" style={{ fontSize: 48, lineHeight: '44px' }}>Join the Club</h1>
        <p className="v2-body">It takes 30 seconds. No card to carry: your phone is your card.</p>
      </header>
      <main className="v2-main" style={{ gap: 16 }}>
        <section className="v2-ticket">
          <img className="v2-ticket-img" src={gift.image} alt="" />
          <span className="v2-grow" style={{ gap: 3 }}>
            <span className="v2-eyebrow">Welcome gift</span>
            <strong className="v2-cd v2-ticket-name">Free {gift.name}</strong>
            <span className="v2-small v2-strong">Ready the moment you join</span>
          </span>
        </section>
        <form className="v2-card v2-pad v2-stack-lg" onSubmit={submit} noValidate>
          <label className="v2-field">
            <span>Name</span>
            <input className="v2-input" value={form.name} onChange={update('name')} autoComplete="name" required />
          </label>
          <label className="v2-field">
            <span>Mobile</span>
            <input className="v2-input" type="tel" inputMode="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" placeholder="077 123 4567" required />
          </label>
          <label className="v2-field">
            <span>Birthday (optional, for a birthday treat)</span>
            <input className="v2-input" type="date" value={form.birthday} onChange={update('birthday')} />
          </label>
          {error && <p className="v2-error" role="alert">{error}</p>}
          <button type="submit" className="v2-btn v2-btn-red v2-btn-lg v2-btn-block">Join free</button>
        </form>
      </main>
    </>
  )
}
