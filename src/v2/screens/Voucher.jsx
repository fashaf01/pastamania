import { Navigate, useParams } from 'react-router-dom'
import { useClub, voucherStatus } from '../../context/ClubContext.jsx'
import { dayMonth, voucherQr } from '../config.js'
import { BackButton, MemberQr } from '../ui.jsx'

export default function Voucher() {
  const { id } = useParams()
  const { vouchers } = useClub()
  const voucher = vouchers.find((v) => v.id === id)
  if (!voucher) return <Navigate to="/v2/rewards" replace />
  const status = voucherStatus(voucher)

  return (
    <div className="v2-full" style={{ alignItems: 'center', textAlign: 'center' }}>
      <div style={{ alignSelf: 'stretch', display: 'flex', justifyContent: 'flex-end' }}>
        <BackButton to="/v2/rewards" close label="Close" />
      </div>
      <img src={voucher.image} alt="" style={{ boxSizing: 'border-box', width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '4px solid var(--cream)' }} />
      <span className="v2-eyebrow">Your reward</span>
      <h1 className="v2-cd" style={{ fontSize: 44, lineHeight: '40px' }}>Free {voucher.name}</h1>
      <div style={{ position: 'relative' }}>
        <MemberQr value={voucherQr(voucher.code)} size={200} label="Voucher QR code" />
        {status === 'used' && <span className="v2-stamp">Enjoy!</span>}
      </div>
      <strong className="v2-cd" style={{ fontSize: 26, letterSpacing: '0.08em' }}>{voucher.code}</strong>
      <p className="v2-body">
        {status === 'ready' && `Show this at the counter. Use by ${dayMonth(voucher.expiresAt)}.`}
        {status === 'used' && 'Used. Enjoy your food!'}
        {status === 'expired' && 'This reward has expired.'}
      </p>
    </div>
  )
}
