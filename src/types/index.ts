export type Category =
  | 'Food'
  | 'Transport'
  | 'Ride Hailing'
  | 'Shopping'
  | 'Health'
  | 'Entertainment'
  | 'Housing'
  | 'Travel'
  | 'Sports'
  | 'Gambling'
  | 'Work'
  | 'Gifts'
  | 'Others'

export const CATEGORIES: { label: Category; emoji: string; color: string }[] = [
  { label: 'Food',          emoji: '🍜', color: '#1D9E75' },
  { label: 'Transport',     emoji: '🚌', color: '#185FA5' },
  { label: 'Ride Hailing',  emoji: '🚗', color: '#378ADD' },
  { label: 'Shopping',      emoji: '🛍️', color: '#D85A30' },
  { label: 'Health',        emoji: '🏥', color: '#E24B4A' },
  { label: 'Entertainment', emoji: '🎬', color: '#7F77DD' },
  { label: 'Housing',       emoji: '🏠', color: '#BA7517' },
  { label: 'Travel',        emoji: '✈️', color: '#0F6E56' },
  { label: 'Sports',        emoji: '🏌️', color: '#639922' },
  { label: 'Gambling',      emoji: '🎰', color: '#D4537E' },
  { label: 'Work',          emoji: '💼', color: '#533489' },
  { label: 'Gifts',         emoji: '🎁', color: '#EF9F27' },
  { label: 'Others',        emoji: '📦', color: '#888780' },
]

export function getCategoryMeta(label: Category) {
  return CATEGORIES.find(c => c.label === label)!
}

export type Expense = {
  id: string
  category: Category
  date: string
  description: string
  notes?: string
  sgdAmount: number
  isFCY: boolean
  fcyAmt?: number
  fcyCur?: string
  fcyRate?: number
}

export type GroupExpense = Expense & {
  paidBy: string
  splitWith: string[]
}

export type Group = {
  id: string
  name: string
  members: string[]
  expenses: GroupExpense[]
  createdAt: string
}

export type Budget = {
  [monthKey: string]: number
}

export type AppData = {
  expenses: Expense[]
  budgets: Budget
  groups: Group[]
}
