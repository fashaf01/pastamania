const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
)
export const MenuIcon = (p) => (
  <svg {...base} {...p}><path d="M4 4v7a3 3 0 0 0 6 0V4M7 4v17M17 4c-2 2-3 5-3 8h3v9" /></svg>
)
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
)
export const GiftIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5" /></svg>
)
export const CalendarIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 10h18M8 2v4M16 2v4" /></svg>
)
export const BackIcon = (p) => (
  <svg {...base} {...p}><path d="M15 18 9 12l6-6" /></svg>
)
export const ChevronIcon = (p) => (
  <svg {...base} {...p}><path d="m9 18 6-6-6-6" /></svg>
)
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
)
export const MinusIcon = (p) => (
  <svg {...base} {...p}><path d="M5 12h14" /></svg>
)
