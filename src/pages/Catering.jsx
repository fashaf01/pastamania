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
      <AppBar title="Event catering" back="/book" />
      <div className="pad">
        <p className="lead">
          PastaMania food and a live pasta station for birthdays, office parties and celebrations. Tell us about your event, or call{' '}
          <a className="link" href={`tel:${brand.cateringPhone}`}>{formatPhone(brand.cateringPhone)}</a>.
        </p>
        <form onSubmit={submit} className="form">
          <label>
            <span className="label">Name</span>
            <input required value={form.name} onChange={update('name')} autoComplete="name" />
          </label>
          <label>
            <span className="label">Phone</span>
            <input required type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" />
          </label>
          <div className="form-row">
            <label>
              <span className="label">Date</span>
              <input type="date" value={form.date} onChange={update('date')} />
            </label>
            <label>
              <span className="label">Guests</span>
              <input type="number" min="1" value={form.guests} onChange={update('guests')} />
            </label>
          </div>
          <label>
            <span className="label">Details</span>
            <textarea rows="3" value={form.notes} onChange={update('notes')} placeholder="Occasion, location, dietary needs…" />
          </label>
          <button type="submit" className="btn btn-primary btn-block">Send enquiry</button>
        </form>
      </div>
    </>
  )
}
