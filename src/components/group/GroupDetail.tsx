import { useState } from 'react'
import { ArrowLeft, Plus, Scale, Download, Trash2 } from 'lucide-react'
import type { Group, GroupExpense } from '../../types'
import { getCategoryMeta } from '../../types'
import { fmt, formatDateDisplay } from '../../lib/format'
import { AddGroupExpenseModal } from './AddGroupExpenseModal'
import { SettleUpModal } from './SettleUpModal'
import { ExportModal } from '../shared/ExportModal'

interface Props {
  group: Group
  onBack: () => void
  onAddExpense: (groupId: string, expense: GroupExpense) => void
  onDeleteExpense: (groupId: string, expenseId: string) => void
}

export function GroupDetail({ group, onBack, onAddExpense, onDeleteExpense }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [showSettle, setShowSettle] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const sorted = [...group.expenses].sort((a, b) => b.date.localeCompare(a.date))
  const total = group.expenses.reduce((sum, e) => sum + e.sgdAmount, 0)

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDeleteExpense(group.id, id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 2000)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-2 text-gray-400 hover:text-gray-600 -ml-2">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 truncate">{group.name}</h1>
          <p className="text-xs text-gray-400">{group.members.join(', ')}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#185FA5] rounded-2xl p-4 text-white">
        <p className="text-xs opacity-70 mb-1">Total expenses</p>
        <p className="text-2xl font-bold">{fmt(total)}</p>
        <p className="text-xs opacity-70 mt-1">{group.expenses.length} items · {group.members.length} members</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowAdd(true)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#185FA5] text-white rounded-xl py-2.5 text-sm font-semibold"
        >
          <Plus size={16} /> Add Expense
        </button>
        <button
          onClick={() => setShowSettle(true)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#1D9E75] text-white rounded-xl py-2.5 text-sm font-semibold"
        >
          <Scale size={16} /> Settle Up
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="px-3.5 flex items-center justify-center bg-white text-gray-600 rounded-xl py-2.5 border border-gray-200"
        >
          <Download size={16} />
        </button>
      </div>

      {/* Expense list */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {sorted.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No expenses yet</div>
        ) : (
          <ul className="divide-y divide-gray-50">
            {sorted.map(expense => {
              const meta = getCategoryMeta(expense.category)
              return (
                <li key={expense.id} className="flex items-center gap-3 px-4 py-3">
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{ backgroundColor: meta.color + '20' }}
                  >
                    {meta.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
                    <p className="text-xs text-gray-400">
                      {formatDateDisplay(expense.date)} · {expense.paidBy} paid
                    </p>
                    <p className="text-xs text-gray-400">
                      Split: {expense.splitWith.join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{fmt(expense.sgdAmount)}</span>
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        confirmDelete === expense.id ? 'bg-red-500 text-white' : 'text-gray-300 hover:text-red-400'
                      }`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {showAdd && (
        <AddGroupExpenseModal
          group={group}
          onAdd={expense => onAddExpense(group.id, expense)}
          onClose={() => setShowAdd(false)}
        />
      )}
      {showSettle && <SettleUpModal group={group} onClose={() => setShowSettle(false)} />}
      {showExport && <ExportModal mode="group" group={group} onClose={() => setShowExport(false)} />}
    </div>
  )
}
