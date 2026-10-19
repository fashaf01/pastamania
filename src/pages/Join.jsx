import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { club } from '../data/club.js'

// Only allow in-app paths as the post-join destination.
const safeNext = (next) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/')

// Accepts 771234567, 0771234567, 077 123 4567, +94 77 123 4567 … and returns 0771234567, or null if invalid.
const normalisePhone = (value) => {
  const digits = value.replace(/[\s-]/g, '').replace(/^\+94/, '0').replace(/^(7\d{8})$/, '0$1')
  return /^07\d{8}$/.test(digits) ? digits : null
}

export default function Join() {
  const { member, join } = useClub()
  const navigate = useNavigate()
  const toast = useToast()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [form, setForm] = useState({ name: '', phone: '', birthday: '' })
  const [phoneError, setPhoneError] = useState(false)
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  if (member) return <Navigate to={next} replace />

  const submit = (e) => {
    e.preventDefault()
    const phone = normalisePhone(form.phone)
    if (!phone) {
      setPhoneError(true)
      return
    }
    join({ name: form.name.trim(), phone, birthday: form.birthday || null })
    toast('Welcome! Your free Garlic Bread is ready')
    navigate(next, { replace: true })
  }

  return (
    <>
      <AppBar title="" back="/" />
      <div className="join">
        <div className="stack" style={{ gap: 6 }}>
          <h1 className="title-xl">Join the Club</h1>
          <p className="muted">It takes 30 seconds. No card to carry – your phone is your card.</p>
        </div>

        <div className="gift-card">
          <img src="/images/menu/garlic-bread.jpg" alt="" />
          <div>
            <span className="eyebrow">Welcome gift</span>
            <strong>Free Garlic Bread</strong>
            <span>{club.welcomeBonus} points the moment you join</span>
          </div>
        </div>

        <form className="form" onSubmit={submit}>
          <label className="field">
            <span className="field-label">Name</span>
            <input className="input" required value={form.name} onChange={update('name')} autoComplete="name" placeholder="Your full name" />
          </label>
          <div className="field">
            <label className="field-label" htmlFor="join-phone">Mobile number</label>
            <div className="input-group">
              <span>+94</span>
              <input
                id="join-phone"
                required
                type="tel"
                inputMode="tel"
                placeholder="77 123 4567"
                value={form.phone}
                onChange={(e) => {
                  setPhoneError(false)
                  update('phone')(e)
                }}
                autoComplete="tel-national"
                aria-invalid={phoneError}
                aria-describedby="join-phone-hint"
              />
            </div>
            {phoneError ? (
              <span id="join-phone-hint" className="field-error">Enter a Sri Lankan mobile number, e.g. 77 123 4567</span>
            ) : (
              <span id="join-phone-hint" className="field-hint">Staff can also find you by this number at the counter.</span>
            )}
          </div>
          <label className="field">
            <span className="field-label">
              Birthday <span className="muted">(optional)</span>
            </span>
            <input className="input" type="date" value={form.birthday} onChange={update('birthday')} autoComplete="bday" />
          </label>
          <button type="submit" className="btn btn-red btn-lg btn-block">Join &amp; get my Garlic Bread</button>
          <p className="footnote center">In the live app your number is confirmed with an SMS code.</p>
        </form>
      </div>
    </>
  )
}
