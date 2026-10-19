// The gold starburst sticker from the FridayMania posters. Children are the sticker's text.
const POINTS =
  '48,2 54.8,9.6 63.7,4.8 67.5,14.2 77.6,12.8 77.9,22.9 87.8,25 84.6,34.7 93.3,40 87,48 93.3,56 84.6,61.3 87.8,71 77.9,73.1 77.6,83.2 67.5,81.8 63.7,91.2 54.8,86.4 48,94 41.2,86.4 32.3,91.2 28.5,81.8 18.4,83.2 18.1,73.1 8.2,71 11.4,61.3 2.7,56 9,48 2.7,40 11.4,34.7 8.2,25 18.1,22.9 18.4,12.8 28.5,14.2 32.3,4.8 41.2,9.6'

export default function Starburst({ size = 96, children }) {
  return (
    <div className="starburst" style={{ width: size, height: size }}>
      <svg viewBox="0 0 96 96" aria-hidden="true">
        <polygon points={POINTS} />
      </svg>
      <span className="starburst-text">{children}</span>
    </div>
  )
}
