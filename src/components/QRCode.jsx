import QR from 'qrcode'
import { useEffect, useState } from 'react'

// Renders `value` as an inline SVG QR code (generated locally, nothing is sent anywhere).
// Use level 'H' when a logo is laid over the middle – it survives losing up to 30% of the code.
export default function QRCode({ value, size = 200, label, level = 'M' }) {
  const [svg, setSvg] = useState('')

  useEffect(() => {
    let cancelled = false
    QR.toString(value, { type: 'svg', margin: 1, errorCorrectionLevel: level, color: { dark: '#231f20', light: '#ffffff' } })
      .then((markup) => !cancelled && setSvg(markup))
      .catch(() => !cancelled && setSvg(''))
    return () => {
      cancelled = true
    }
  }, [value, level])

  return (
    <div
      className="qr"
      style={{ width: size, maxWidth: '100%', aspectRatio: '1' }}
      role="img"
      aria-label={label ?? `QR code for ${value}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
