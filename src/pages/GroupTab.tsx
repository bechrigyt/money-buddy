import { useState } from 'react'
import type { DbGroup, DbGroupExpense } from '../hooks/useSupabaseGroups'
import { ProjectList } from '../components/group/ProjectList'
import { GroupDetail } from '../components/group/GroupDetail'

interface Props {
  groups: DbGroup[]
  loading: boolean
  currentUserId: string
  onCreateGroup: (name: string, displayName: string) => Promise<{ groupId: string; token: string | null } | null>
  onDeleteGroup: (id: string) => void
  onAddExpense: (groupId: string, expense: Omit<DbGroupExpense, 'id' | 'group_id' | 'created_at'>) => Promise<void>
  onDeleteExpense: (expenseId: string) => Promise<void>
  onGetInviteToken: (groupId: string) => Promise<string | null>
  initialGroupId?: string | null
}

export function GroupTab({
  groups, loading, currentUserId,
  onCreateGroup, onDeleteGroup,
  onAddExpense, onDeleteExpense,
  onGetInviteToken, initialGroupId,
}: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(initialGroupId ?? null)

  const selected = selectedId ? groups.find(g => g.id === selectedId) ?? null : null

  if (selected) {
    return (
      <GroupDetail
        group={selected}
        currentUserId={currentUserId}
        onBack={() => setSelectedId(null)}
        onAddExpense={onAddExpense}
        onDeleteExpense={onDeleteExpense}
        onGetInviteToken={onGetInviteToken}
      />
    )
  }

  return (
    <ProjectList
      groups={groups}
      loading={loading}
      onAdd={onCreateGroup}
      onDelete={id => {
        if (selectedId === id) setSelectedId(null)
        onDeleteGroup(id)
      }}
      onSelect={g => setSelectedId(g.id)}
    />
  )
}
