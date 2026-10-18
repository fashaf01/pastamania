import { useState } from 'react'
import { brand } from '../data/brand.js'
import { events } from '../data/events.js'
import { formatPhone } from '../lib/format.js'

const EMPTY = { name: '', phone: '', date: '', guests: '', location: '', notes: '' }

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

export default function Events() {
  const [form, setForm] = useState(EMPTY)
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
    <div className="container page">
      <h1 className="page-title retro retro-red">Events & experiences</h1>

      <div className="event-grid">
        {events.map((ev) => (
          <article key={ev.id} className="event-card">
            <div className="event-card-head">
              <span className="event-icon" aria-hidden="true">{ev.icon}</span>
              <span className="tag">{ev.tag}</span>
            </div>
            <h2>{ev.title}</h2>
            <p>{ev.description}</p>
            {ev.details.length > 0 && (
              <ul className="ticks">
                {ev.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
            <a
              className="btn btn-primary"
              href={ev.cta.href}
              {...(ev.cta.href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
            >
              {ev.cta.label}
            </a>
          </article>
        ))}
      </div>

      <section id="enquiry" className="enquiry">
        <h2>Catering enquiry</h2>
        <p className="muted">
          Tell us about your event and our team will get back to you. Prefer to talk? Call{' '}
          <a className="link" href={`tel:${brand.cateringPhone}`}>{formatPhone(brand.cateringPhone)}</a>.
        </p>
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
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">Send by email</button>
            {brand.whatsapp && (
              <button type="button" className="btn btn-whatsapp" onClick={whatsapp} disabled={!form.name || !form.phone}>
                Send on WhatsApp
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  )
}
