import { useState } from 'react'
import AppBar from '../components/AppBar.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { formatPhone } from '../lib/format.js'

const buildMessage = (f) =>
  [
    'Hi PastaMania, I would like to enquire about event catering.',
    '',
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Event date: ${f.date || 'TBC'}`,
    `Guests: ${f.guests || 'TBC'}`,
    f.notes ? `Details: ${f.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')

export default function Catering() {
  const { member } = useClub()
  const [form, setForm] = useState({ name: member?.name ?? '', phone: member?.phone ?? '', date: '', guests: '', notes: '' })
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Catering enquiry – ${form.name}`)
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${encodeURIComponent(buildMessage(form))}`
  }

  return (
    <>
      <AppBar title="Event catering" back="/me" />
      <div className="page">
        <p className="lead">
          PastaMania food and a live pasta station for birthdays, office parties and celebrations. Tell us about your event, or call{' '}
          <a className="link" href={`tel:${brand.cateringPhone}`}>{formatPhone(brand.cateringPhone)}</a>.
        </p>
        <form onSubmit={submit} className="form">
          <label className="field">
            <span className="field-label">Name</span>
            <input className="input" required value={form.name} onChange={update('name')} autoComplete="name" />
          </label>
          <label className="field">
            <span className="field-label">Phone</span>
            <input className="input" required type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" />
          </label>
          <div className="form-row">
            <label className="field">
              <span className="field-label">Date</span>
              <input className="input" type="date" value={form.date} onChange={update('date')} />
            </label>
            <label className="field">
              <span className="field-label">Guests</span>
              <input className="input" type="number" min="1" value={form.guests} onChange={update('guests')} />
            </label>
          </div>
          <label className="field">
            <span className="field-label">Details</span>
            <textarea className="input" rows="3" value={form.notes} onChange={update('notes')} placeholder="Occasion, location, dietary needs…" />
          </label>
          <button type="submit" className="btn btn-red btn-lg btn-block">Send enquiry</button>
        </form>
      </div>
    </>
  )
}
