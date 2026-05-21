import { useState } from 'react'
import type { DbGroup, DbGroupExpense } from '../hooks/useSupabaseGroups'
import type { Group, GroupExpense } from '../types'
import { ProjectList } from '../components/group/ProjectList'
import { GroupDetail } from '../components/group/GroupDetail'
import { LocalGroupDetail } from '../components/group/LocalGroupDetail'

type Selection =
  | { kind: 'shared'; id: string }
  | { kind: 'local'; id: string }
  | null

interface Props {
  // Shared groups
  sharedGroups: DbGroup[]
  sharedLoading: boolean
  currentUserId: string
  onCreateShared: (name: string, displayName: string) => Promise<{ groupId: string; token: string | null } | null>
  onDeleteShared: (id: string) => void
  onAddSharedExpense: (groupId: string, expense: Omit<DbGroupExpense, 'id' | 'group_id' | 'created_at'>) => Promise<void>
  onUpdateSharedExpense: (expenseId: string, updates: Omit<DbGroupExpense, 'id' | 'group_id' | 'created_at'>) => Promise<void>
  onDeleteSharedExpense: (expenseId: string) => Promise<void>
  onGetInviteToken: (groupId: string) => Promise<string | null>
  initialSharedGroupId?: string | null
  // Local groups
  localGroups: Group[]
  onCreateLocal: (name: string, members: string[]) => Group
  onDeleteLocal: (id: string) => void
  onAddLocalExpense: (groupId: string, expense: GroupExpense) => void
  onUpdateLocalExpense: (groupId: string, expenseId: string, updated: GroupExpense) => void
  onDeleteLocalExpense: (groupId: string, expenseId: string) => void
}

export function GroupTab({
  sharedGroups, sharedLoading, currentUserId,
  onCreateShared, onDeleteShared,
  onAddSharedExpense, onUpdateSharedExpense, onDeleteSharedExpense,
  onGetInviteToken, initialSharedGroupId,
  localGroups,
  onCreateLocal, onDeleteLocal,
  onAddLocalExpense, onUpdateLocalExpense, onDeleteLocalExpense,
}: Props) {
  const [selected, setSelected] = useState<Selection>(
    initialSharedGroupId ? { kind: 'shared', id: initialSharedGroupId } : null
  )

  // Shared group selected
  if (selected?.kind === 'shared') {
    const group = sharedGroups.find(g => g.id === selected.id) ?? null
    if (group) {
      return (
        <GroupDetail
          group={group}
          currentUserId={currentUserId}
          onBack={() => setSelected(null)}
          onAddExpense={onAddSharedExpense}
          onUpdateExpense={onUpdateSharedExpense}
          onDeleteExpense={onDeleteSharedExpense}
          onGetInviteToken={onGetInviteToken}
        />
      )
    }
  }

  // Local group selected
  if (selected?.kind === 'local') {
    const group = localGroups.find(g => g.id === selected.id) ?? null
    if (group) {
      return (
        <LocalGroupDetail
          group={group}
          onBack={() => setSelected(null)}
          onAddExpense={onAddLocalExpense}
          onUpdateExpense={onUpdateLocalExpense}
          onDeleteExpense={onDeleteLocalExpense}
        />
      )
    }
  }

  // Handle creating a local group and immediately navigating to it
  function handleAddLocal(name: string, members: string[]): string {
    const group = onCreateLocal(name, members)
    setSelected({ kind: 'local', id: group.id })
    return group.id
  }

  return (
    <ProjectList
      sharedGroups={sharedGroups}
      localGroups={localGroups}
      loading={sharedLoading}
      onAddShared={onCreateShared}
      onAddLocal={handleAddLocal}
      onDeleteShared={id => {
        if (selected?.kind === 'shared' && selected.id === id) setSelected(null)
        onDeleteShared(id)
      }}
      onDeleteLocal={id => {
        if (selected?.kind === 'local' && selected.id === id) setSelected(null)
        onDeleteLocal(id)
      }}
      onSelectShared={g => setSelected({ kind: 'shared', id: g.id })}
      onSelectLocal={g => setSelected({ kind: 'local', id: g.id })}
    />
  )
}
