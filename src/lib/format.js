export const formatLKR = (amount) => `LKR ${amount.toLocaleString('en-US')}`

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
