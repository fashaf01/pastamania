import { useEffect, useState } from 'react'
import QRCode from '../components/QRCode.jsx'
import { brand } from '../data/brand.js'
import { club, nextReward, pointsForSpend, rewards } from '../data/club.js'
import { menus } from '../data/menu.js'
import { formatLKR, formatPoints } from '../lib/format.js'

// The phone plays the app's three moments on a loop; the numbers on it are a sample member, not real data.
const SAMPLE_POINTS = 340
const SAMPLE_DINNER = 4580
const sampleNext = nextReward(SAMPLE_POINTS)
const sampleVisits = ['Carbonara Pasta', 'Jaffna Calamari Pasta'].map((name) => {
  const item = menus.havelock.find((i) => i.name === name)
  return { name, points: pointsForSpend(item.price) }
})
const voucher = rewards[0]

const STEPS = [
  { title: 'Show your code', text: 'The counter scans the QR code in your app when you pay.' },
  {
    title: 'Earn points',
    text: `1 point for every LKR ${club.spendPerPoint}. A ${formatLKR(SAMPLE_DINNER)} dinner for two earns ${pointsForSpend(SAMPLE_DINNER)}.`,
  },
  { title: 'Get free food', text: `Swap points for a voucher. It stays in the app for ${club.voucherValidDays} days.` },
]

function Phone({ step }) {
  return (
    <div className="w-phone" data-step={step}>
      <div className="w-notch" />
      <div className="w-scr w-s0">
        <div className="w-scr-top">
          <p className="w-eb" style={{ fontSize: 10, color: 'var(--gold2)' }}>My code</p>
          <p className="w-cd" style={{ fontSize: 34, paddingTop: 6 }}>Show this when you pay</p>
        </div>
        <div className="w-scr-body">
          <div className="w-qr">
            <QRCode value="PM12345678" size={176} level="H" label="Sample member code" />
            <img className="w-qr-logo" src={brand.logo} alt="" />
          </div>
          <p style={{ fontSize: 14, color: 'var(--muted)', textAlign: 'center' }}>The counter scans it and adds your points.</p>
          <span className="w-pill w-pts" style={{ fontSize: 15 }}>{formatPoints(SAMPLE_POINTS)} points</span>
        </div>
      </div>
      <div className="w-scr w-s1">
        <div className="w-scr-top" style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 24 }}>
          <p className="w-eb" style={{ fontSize: 10, color: 'var(--gold2)' }}>Your points</p>
          <p className="w-cd" style={{ fontSize: 92, color: 'var(--gold)', lineHeight: 0.85 }}>{formatPoints(SAMPLE_POINTS)}</p>
          <div className="w-pbar">
            <i style={{ width: `${(SAMPLE_POINTS / sampleNext.points) * 100}%` }} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600 }}>
            {sampleNext.points - SAMPLE_POINTS} more for {sampleNext.name}
          </p>
        </div>
        <div style={{ padding: '8px 22px', display: 'flex', flexDirection: 'column' }}>
          <p className="w-eb" style={{ fontSize: 10, color: '#8a5a00', paddingTop: 12 }}>Latest</p>
          {sampleVisits.map((v) => (
            <div key={v.name} className="w-hist"><span>{v.name}</span><b>+{v.points}</b></div>
          ))}
          <div className="w-hist"><span>Welcome bonus</span><b>+{club.welcomeBonus}</b></div>
        </div>
      </div>
      <div className="w-scr w-s2">
        <div style={{ padding: '64px 22px 18px' }}>
          <p className="w-eb" style={{ fontSize: 10, color: '#8a5a00' }}>Ready to use</p>
          <p className="w-cd" style={{ fontSize: 34, color: 'var(--red)', paddingTop: 6 }}>Your voucher</p>
        </div>
        <div className="w-ticket">
          <span className="w-stamp">It's yours!</span>
          <img src={voucher.image} alt="" />
          <p className="w-cd" style={{ fontSize: 38, paddingTop: 6 }}>{voucher.name}</p>
          <p style={{ fontSize: 14, fontWeight: 600, paddingTop: 14 }}>
            Show this voucher at the counter. Valid for {club.voucherValidDays} days.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ClubSection() {
  const [step, setStep] = useState(0)
  // Plays on its own until someone picks a step.
  const [auto, setAuto] = useState(true)

  useEffect(() => {
    if (!auto) return
    const id = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 4000)
    return () => clearInterval(id)
  }, [auto])

  return (
    <section id="club" className="w-club w-grain" data-auto={auto}>
      <div className="w-wrap w-club-in">
        <div className="w-cgrid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28, minWidth: 0 }}>
            <div className="w-rv" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p className="w-eb" style={{ color: 'var(--gold2)' }}>{club.name}</p>
              <h2 className="w-cd" style={{ fontSize: 'clamp(56px, 7vw, 108px)' }}>
                Your next pasta
                <br />
                <span style={{ color: 'var(--gold)' }}>is on us</span>
              </h2>
              <p style={{ fontSize: 19, color: 'rgb(255 246 234 / 0.85)', maxWidth: 520 }}>
                Join free in the app and {club.welcomeBonus} points land straight away. That's a {rewards[0].name} on
                your first visit.
              </p>
            </div>
            <ol className="w-steps" aria-label="How the Club works">
              {STEPS.map((s, i) => (
                <li key={s.title}>
                  <button
                    type="button"
                    className="w-step"
                    aria-pressed={i === step}
                    onClick={() => {
                      setStep(i)
                      setAuto(false)
                    }}
                  >
                    <span className="w-num">{i + 1}</span>
                    <strong>{s.title}</strong>
                    <span className="w-step-text">{s.text}</span>
                    <span className="w-sb" aria-hidden="true"><i /></span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
          <div className="w-pwrap">
            <Phone step={step} />
            <p style={{ fontSize: 13, color: 'rgb(255 246 234 / 0.6)' }}>Sample screens from the PastaMania app</p>
          </div>
        </div>

        <div className="w-rv" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p className="w-eb" style={{ color: 'var(--gold2)', textAlign: 'center' }}>What your points get you</p>
          <ul className="w-ladder">
            <li className="w-lfill" aria-hidden="true" />
            {rewards.map((r) => (
              <li key={r.id} className="w-rw">
                <img src={r.image} alt="" loading="lazy" />
                <b>{formatPoints(r.points)}</b>
                <span>{r.name}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-narrow-only w-club-cta">
          <a className="w-btn w-b-gold" href="/app/join">Join free in the app</a>
          <p>No card to carry: your phone is your card.</p>
        </div>
      </div>
    </section>
  )
}
