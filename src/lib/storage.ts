import type { AppData, Expense, Budget, Group } from '../types'

// Namespace storage key by user so each account has isolated data
let _userId = 'guest'

export function setStorageUser(uid: string) {
  _userId = uid
}

function key() {
  return `sb-v3-${_userId}`
}

function load(): AppData {
  try {
    const raw = localStorage.getItem(key())
    if (!raw) return { expenses: [], budgets: {}, groups: [] }
    return JSON.parse(raw) as AppData
  } catch {
    return { expenses: [], budgets: {}, groups: [] }
  }
}

function save(data: AppData) {
  localStorage.setItem(key(), JSON.stringify(data))
}

export const storage = {
  getData: load,

  getExpenses: (): Expense[] => load().expenses,
  saveExpenses: (expenses: Expense[]) => save({ ...load(), expenses }),

  getBudgets: (): Budget => load().budgets,
  saveBudgets: (budgets: Budget) => save({ ...load(), budgets }),

  getGroups: (): Group[] => load().groups,
  saveGroups: (groups: Group[]) => save({ ...load(), groups }),

  getDefaultTab: (): 'personal' | 'group' => {
    return (localStorage.getItem(`sb-prefs-${_userId}-defaultTab`) ?? 'personal') as 'personal' | 'group'
  },
  saveDefaultTab: (tab: 'personal' | 'group') => {
    localStorage.setItem(`sb-prefs-${_userId}-defaultTab`, tab)
  },
}
