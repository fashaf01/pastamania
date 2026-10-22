// The poster starburst sticker. The gold shape turns slowly; the words stay put so they can be read.
export default function Sticker({ size = 88, tilt = 10, className = '', children }) {
  return (
    <span className={`sticker ${className}`} style={{ width: size, height: size }}>
      <span className="sticker-bg" aria-hidden="true" />
      <span className="sticker-text" style={{ rotate: `${tilt}deg` }}>
        {children}
      </span>
    </span>
  )
}
