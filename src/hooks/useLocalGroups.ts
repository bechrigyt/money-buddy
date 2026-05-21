import { useState, useCallback } from 'react'
import { storage } from '../lib/storage'
import type { Group, GroupExpense } from '../types'

export function useLocalGroups() {
  const [groups, setGroups] = useState<Group[]>(() => storage.getGroups())

  const persist = (next: Group[]) => {
    storage.saveGroups(next)
    setGroups(next)
  }

  const createGroup = useCallback((name: string, members: string[]): Group => {
    const group: Group = {
      id: crypto.randomUUID(),
      name,
      members,
      expenses: [],
      createdAt: new Date().toISOString(),
    }
    setGroups(prev => {
      const next = [group, ...prev]
      storage.saveGroups(next)
      return next
    })
    return group
  }, [])

  const deleteGroup = useCallback((id: string) => {
    setGroups(prev => {
      const next = prev.filter(g => g.id !== id)
      storage.saveGroups(next)
      return next
    })
  }, [])

  const addExpense = useCallback((groupId: string, expense: GroupExpense) => {
    setGroups(prev => {
      const next = prev.map(g =>
        g.id === groupId ? { ...g, expenses: [expense, ...g.expenses] } : g
      )
      storage.saveGroups(next)
      return next
    })
  }, [])

  const updateExpense = useCallback((groupId: string, expenseId: string, updated: GroupExpense) => {
    setGroups(prev => {
      const next = prev.map(g =>
        g.id === groupId
          ? { ...g, expenses: g.expenses.map(e => e.id === expenseId ? updated : e) }
          : g
      )
      storage.saveGroups(next)
      return next
    })
  }, [])

  const deleteExpense = useCallback((groupId: string, expenseId: string) => {
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

  // Expose a stable setter for when storage user changes (e.g. after login)
  const reload = useCallback(() => {
    persist(storage.getGroups())
  }, [])

  return { groups, createGroup, deleteGroup, addExpense, updateExpense, deleteExpense, reload }
}
