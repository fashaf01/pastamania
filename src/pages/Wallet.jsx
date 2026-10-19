import { Link } from 'react-router-dom'
import { PageHead } from '../components/AppBar.jsx'
import { ChevronIcon } from '../components/Icons.jsx'
import { useOrder } from '../components/OrderSheet.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { getBranch } from '../data/branches.js'
import { formatSessionDate, formatSessionTime, getSession, workshop } from '../data/workshops.js'
import { formatDay } from '../lib/format.js'

export default function Wallet() {
  const { member, vouchers, bookings } = useClub()
  const openOrder = useOrder()
  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready').sort((a, b) => a.expiresAt - b.expiresAt)
  const past = vouchers.filter((v) => voucherStatus(v) !== 'ready').slice(0, 10)
  const tickets = bookings
    .filter((b) => b.status !== 'cancelled')
    .map((b) => ({ ...b, session: getSession(b.sessionId) }))
    .filter((b) => b.session)
    .sort((a, b) => a.session.date.localeCompare(b.session.date))

  return (
    <>
      <PageHead title="Wallet" />
      <div className="wallet">
        <section>
          <h2 className="label-caps">
            Ready to use {ready.length > 0 && <span className="count-badge">{ready.length}</span>}
          </h2>
          {ready.length > 0 ? (
            ready.map((v) => (
              <Link key={v.id} to={`/wallet/${v.id}`} className="voucher-row card">
                <img src={v.image} alt="" />
                <span className="voucher-row-text">
                  <span className="eyebrow">Voucher ready</span>
                  <strong>Free {v.name}</strong>
                  <span>Valid till {formatDay(v.expiresAt)}</span>
                </span>
                <span className="voucher-row-cta">
                  <span>Use</span>
                </span>
              </Link>
            ))
          ) : (
            <div className="empty-card soft-card">
              <strong>No vouchers yet</strong>
              <p>
                {member
                  ? 'Swap your points for free food in Rewards. It lands here, ready to show at the counter.'
                  : 'Join free to start collecting points for free food.'}
              </p>
              <Link className="btn btn-red btn-sm" to={member ? '/rewards' : '/join?next=/wallet'}>
                {member ? 'See rewards' : 'Join free'}
              </Link>
            </div>
          )}
        </section>

        <section>
          <h2 className="label-caps">Workshop tickets</h2>
          {tickets.length > 0 ? (
            tickets.map((b) => (
              <Link key={b.ref} to={`/book/ticket/${b.ref}`} className="row-link card">
                <img src={workshop.image} alt="" />
                <span className="row-link-text">
                  <strong>{workshop.title}</strong>
                  <b>
                    {formatSessionDate(b.session)} · {formatSessionTime(b.session)}
                  </b>
                  <span>
                    {getBranch(b.session.branchId).name} · {b.children.length} {b.children.length === 1 ? 'child' : 'children'}
                  </span>
                </span>
                <ChevronIcon width={20} height={20} />
              </Link>
            ))
          ) : (
            <Link to="/book" className="row-link card">
              <img src={workshop.image} alt="" />
              <span className="row-link-text">
                <strong>{workshop.title} kids workshops</strong>
                <span>Pizza-making for ages {workshop.minAge}–{workshop.maxAge}. Book a session.</span>
              </span>
              <ChevronIcon width={20} height={20} />
            </Link>
          )}
        </section>

        {past.length > 0 && (
          <section>
            <h2 className="label-caps">Used &amp; expired</h2>
            <ul className="list-card card">
              {past.map((v) => {
                const used = voucherStatus(v) === 'used'
                return (
                  <li key={v.id}>
                    <Link to={`/wallet/${v.id}`} className="past-row">
                      <img src={v.image} alt="" />
                      <div>
                        <strong>{v.name}</strong>
                        <span>{used ? `Used ${formatDay(v.usedAt)}` : `Ran out on ${formatDay(v.expiresAt)}`}</span>
                      </div>
                      <span className={`pill ${used ? 'pill-green' : 'pill-red'}`}>{used ? 'Used' : 'Expired'}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        <section className="delivery-card soft-card">
          <div className="stack" style={{ gap: 4 }}>
            <h2 className="title-m">Ordering in?</h2>
            <p className="footnote" style={{ fontSize: 14 }}>
              Delivery orders don’t earn points. Eat in or take away and show your code to earn.
            </p>
          </div>
          <div className="btns">
            <button type="button" className="btn btn-ink" onClick={openOrder}>Uber Eats</button>
            <a className="btn btn-outline btn-plain" href={brand.pickmeUrl} target="_blank" rel="noreferrer">PickMe Food</a>
          </div>
        </section>
      </div>
    </>
  )
}
