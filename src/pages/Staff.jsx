import { useState } from 'react'
import AppBar from '../components/AppBar.jsx'
import { CameraIcon, CheckIcon } from '../components/Icons.jsx'
import QrScanner from '../components/QrScanner.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { pointsForSpend } from '../data/club.js'
import { formatDate, formatMemberCode, formatPoints } from '../lib/format.js'

const MEMBER_QR = /^PASTAMANIA:MEMBER:(PM\d{8})$/
const VOUCHER_QR = /^PASTAMANIA:VOUCHER:(PMV-[A-Z0-9]{6})$/

// The counter, following a sale: who is it → their vouchers → the bill → done.
// Prototype: it can only find members saved in this browser (the customer's own phone, or another tab).
export default function Staff() {
  const club = useClub()
  const [scanning, setScanning] = useState(false)
  const [query, setQuery] = useState('')
  const [customer, setCustomer] = useState(null)
  const [message, setMessage] = useState(null)
  const [amount, setAmount] = useState('')
  const [award, setAward] = useState(null)

  const flash = (text, tone = 'ok') => setMessage({ text, tone })

  const find = (value) => {
    const member = club.findMember(value)
    if (member) {
      setCustomer(member)
      setMessage(null)
    } else {
      flash('No member with that number on this device. In this prototype, members are saved on their own phone.', 'error')
    }
  }

  const use = (code) => {
    const result = club.markVoucherUsed(code)
    if (result.error) flash(result.error, 'error')
    else flash(`Used: free ${result.voucher.name}. Hand it over!`)
  }

  const onScan = (text) => {
    setScanning(false)
    const member = text.match(MEMBER_QR)
    const voucher = text.match(VOUCHER_QR)
    if (member) return find(member[1])
    if (voucher) {
      // A voucher QR on its own: find whose it is, then mark it used.
      if (club.member && club.vouchers.some((v) => v.code === voucher[1])) {
        setCustomer(club.member)
        return use(voucher[1])
      }
      return flash('That voucher isn’t on this device.', 'error')
    }
    flash('That isn’t a PastaMania code. Ask them to open My code or their voucher.', 'error')
  }

  const give = (e) => {
    e.preventDefault()
    const bill = Math.floor(Number(amount))
    if (!bill || bill <= 0) return flash('Enter the order total.', 'error')
    if (bill > 100000) return flash('That total looks wrong (over LKR 100,000). Enter it again.', 'error')
    setAward(club.recordPurchase(bill, 'Visit'))
    setMessage(null)
  }

  const undo = () => {
    const result = club.undoAward(award.id)
    if (result.error) return flash(result.error, 'error')
    flash(`Undone. ${formatPoints(award.points)} points taken back.`)
    setAward(null)
  }

  const next = () => {
    setCustomer(null)
    setAward(null)
    setAmount('')
    setQuery('')
    setMessage(null)
  }

  const live = customer && club.member?.id === customer.id ? club.member : customer
  const ready = live ? club.vouchers.filter((v) => voucherStatus(v) === 'ready') : []
  const preview = pointsForSpend(Math.floor(Number(amount)) || 0)

  return (
    <>
      <AppBar title="Counter" back="/me" />
      <div className="pad">
        <p className="demo-note">Demo counter: it works with members saved on this phone or browser.</p>

        {message && <p className={`flash flash-${message.tone}`} role="status">{message.text}</p>}

        {scanning ? (
          <QrScanner onResult={onScan} onClose={() => setScanning(false)} />
        ) : !live ? (
          <section className="block">
            <h2 className="h2">Who is it?</h2>
            <button className="btn btn-primary btn-block" onClick={() => setScanning(true)}>
              <CameraIcon width={20} height={20} /> Scan their code
            </button>
            <form
              className="form find-form"
              onSubmit={(e) => {
                e.preventDefault()
                find(query)
              }}
            >
              <label>
                <span className="label">or type the member number or mobile</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="PM 1234 5678 or 077 123 4567" />
              </label>
              <button type="submit" className="btn btn-outline btn-block">Find</button>
            </form>
          </section>
        ) : award ? (
          <section className="block done">
            <span className="done-tick"><CheckIcon width={40} height={40} /></span>
            <h2 className="h2">+{formatPoints(award.points)} points to {live.name.split(' ')[0]}</h2>
            <p className="muted">New balance: {formatPoints(club.balance)} points</p>
            <button className="btn btn-primary btn-block" onClick={next}>Next customer</button>
            <button className="text-btn" onClick={undo}>Undo – wrong total</button>
          </section>
        ) : (
          <>
            <section className="customer">
              <div>
                <strong>{live.name}</strong>
                <span className="muted">{formatMemberCode(live.id)}</span>
              </div>
              <span className="customer-points">{formatPoints(club.balance)} pts</span>
            </section>

            <section className="block">
              <h2 className="h2">Vouchers</h2>
              {ready.length === 0 ? (
                <p className="muted">Nothing to use today.</p>
              ) : (
                <ul className="list">
                  {ready.map((v) => (
                    <li key={v.id} className="list-row">
                      <img src={v.image} alt="" />
                      <span className="row-text">
                        <strong>Free {v.name}</strong>
                        <span>{v.code} · until {formatDate(v.expiresAt)}</span>
                      </span>
                      <button className="btn btn-primary btn-sm" onClick={() => use(v.code)}>Mark as used</button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <form className="form block" onSubmit={give}>
              <label>
                <span className="label">Order total (LKR)</span>
                <input inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} placeholder="e.g. 4290" />
              </label>
              <button type="submit" className="btn btn-primary btn-block" disabled={!preview}>
                {preview ? `Give ${formatPoints(preview)} points` : 'Give points'}
              </button>
            </form>
            <button className="text-btn" onClick={next}>Different customer</button>
          </>
        )}
      </div>
    </>
  )
}
