import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AppBar from '../components/AppBar.jsx'
import { CheckIcon } from '../components/Icons.jsx'
import { JoinPrompt, PointsCard } from '../components/Loyalty.jsx'
import QRCode from '../components/QRCode.jsx'
import Sheet from '../components/Sheet.jsx'
import { useToast } from '../components/Toast.jsx'
import { useClub } from '../context/ClubContext.jsx'
import { club, rewards, tiers } from '../data/club.js'
import { formatDate, formatLKR, formatPoints } from '../lib/format.js'

const TABS = [
  { id: 'rewards', label: 'Rewards' },
  { id: 'vouchers', label: 'My vouchers' },
  { id: 'activity', label: 'Activity' },
]

export default function Rewards() {
  const { member, balance, tier, vouchers, activity, redeem } = useClub()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === params.get('tab')) ? params.get('tab') : 'rewards'
  const [confirming, setConfirming] = useState(null)
  const [showVoucher, setShowVoucher] = useState(null)

  const confirmRedeem = () => {
    const voucher = redeem(confirming)
    setConfirming(null)
    if (voucher) {
      toast(`${voucher.name} added to your vouchers`)
      setShowVoucher(voucher)
    }
  }

  const now = Date.now()

  return (
    <>
      <AppBar title="Rewards" />
      <div className="screen-pad">
        {member ? <PointsCard /> : <JoinPrompt />}

        {member && (
          <div className="segmented tabs" role="tablist" aria-label="Rewards sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                className={tab === t.id ? 'active' : ''}
                onClick={() => setParams(t.id === 'rewards' ? {} : { tab: t.id }, { replace: true })}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}

        {tab === 'rewards' && (
          <>
            <ul className="reward-list">
              {rewards.map((r) => {
                const short = r.points - balance
                return (
                  <li key={r.id} className="reward-row">
                    <img src={r.image} alt="" loading="lazy" />
                    <div className="reward-text">
                      <span className="caps-label">{r.category}</span>
                      <strong>{r.name}</strong>
                      <span className="pts">{formatPoints(r.points)} pts</span>
                    </div>
                    {member && (
                      <button className="btn btn-primary btn-sm" disabled={short > 0} onClick={() => setConfirming(r)}>
                        {short > 0 ? `${formatPoints(short)} to go` : 'Redeem'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>

            <h2 className="section-title retro retro-red">Club tiers</h2>
            <div className="tier-list">
              {tiers.map((t) => (
                <article key={t.id} className={`tier-card ${member && t.id === tier.id ? 'current' : ''}`}>
                  <div className="tier-card-head">
                    <h3 style={{ color: t.colour }}>{t.name}</h3>
                    <span className="muted small">
                      {t.minPoints === 0 ? 'On joining' : `${formatPoints(t.minPoints)} pts / year`}
                    </span>
                  </div>
                  <ul className="ticks">
                    {t.perks.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  {member && t.id === tier.id && <span className="tag">Your tier</span>}
                </article>
              ))}
            </div>
            <p className="muted small">
              Earn 1 point for every {formatLKR(club.spendPerPoint)} spent at any PastaMania branch. Vouchers are valid for{' '}
              {club.voucherValidDays} days.
            </p>
          </>
        )}

        {tab === 'vouchers' && (
          <>
            {vouchers.length === 0 && <p className="empty">No vouchers yet. Redeem a reward to get one.</p>}
            <ul className="voucher-list">
              {vouchers.map((v) => {
                const expired = v.expiresAt <= now
                return (
                  <li key={v.id}>
                    <button className={`voucher ${expired ? 'expired' : ''}`} onClick={() => !expired && setShowVoucher(v)}>
                      <img src={v.image} alt="" loading="lazy" />
                      <span className="voucher-text">
                        <strong>{v.name}</strong>
                        <span className="small muted">
                          {expired ? `Expired ${formatDate(v.expiresAt)}` : `Use by ${formatDate(v.expiresAt)}`}
                        </span>
                      </span>
                      <span className="voucher-code">{v.code}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        {tab === 'activity' && (
          <ul className="activity-list">
            {activity.map((a) => (
              <li key={a.id}>
                <span className="activity-text">
                  <strong>{a.label}</strong>
                  <span className="small muted">
                    {formatDate(a.at)}
                    {a.amount ? ` · ${formatLKR(a.amount)}` : ''}
                  </span>
                </span>
                <span className={`activity-pts ${a.points < 0 ? 'minus' : ''}`}>
                  {a.points > 0 ? '+' : ''}
                  {formatPoints(a.points)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {confirming && (
        <Sheet title="Redeem reward" onClose={() => setConfirming(null)}>
          <img className="sheet-photo" src={confirming.image} alt="" />
          <p className="sheet-lead">
            Swap <strong>{formatPoints(confirming.points)} points</strong> for <strong>{confirming.name}</strong>?
          </p>
          <p className="muted small">
            You’ll have {formatPoints(balance - confirming.points)} points left. The voucher is valid for {club.voucherValidDays} days at any
            branch.
          </p>
          <button className="btn btn-primary btn-block" onClick={confirmRedeem}>
            <CheckIcon width={18} height={18} /> Redeem now
          </button>
        </Sheet>
      )}

      {showVoucher && (
        <Sheet title={showVoucher.name} onClose={() => setShowVoucher(null)}>
          <div className="voucher-ticket">
            <QRCode value={`PASTAMANIA:VOUCHER:${showVoucher.code}`} size={200} label="Voucher QR code" />
            <p className="voucher-big-code">{showVoucher.code}</p>
            <p className="muted small">Valid until {formatDate(showVoucher.expiresAt)}</p>
          </div>
          <p className="center small">Show this at the counter when you order. One use only.</p>
        </Sheet>
      )}
    </>
  )
}
