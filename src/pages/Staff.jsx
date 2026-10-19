import { useEffect, useState } from 'react'
import AppBar from '../components/AppBar.jsx'
import { CameraIcon, CheckIcon } from '../components/Icons.jsx'
import QrScanner from '../components/QrScanner.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { pointsForSpend } from '../data/club.js'
import { formatDay, formatMemberCode, formatPoints } from '../lib/format.js'

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

  // The customer signed out, or someone else joined, in another tab: start again rather than credit the wrong person.
  const memberId = club.member?.id
  useEffect(() => {
    if (customer && customer.id !== memberId) {
      setCustomer(null)
      setAward(null)
      setAmount('')
      setMessage({ text: 'That customer is no longer on this device. Find them again.', tone: 'error' })
    }
  }, [customer, memberId])

  const find = (value) => {
    const member = club.findMember(value)
    if (member) {
      setCustomer(member)
      setMessage(null)
    } else {
      flash('No member with that number on this device. In this prototype, members are saved on their own phone.', 'error')
    }
  }

  const use = (code, forMember = customer.id) => {
    const result = club.markVoucherUsed(forMember, code)
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
        return use(voucher[1], club.member.id)
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
    const result = club.recordPurchase(customer.id, bill, 'Visit')
    if (result.error) return flash(result.error, 'error')
    setAward(result.award)
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

  const live = customer && club.member?.id === customer.id ? club.member : null
  const ready = live ? club.vouchers.filter((v) => voucherStatus(v) === 'ready') : []
  const preview = pointsForSpend(Math.floor(Number(amount)) || 0)

  return (
    <>
      <AppBar title="Counter" back="/me" />
      <div className="counter">
        <span className="staff-badge">Staff · demo counter</span>

        {message && (
          <p className={`flash flash-${message.tone}`} role="status">
            {message.text}
          </p>
        )}

        {scanning ? (
          <QrScanner onResult={onScan} onClose={() => setScanning(false)} />
        ) : award ? (
          <section className="done-card card">
            <span className="done-tick"><CheckIcon width={40} height={40} /></span>
            <h2 className="title-l">
              +{formatPoints(award.points)} points to {customer.name.split(' ')[0]}
            </h2>
            <p className="muted">New balance: {formatPoints(club.balance)} points</p>
            <button type="button" className="btn btn-red btn-block" onClick={next}>Next customer</button>
            <button type="button" className="text-btn" onClick={undo}>Undo – wrong total</button>
            <p className="footnote">You can undo once, within 30 minutes, if the points haven’t been spent.</p>
          </section>
        ) : (
          <>
            <section className="step card">
              <h2 className="step-title">1 · Find the member</h2>
              {!live ? (
                <>
                  <button type="button" className="btn btn-gold btn-block" onClick={() => setScanning(true)}>
                    <CameraIcon width={20} height={20} /> Scan their code
                  </button>
                  <form
                    className="find-row"
                    onSubmit={(e) => {
                      e.preventDefault()
                      find(query)
                    }}
                  >
                    <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Member no. or mobile" aria-label="Member number or mobile" />
                    <button type="submit" className="btn btn-outline btn-plain btn-sm">Find</button>
                  </form>
                </>
              ) : (
                <>
                  <div className="found">
                    <span className="avatar" style={{ boxShadow: 'none' }}>{live.name.charAt(0).toUpperCase()}</span>
                    <div>
                      <strong>{live.name}</strong>
                      <span>{formatMemberCode(live.id)}</span>
                    </div>
                    <span className="found-points">
                      <b>{formatPoints(club.balance)}</b>
                      <small>points</small>
                    </span>
                  </div>
                  <button type="button" className="text-btn" style={{ margin: 0 }} onClick={next}>Different customer</button>
                </>
              )}
            </section>

            {live && (
              <>
                <section className="step card">
                  <h2 className="step-title">2 · Vouchers they can use</h2>
                  {ready.length === 0 ? (
                    <p className="muted">Nothing to use today.</p>
                  ) : (
                    ready.map((v) => (
                      <div key={v.id} className="voucher-line">
                        <img src={v.image} alt="" />
                        <div>
                          <strong>Free {v.name}</strong>
                          <span>{v.code} · till {formatDay(v.expiresAt)}</span>
                        </div>
                        <button type="button" className="btn btn-outline btn-plain btn-sm" onClick={() => use(v.code)}>Mark as used</button>
                      </div>
                    ))
                  )}
                </section>

                <form className="step card" onSubmit={give}>
                  <label className="step-title" htmlFor="bill">3 · Bill total</label>
                  <div className="bill">
                    <span>LKR</span>
                    <input id="bill" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))} placeholder="0" />
                  </div>
                  <span className="field-hint">{preview ? `Gives ${formatPoints(preview)} points · 1 point per LKR 100` : 'Type the total from the receipt'}</span>
                  <button type="submit" className="btn btn-red btn-lg btn-block" disabled={!preview}>
                    {preview ? `Give ${formatPoints(preview)} points` : 'Give points'}
                  </button>
                </form>
              </>
            )}
          </>
        )}
        <p className="footnote center">Demo counter: it works with members saved on this phone or browser.</p>
      </div>
    </>
  )
}
