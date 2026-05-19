import type { AppData, Expense, Budget, Group } from '../types'

const KEY = 'sb-v3'

function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { expenses: [], budgets: {}, groups: [] }
    return JSON.parse(raw) as AppData
  } catch {
    return { expenses: [], budgets: {}, groups: [] }
  }
}

function save(data: AppData) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export const storage = {
  getData: load,

  getExpenses: (): Expense[] => load().expenses,
  saveExpenses: (expenses: Expense[]) => save({ ...load(), expenses }),

  getBudgets: (): Budget => load().budgets,
  saveBudgets: (budgets: Budget) => save({ ...load(), budgets }),

  getGroups: (): Group[] => load().groups,
  saveGroups: (groups: Group[]) => save({ ...load(), groups }),
}
