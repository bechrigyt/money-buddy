export function fmt(amount: number): string {
  return 'S$' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function fmtN(amount: number): string {
  return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function monthKey(date: Date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}`
}

export function monthLabel(key: string): string {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-SG', {
    month: 'long',
    year: 'numeric',
  })
}

export function prevMonth(key: string): string {
  const [year, month] = key.split('-').map(Number)
  const d = new Date(year, month - 2, 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}`
}

export function nextMonth(key: string): string {
  const [year, month] = key.split('-').map(Number)
  const d = new Date(year, month, 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}`
}

export function daysLeftInMonth(key: string): number {
  const [year, month] = key.split('-').map(Number)
  const today = new Date()
  const lastDay = new Date(year, month, 0).getDate()
  if (today.getFullYear() === year && today.getMonth() + 1 === month) {
    return lastDay - today.getDate() + 1
  }
  return lastDay
}

export function isoToday(): string {
  return new Date().toISOString().slice(0, 10)
}

export function formatDateDisplay(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
  })
}
