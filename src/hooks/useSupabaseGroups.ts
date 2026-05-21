import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Category } from '../types'

export type DbMember = {
  id: string
  group_id: string
  user_id: string
  display_name: string
  joined_at: string
}

export type DbGroupExpense = {
  id: string
  group_id: string
  paid_by_user_id: string
  paid_by_name: string
  description: string
  category: Category
  sgd_amount: number
  date: string
  split_with: string[]
  is_fcy: boolean
  fcy_amt?: number
  fcy_cur?: string
  fcy_rate?: number
  notes?: string
  created_at: string
}

export type DbGroup = {
  id: string
  name: string
  created_by: string
  created_at: string
  members: DbMember[]
  expenses: DbGroupExpense[]
}

export function useSupabaseGroups(userId: string | undefined) {
  const [groups, setGroups] = useState<DbGroup[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGroups = useCallback(async () => {
    if (!userId) return
    setLoading(true)

    // Fetch groups the user belongs to
    const { data: memberRows } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', userId)

    if (!memberRows?.length) { setGroups([]); setLoading(false); return }

    const groupIds = memberRows.map(r => r.group_id)

    const [{ data: groupRows }, { data: memberData }, { data: expenseData }] = await Promise.all([
      supabase.from('groups').select('*').in('id', groupIds).order('created_at', { ascending: false }),
      supabase.from('group_members').select('*').in('group_id', groupIds),
      supabase.from('group_expenses').select('*').in('group_id', groupIds).order('date', { ascending: false }),
    ])

    const assembled: DbGroup[] = (groupRows ?? []).map(g => ({
      ...g,
      members: (memberData ?? []).filter(m => m.group_id === g.id),
      expenses: (expenseData ?? []).filter(e => e.group_id === g.id),
    }))

    setGroups(assembled)
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchGroups() }, [fetchGroups])

  // Real-time: re-fetch when any group expense changes
  useEffect(() => {
    if (!userId) return
    const channel = supabase
      .channel('group-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_expenses' }, fetchGroups)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'group_members' }, fetchGroups)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [userId, fetchGroups])

  // Create a new group + add creator as first member
  const createGroup = useCallback(async (name: string, displayName: string) => {
    if (!userId) return null
    const { data: g, error } = await supabase
      .from('groups')
      .insert({ name, created_by: userId })
      .select()
      .single()
    if (error || !g) return null

    await supabase.from('group_members').insert({
      group_id: g.id, user_id: userId, display_name: displayName,
    })

    // Create a permanent invite token for this group
    await supabase.from('group_invites').insert({ group_id: g.id, created_by: userId })

    await fetchGroups()
    return g.id
  }, [userId, fetchGroups])

  // Get or create invite token for a group
  const getInviteToken = useCallback(async (groupId: string): Promise<string | null> => {
    if (!userId) return null
    const { data } = await supabase
      .from('group_invites')
      .select('token')
      .eq('group_id', groupId)
      .order('created_at', { ascending: true })
      .limit(1)
      .single()

    if (data) return data.token

    // Create one if none exists
    const { data: created } = await supabase
      .from('group_invites')
      .insert({ group_id: groupId, created_by: userId })
      .select('token')
      .single()
    return created?.token ?? null
  }, [userId])

  // Join a group via invite token
  const joinGroup = useCallback(async (token: string, displayName: string): Promise<{ groupId: string, groupName: string } | null> => {
    if (!userId) return null
    const { data: invite } = await supabase
      .from('group_invites')
      .select('group_id, groups(name)')
      .eq('token', token)
      .single()

    if (!invite) return null

    const groupName = (invite.groups as unknown as { name: string } | null)?.name ?? 'Group'

    // Insert member (ignore conflict if already a member)
    await supabase.from('group_members').upsert({
      group_id: invite.group_id, user_id: userId, display_name: displayName,
    }, { onConflict: 'group_id,user_id', ignoreDuplicates: true })

    await fetchGroups()
    return { groupId: invite.group_id, groupName }
  }, [userId, fetchGroups])

  // Delete group
  const deleteGroup = useCallback(async (groupId: string) => {
    await supabase.from('groups').delete().eq('id', groupId)
    await fetchGroups()
  }, [fetchGroups])

  // Add expense
  const addExpense = useCallback(async (groupId: string, expense: Omit<DbGroupExpense, 'id' | 'group_id' | 'created_at'>) => {
    await supabase.from('group_expenses').insert({ ...expense, group_id: groupId })
    await fetchGroups()
  }, [fetchGroups])

  // Delete expense
  const deleteExpense = useCallback(async (expenseId: string) => {
    await supabase.from('group_expenses').delete().eq('id', expenseId)
    await fetchGroups()
  }, [fetchGroups])

  return { groups, loading, createGroup, getInviteToken, joinGroup, deleteGroup, addExpense, deleteExpense, refetch: fetchGroups }
}
