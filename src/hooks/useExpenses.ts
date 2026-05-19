import { useState, useCallback } from 'react'
import { storage } from '../lib/storage'
import type { Expense } from '../types'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => storage.getExpenses())

  const addExpense = useCallback((expense: Expense) => {
    setExpenses(prev => {
      const next = [expense, ...prev]
      storage.saveExpenses(next)
      return next
    })
  }, [])

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => {
      const next = prev.filter(e => e.id !== id)
      storage.saveExpenses(next)
      return next
    })
  }, [])

  return { expenses, addExpense, deleteExpense }
}
