import { useState, useCallback } from 'react'
import { storage } from '../lib/storage'
import type { Budget } from '../types'

export function useBudget() {
  const [budgets, setBudgets] = useState<Budget>(() => storage.getBudgets())

  const setBudget = useCallback((monthKey: string, amount: number) => {
    setBudgets(prev => {
      const next = { ...prev, [monthKey]: amount }
      storage.saveBudgets(next)
      return next
    })
  }, [])

  const getBudget = useCallback(
    (monthKey: string): number => budgets[monthKey] ?? 0,
    [budgets]
  )

  return { budgets, getBudget, setBudget }
}
