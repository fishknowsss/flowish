const weekdayFormatter = new Intl.DateTimeFormat('zh-CN', { weekday: 'long' })
const shortDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
})
const longDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})
const topbarDateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  weekday: 'long',
})

export interface CalendarCell {
  dateKey: string
  day: number
  inCurrentMonth: boolean
}

export const getTodayKey = () => toDateKey(new Date())

export function toDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day, 12)
}

export function formatTopbarDate(dateKey: string) {
  return topbarDateFormatter.format(parseDateKey(dateKey))
}

export function formatWeekday(dateKey: string) {
  return weekdayFormatter.format(parseDateKey(dateKey))
}

export function formatShortDate(dateKey: string) {
  return shortDateFormatter.format(parseDateKey(dateKey))
}

export function formatLongDate(dateKey: string) {
  return longDateFormatter.format(parseDateKey(dateKey))
}

export function getMonthLabel(date: Date) {
  return `${date.getFullYear()} / ${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

export function buildCalendarGrid(viewDate: Date): CalendarCell[] {
  const firstDay = startOfMonth(viewDate)
  const offset = (firstDay.getDay() + 6) % 7
  const gridStart = new Date(firstDay)
  gridStart.setDate(firstDay.getDate() - offset)

  return Array.from({ length: 42 }, (_, index) => {
    const cellDate = new Date(gridStart)
    cellDate.setDate(gridStart.getDate() + index)
    return {
      dateKey: toDateKey(cellDate),
      day: cellDate.getDate(),
      inCurrentMonth: cellDate.getMonth() === viewDate.getMonth(),
    }
  })
}

export function daysUntil(dateKey: string) {
  const target = parseDateKey(dateKey)
  const today = parseDateKey(getTodayKey())
  return Math.ceil((target.getTime() - today.getTime()) / 86400000)
}

export function compareDateKeys(a: string, b: string) {
  return parseDateKey(a).getTime() - parseDateKey(b).getTime()
}

export function getDailySeed(dateKey: string, modulo: number) {
  const numeric = Number(dateKey.replaceAll('-', ''))
  return modulo === 0 ? 0 : numeric % modulo
}
