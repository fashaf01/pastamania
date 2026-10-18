import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { club, tiers } from '../data/club.js'

// Only allow in-app paths as the post-join destination.
const safeNext = (next) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/card')

export default function Join() {
  const { member, join } = useClub()
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [form, setForm] = useState({ name: '', phone: '', email: '', birthday: '' })
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  if (member) return <Navigate to={next} replace />

  const submit = (e) => {
    e.preventDefault()
    join({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || null,
      birthday: form.birthday || null,
    })
    toast(`Welcome! ${club.welcomeBonus} points added`)
    navigate(next, { replace: true })
  }

  return (
    <>
      <AppBar title={`Join the Club`} back />
      <div className="screen-pad">
        <section className="join-hero red-paper">
          <img src={brand.logo} alt="" width="84" height="84" />
          <h2 className="retro retro-gold">{club.name}</h2>
          <p className="caps-white">{club.welcomeBonus} welcome points</p>
          <ul className="ticks join-perks">
            {tiers[0].perks.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>

        <form className="form" onSubmit={submit}>
          <label>
            Full name
            <input required value={form.name} onChange={update('name')} autoComplete="name" />
          </label>
          <label>
            Mobile number
            <input
              required
              type="tel"
              inputMode="tel"
              pattern="^(\+94|0)7\d{8}$"
              title="Sri Lankan mobile, e.g. 0771234567"
              placeholder="07X XXX XXXX"
              value={form.phone}
              onChange={update('phone')}
              autoComplete="tel"
            />
          </label>
          <label>
            Email <span className="optional">optional</span>
            <input type="email" value={form.email} onChange={update('email')} autoComplete="email" />
          </label>
          <label>
            Birthday <span className="optional">for your birthday treat</span>
            <input type="date" value={form.birthday} onChange={update('birthday')} autoComplete="bday" />
          </label>
          <button type="submit" className="btn btn-primary btn-block">Join & get {club.welcomeBonus} points</button>
          <p className="muted small center">In the live app we’ll verify your number with a one-time SMS code.</p>
        </form>
      </div>
    </>
  )
}
