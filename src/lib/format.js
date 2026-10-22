export const formatLKR = (amount) => `LKR ${amount.toLocaleString('en-US')}`

export const formatPoints = (points) => points.toLocaleString('en-US')

export const formatDate = (ms) => new Date(ms).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

// Written out by hand: browsers disagree on 'Sep' vs 'Sept' and on the comma after the weekday.
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
export const weekdayShort = (date) => WEEKDAYS[new Date(date).getDay()]
export const monthShort = (date) => MONTHS[new Date(date).getMonth()]

// 'Thu 15 Oct'
export const formatDay = (date) => `${weekdayShort(date)} ${new Date(date).getDate()} ${monthShort(date)}`

// 'Thursday 15 October'
const WEEKDAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export const formatLongDay = (date) => {
  const d = new Date(date)
  return `${WEEKDAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`
}

// 'Aug 2026'
export const formatMonthYear = (date) => `${monthShort(date)} ${new Date(date).getFullYear()}`

// Whole days from now until `ms` (0 once it has passed).
export const daysUntil = (ms, now = Date.now()) => Math.max(0, Math.ceil((ms - now) / (24 * 60 * 60 * 1000)))

export const firstName = (name = '') => name.trim().split(/\s+/)[0]

// 'PM12345678' -> 'PM 1234 5678'
export const formatMemberCode = (code = '') => code.replace(/^(PM)(\d{4})(\d{4})$/, '$1 $2 $3')

// '+94112553618' -> '+94 11 255 3618', '+94761255750' -> '+94 76 125 5750'
export const formatPhone = (phone) => {
  const m = phone.match(/^\+94(\d{2})(\d{3})(\d{4})$/)
  return m ? `+94 ${m[1]} ${m[2]} ${m[3]}` : phone
}

const STORAGE_KEY = 'pm.branch'

export const loadBranchId = () => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export const saveBranchId = (id) => {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // storage unavailable (private mode etc.) – preference just won't persist
  }
}
