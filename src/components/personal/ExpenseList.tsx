import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Expense, Category } from '../../types'
import { CATEGORIES, getCategoryMeta } from '../../types'
import { fmt, formatDateDisplay } from '../../lib/format'

interface Props {
  expenses: Expense[]
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, onDelete }: Props) {
  const [filter, setFilter] = useState<Category | 'All'>('All')
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const filtered = filter === 'All' ? expenses : expenses.filter(e => e.category === filter)
  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date))

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDelete(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 2000)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Filter strip */}
      <div className="flex gap-1.5 p-3 overflow-x-auto scrollbar-hide border-b border-gray-100">
        <button
          onClick={() => setFilter('All')}
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
            filter === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.label}
            onClick={() => setFilter(cat.label)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
              filter === cat.label ? 'text-white' : 'bg-gray-100 text-gray-600'
            }`}
            style={filter === cat.label ? { backgroundColor: cat.color } : {}}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* List */}
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
                    {formatDateDisplay(expense.date)} · {expense.category}
                    {expense.isFCY && expense.fcyAmt && expense.fcyCur && (
                      <span className="text-[#185FA5]"> · {expense.fcyCur} {expense.fcyAmt.toFixed(2)}</span>
                    )}
                  </p>
                  {expense.notes && (
                    <p className="text-xs text-gray-400 truncate">{expense.notes}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">{fmt(expense.sgdAmount)}</span>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      confirmDelete === expense.id
                        ? 'bg-red-500 text-white'
                        : 'text-gray-300 hover:text-red-400'
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
  )
}
