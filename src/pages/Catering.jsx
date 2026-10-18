import { useState } from 'react'
import AppBar from '../components/AppBar.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { events } from '../data/events.js'
import { formatPhone } from '../lib/format.js'

const buildMessage = (f) =>
  [
    'Hi PastaMania, I would like to enquire about event catering.',
    '',
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Event date: ${f.date || 'TBC'}`,
    `Guests: ${f.guests || 'TBC'}`,
    `Location: ${f.location || 'TBC'}`,
    f.notes ? `Details: ${f.notes}` : null,
  ]
    .filter((line) => line !== null)
    .join('\n')

export default function Catering() {
  const { member } = useClub()
  const catering = events.find((e) => e.id === 'catering')
  const [form, setForm] = useState({
    name: member?.name ?? '',
    phone: member?.phone ?? '',
    date: '',
    guests: '',
    location: '',
    notes: '',
  })
  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const body = encodeURIComponent(buildMessage(form))
    const subject = encodeURIComponent(`Catering enquiry – ${form.name}`)
    window.location.href = `mailto:${brand.email}?subject=${subject}&body=${body}`
  }

  const whatsapp = () => {
    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(buildMessage(form))}`, '_blank')
  }

  return (
    <>
      <AppBar title="Event catering" back />
      <div className="screen-pad">
        <section className="panel">
          <span className="event-icon" aria-hidden="true">{catering.icon}</span>
          <h2 className="retro retro-red">{catering.title}</h2>
          <p>{catering.description}</p>
          <ul className="ticks">
            {catering.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <p className="muted small">
            Prefer to talk? Call <a className="link" href={`tel:${brand.cateringPhone}`}>{formatPhone(brand.cateringPhone)}</a>.
          </p>
        </section>

        <form onSubmit={submit} className="form">
          <label>
            Your name
            <input required value={form.name} onChange={update('name')} autoComplete="name" />
          </label>
          <label>
            Phone
            <input required type="tel" value={form.phone} onChange={update('phone')} autoComplete="tel" placeholder="07X XXX XXXX" />
          </label>
          <div className="form-row">
            <label>
              Event date
              <input type="date" value={form.date} onChange={update('date')} />
            </label>
            <label>
              Guests
              <input type="number" min="1" value={form.guests} onChange={update('guests')} />
            </label>
          </div>
          <label>
            Event location
            <input value={form.location} onChange={update('location')} placeholder="e.g. Colombo 05" />
          </label>
          <label>
            Anything else?
            <textarea rows="3" value={form.notes} onChange={update('notes')} placeholder="Occasion, live pasta station, dietary needs…" />
          </label>
          <button type="submit" className="btn btn-primary btn-block">Send enquiry by email</button>
          {brand.whatsapp && (
            <button type="button" className="btn btn-whatsapp btn-block" onClick={whatsapp} disabled={!form.name || !form.phone}>
              Send on WhatsApp
            </button>
          )}
        </form>
      </div>
    </>
  )
}
