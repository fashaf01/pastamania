import { useEffect, useRef, useState } from 'react'

// Reads a QR code with the back camera. Uses the browser's built-in BarcodeDetector where it exists
// (Chrome on Android and Mac) and the jsQR library everywhere else, loaded only when the camera opens.
export default function QrScanner({ onResult, onClose }) {
  const video = useRef(null)
  const done = useRef(false)
  const handler = useRef(onResult)
  handler.current = onResult
  const [error, setError] = useState(null)

  useEffect(() => {
    let stream
    let frame
    let cancelled = false

    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      } catch (e) {
        if (!cancelled) setError(e.name === 'NotAllowedError' ? 'blocked' : 'none')
        return
      }
      if (cancelled) return stream.getTracks().forEach((t) => t.stop())
      video.current.srcObject = stream
      await video.current.play().catch(() => {})

      let detect
      if ('BarcodeDetector' in window && (await window.BarcodeDetector.getSupportedFormats?.())?.includes('qr_code')) {
        const detector = new window.BarcodeDetector({ formats: ['qr_code'] })
        detect = async () => (await detector.detect(video.current))[0]?.rawValue
      } else {
        const { default: jsQR } = await import('jsqr')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d', { willReadFrequently: true })
        detect = async () => {
          const v = video.current
          if (!v.videoWidth) return null
          canvas.width = v.videoWidth
          canvas.height = v.videoHeight
          ctx.drawImage(v, 0, 0)
          return jsQR(ctx.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height)?.data
        }
      }

      const tick = async () => {
        if (cancelled || done.current) return
        const text = await detect().catch(() => null)
        if (text) {
          done.current = true
          handler.current(text)
          return
        }
        frame = requestAnimationFrame(tick)
      }
      tick()
    }

    start()
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <div className="scanner">
      {error ? (
        <p className="scanner-error">
          {error === 'blocked'
            ? 'The camera is blocked. Allow it for this site, or type the number instead.'
            : 'No camera found. Type the member number or mobile instead.'}
        </p>
      ) : (
        <>
          <video ref={video} playsInline muted />
          <span className="scanner-frame" aria-hidden="true" />
          <p className="scanner-hint">Hold the QR code inside the square</p>
        </>
      )}
      <button className="btn btn-outline btn-block" onClick={onClose}>
        Cancel
      </button>
    </div>
  )
}
