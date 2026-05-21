import { useState } from 'react'
import { Plus, Users, Trash2, ChevronRight } from 'lucide-react'
import type { DbGroup } from '../../hooks/useSupabaseGroups'
import { fmt } from '../../lib/format'
import { AddGroupModal } from './AddGroupModal'

interface Props {
  groups: DbGroup[]
  loading: boolean
  onAdd: (name: string, displayName: string) => Promise<string | null>
  onDelete: (id: string) => void
  onSelect: (group: DbGroup) => void
}

export function ProjectList({ groups, loading, onAdd, onDelete, onSelect }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 2000)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Groups</h2>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#2B8EEE] text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-[#1d7fd8] transition-colors"
        >
          <Plus size={16} /> New Group
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm py-14 flex items-center justify-center text-gray-400 text-sm">
          Loading groups…
        </div>
      ) : groups.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm py-14 flex flex-col items-center gap-3 text-gray-400">
          <Users size={36} strokeWidth={1.2} />
          <p className="text-sm">No groups yet — create one to split expenses</p>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map(group => {
            const total = group.expenses.reduce((sum, e) => sum + e.sgd_amount, 0)
            return (
              <button
                key={group.id}
                onClick={() => onSelect(group)}
                className="w-full bg-white rounded-2xl shadow-sm px-4 py-3.5 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#2B8EEE]/10 flex items-center justify-center flex-shrink-0">
                  <Users size={18} className="text-[#2B8EEE]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{group.name}</p>
                  <p className="text-xs text-gray-400">
                    {group.members.length} member{group.members.length !== 1 ? 's' : ''} · {group.expenses.length} expense{group.expenses.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800">{fmt(total)}</span>
                  <button
                    onClick={e => handleDelete(e, group.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      confirmDelete === group.id ? 'bg-red-500 text-white' : 'text-gray-300 hover:text-red-400'
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </button>
            )
          })}
        </div>
      )}

      {showAdd && <AddGroupModal onAdd={onAdd} onClose={() => setShowAdd(false)} />}
    </div>
  )
}
