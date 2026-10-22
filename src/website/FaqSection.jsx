import { useState } from 'react'
import { PlusIcon } from '../components/Icons.jsx'
import { brand } from '../data/brand.js'
import { club, rewards } from '../data/club.js'
import { fridayMania } from '../data/offers.js'
import { formatPhone } from '../lib/format.js'

const FAQS = [
  {
    q: `How do I join ${club.name}?`,
    a: `Open PastaMania on your phone and tap Join free. You get ${club.welcomeBonus} points straight away, enough for a ${rewards[0].name}.`,
  },
  {
    q: 'Do delivery orders earn points?',
    a: "No. Orders through Uber Eats and PickMe don't earn points. Dine in or take away and show your code when you pay.",
  },
  {
    q: 'How do I use a reward?',
    a: `Get the reward with your points in the app. It becomes a voucher with its own QR code. Show it at the counter within ${club.voucherValidDays} days.`,
  },
  {
    q: 'Which dish is on FridayMania this week?',
    a: `This Friday it's the ${fridayMania.heroDish}: buy one, get one free for dine-in, takeaway and delivery.`,
  },
  {
    q: 'Do you cater for parties and offices?',
    a: `Yes. Call the catering team on ${formatPhone(brand.cateringPhone)} and they'll plan the order with you.`,
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="w-faq w-grain">
      <div className="w-wrap w-fgrid">
        <div className="w-rv" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="w-cd" style={{ fontSize: 'clamp(64px, 8vw, 130px)' }}>Got</span>
            <span className="w-slab" style={{ fontSize: 'clamp(40px, 4.6vw, 72px)', color: 'var(--gold)', textShadow: '3px 4px 0 var(--out)' }}>
              questions?
            </span>
          </h2>
          <p style={{ fontSize: 17, color: 'rgb(255 246 234 / 0.8)', maxWidth: 360 }}>
            Still stuck? Email <strong>{brand.email}</strong> or call{' '}
            <strong style={{ fontVariantNumeric: 'tabular-nums' }}>{formatPhone(brand.phone)}</strong>.
          </p>
        </div>
        <div className="w-qas">
          {FAQS.map((f, i) => (
            <div key={f.q} className="w-qa" data-open={open === i}>
              <button
                type="button"
                className="w-q"
                id={`w-q-${i}`}
                aria-expanded={open === i}
                aria-controls={`w-a-${i}`}
                onClick={() => setOpen(open === i ? -1 : i)}
              >
                <span>{f.q}</span>
                <span className="w-x"><PlusIcon width={18} height={18} strokeWidth={2.8} /></span>
              </button>
              <div className="w-a" id={`w-a-${i}`} role="region" aria-labelledby={`w-q-${i}`} aria-hidden={open !== i}>
                <div><p>{f.a}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
