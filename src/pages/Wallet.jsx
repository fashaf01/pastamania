import { Link } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { ChevronIcon } from '../components/Icons.jsx'
import { useOrder } from '../components/OrderSheet.jsx'
import { useClub, voucherStatus } from '../context/ClubContext.jsx'
import { brand } from '../data/brand.js'
import { formatDate } from '../lib/format.js'

export default function Wallet() {
  const { member, vouchers } = useClub()
  const openOrder = useOrder()
  const ready = vouchers.filter((v) => voucherStatus(v) === 'ready')
  const past = vouchers.filter((v) => voucherStatus(v) !== 'ready').slice(0, 10)

  return (
    <>
      <AppBar title="Wallet" />
      <div className="pad">
        {ready.length > 0 ? (
          <section>
            <h2 className="h2">Ready to use</h2>
            <ul className="list">
              {ready.map((v) => (
                <li key={v.id}>
                  <Link to={`/wallet/${v.id}`} className="voucher-card">
                    <img src={v.image} alt="" />
                    <span className="row-text">
                      <span className="badge">Ready</span>
                      <strong>Free {v.name}</strong>
                      <span>Use by {formatDate(v.expiresAt)}</span>
                    </span>
                    <span className="pill pill-red">Show</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="footnote">Tap a voucher and show the code at the counter.</p>
          </section>
        ) : (
          <section className="empty-card">
            <strong>No vouchers yet</strong>
            <p className="muted">
              {member ? 'Swap your points for free food in Rewards. It lands here, ready to show at the counter.' : 'Join free to start collecting points for free food.'}
            </p>
            <Link className="btn btn-primary" to={member ? '/rewards' : '/join?next=/wallet'}>
              {member ? 'See rewards' : 'Join free'}
            </Link>
          </section>
        )}

        <section className="block">
          <h2 className="h2">Order for delivery</h2>
          <div className="delivery">
            <button className="delivery-btn" onClick={openOrder}>
              <strong>Uber Eats</strong>
              <span>Choose a branch</span>
            </button>
            <a className="delivery-btn" href={brand.pickmeUrl} target="_blank" rel="noreferrer">
              <strong>PickMe Food</strong>
              <span>Open the app</span>
            </a>
          </div>
          <p className="footnote left">Delivery platforms set their own prices. Points are earned in store only, not on delivery orders.</p>
        </section>

        {past.length > 0 && (
          <section className="block">
            <h2 className="h2">Used & expired</h2>
            <ul className="list">
              {past.map((v) => (
                <li key={v.id}>
                  <Link to={`/wallet/${v.id}`} className="list-row faded">
                    <img src={v.image} alt="" />
                    <span className="row-text">
                      <strong>{v.name}</strong>
                      <span>{voucherStatus(v) === 'used' ? `Used ${formatDate(v.usedAt)}` : `Expired ${formatDate(v.expiresAt)}`}</span>
                    </span>
                    <ChevronIcon width={18} height={18} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  )
}
