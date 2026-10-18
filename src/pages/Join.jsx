import { useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { club } from '../data/club.js'

// Only allow in-app paths as the post-join destination.
const safeNext = (next) => (next && next.startsWith('/') && !next.startsWith('//') ? next : '/')

// Accepts 0771234567, 077 123 4567, +94 77 123 4567 … and returns 0771234567, or null if invalid.
const normalisePhone = (value) => {
  const digits = value.replace(/[\s-]/g, '').replace(/^\+94/, '0')
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
      <AppBar title="Join free" back="/" />
      <div className="pad">
        <p className="lead">
          Get <strong>{club.welcomeBonus} points</strong> today – that’s a free Garlic Bread. Then earn 1 point for every LKR{' '}
          {club.spendPerPoint} you spend.
        </p>
        <form className="form" onSubmit={submit}>
          <label>
            <span className="label">Name</span>
            <input required value={form.name} onChange={update('name')} autoComplete="name" />
          </label>
          <label>
            <span className="label">Mobile number</span>
            <input
              required
              type="tel"
              inputMode="tel"
              placeholder="07X XXX XXXX"
              value={form.phone}
              onChange={(e) => {
                setPhoneError(false)
                update('phone')(e)
              }}
              autoComplete="tel"
              aria-invalid={phoneError}
            />
            {phoneError && <span className="field-error">Enter a Sri Lankan mobile number, e.g. 077 123 4567</span>}
          </label>
          <label>
            <span className="label">
              Birthday <span className="muted">(optional)</span>
            </span>
            <input type="date" value={form.birthday} onChange={update('birthday')} autoComplete="bday" />
          </label>
          <button type="submit" className="btn btn-primary btn-block">Join & get my Garlic Bread</button>
          <p className="footnote">In the live app your number is confirmed with an SMS code.</p>
        </form>
      </div>
    </>
  )
}
