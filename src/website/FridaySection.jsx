import { ArrowIcon } from '../components/Icons.jsx'
import { menus } from '../data/menu.js'
import { fridayMania, nextFriday } from '../data/offers.js'
import { formatDay, formatLKR } from '../lib/format.js'
import { useNow } from '../lib/useNow.js'

const pad = (n) => String(n).padStart(2, '0')

// Counts down to the start of the coming Friday, or to midnight while it is Friday.
function countdown(now) {
  const isFriday = now.getDay() === 5
  const end = new Date(isFriday ? now : nextFriday(now))
  if (isFriday) end.setHours(24, 0, 0, 0)
  else end.setHours(0, 0, 0, 0)
  const ms = Math.max(0, end - now)
  return {
    isFriday,
    cells: [
      [pad(Math.floor(ms / 864e5)), 'days'],
      [pad(Math.floor(ms / 36e5) % 24), 'hours'],
      [pad(Math.floor(ms / 6e4) % 60), 'mins'],
      [pad(Math.floor(ms / 1e3) % 60), 'secs'],
    ],
  }
}

export default function FridaySection() {
  const now = useNow(1000)
  const { isFriday, cells } = countdown(now)
  const hero = menus.havelock.find((i) => i.name === fridayMania.heroDish)

  return (
    <section id="fridaymania" className="w-friday">
      <div className="w-wrap">
        <div className="w-fframe w-rv">
          <img src={fridayMania.image} alt={`${fridayMania.heroDish} on a red table`} />
          <div className="w-sticker w-fsticker">
            <span className="w-sticker-bg w-burst w-spin" aria-hidden="true" />
            <p>
              <span className="w-slab" style={{ display: 'block', fontSize: 40 }}>1+1</span>
              <span className="w-eb">Free</span>
            </p>
          </div>
          <div className="w-ff-in">
            <p className="w-eb w-live">
              <span className="w-dot" />
              {isFriday ? 'On now · today only' : `Next FridayMania · ${formatDay(nextFriday(now))}`}
            </p>
            <h2 className="w-cd" style={{ fontSize: 'clamp(64px, 8vw, 128px)' }}>
              Friday<span style={{ color: 'var(--gold)' }}>Mania</span>
            </h2>
            <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35 }}>
              Buy one {fridayMania.heroDish}, get one free. Dine-in, takeaway and delivery.
              {hero && <> Two for {formatLKR(hero.price)}.</>}
            </p>
            <div className="w-cdn" role="timer" aria-label={isFriday ? 'Time left today' : 'Time until FridayMania'}>
              {cells.map(([value, unit]) => (
                <div key={unit} className="w-cell">
                  <b>{value}</b>
                  <span>{unit}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 6 }}>
              <a className="w-btn w-b-gold" href="#order">
                Order for Friday <ArrowIcon className="w-ar" width={20} height={20} strokeWidth={2.6} />
              </a>
              <a className="w-btn w-b-ghost" href="#branches">Find a branch</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
