import { useState } from 'react'
import type { Group, GroupExpense } from '../types'
import { ProjectList } from '../components/group/ProjectList'
import { GroupDetail } from '../components/group/GroupDetail'

interface Props {
  groups: Group[]
  onAddGroup: (g: Group) => void
  onDeleteGroup: (id: string) => void
  onAddGroupExpense: (groupId: string, e: GroupExpense) => void
  onDeleteGroupExpense: (groupId: string, expenseId: string) => void
}

export function GroupTab({ groups, onAddGroup, onDeleteGroup, onAddGroupExpense, onDeleteGroupExpense }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = selectedId ? groups.find(g => g.id === selectedId) ?? null : null

  if (selected) {
    return (
      <GroupDetail
        group={selected}
        onBack={() => setSelectedId(null)}
        onAddExpense={onAddGroupExpense}
        onDeleteExpense={onDeleteGroupExpense}
      />
    )
  }

  return (
    <ProjectList
      groups={groups}
      onAdd={onAddGroup}
      onDelete={id => {
        if (selectedId === id) setSelectedId(null)
        onDeleteGroup(id)
      }}
      onSelect={g => setSelectedId(g.id)}
    />
  )
}
