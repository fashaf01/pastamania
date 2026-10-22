import { brand } from '../data/brand.js'

// Delivery buttons in each platform's own colours, so people see at a glance which is which:
// Uber Eats is black with a green "Eats", PickMe is "Pick" with a yellow "Me".
export function UberEatsLink({ href, className = '', tabIndex }) {
  return (
    <a className={`brand-btn uber ${className}`} href={href} target="_blank" rel="noreferrer" tabIndex={tabIndex} aria-label="Order on Uber Eats">
      <span>Uber</span>
      <b>Eats</b>
    </a>
  )
}

export function PickMeLink({ className = '' }) {
  return (
    <a className={`brand-btn pickme ${className}`} href={brand.pickmeUrl} target="_blank" rel="noreferrer" aria-label="Order on PickMe Food">
      <span>Pick</span>
      <b>Me</b>
      <small>Food</small>
    </a>
  )
}
