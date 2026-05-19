import { useState, useCallback } from 'react'
import { storage } from '../lib/storage'
import type { Group, GroupExpense } from '../types'

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>(() => storage.getGroups())

  const addGroup = useCallback((group: Group) => {
    setGroups(prev => {
      const next = [group, ...prev]
      storage.saveGroups(next)
      return next
    })
  }, [])

  const deleteGroup = useCallback((id: string) => {
    setGroups(prev => {
      const next = prev.filter(g => g.id !== id)
      storage.saveGroups(next)
      return next
    })
  }, [])

  const addGroupExpense = useCallback((groupId: string, expense: GroupExpense) => {
    setGroups(prev => {
      const next = prev.map(g =>
        g.id === groupId ? { ...g, expenses: [...g.expenses, expense] } : g
      )
      storage.saveGroups(next)
      return next
    })
  }, [])

  const deleteGroupExpense = useCallback((groupId: string, expenseId: string) => {
    setGroups(prev => {
      const next = prev.map(g =>
        g.id === groupId
          ? { ...g, expenses: g.expenses.filter(e => e.id !== expenseId) }
          : g
      )
      storage.saveGroups(next)
      return next
    })
  }, [])

  return { groups, addGroup, deleteGroup, addGroupExpense, deleteGroupExpense }
}
