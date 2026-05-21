import { useState } from 'react'
import { ArrowLeft, Plus, Scale, Download, Trash2, Pencil, Link, Check } from 'lucide-react'
import type { DbGroup, DbGroupExpense } from '../../hooks/useSupabaseGroups'
import { getCategoryMeta } from '../../types'
import { fmt, formatDateDisplay } from '../../lib/format'
import { AddGroupExpenseModal } from './AddGroupExpenseModal'
import { SettleUpModal } from './SettleUpModal'
import { ExportModal } from '../shared/ExportModal'

interface Props {
  group: DbGroup
  currentUserId: string
  onBack: () => void
  onAddExpense: (groupId: string, expense: Omit<DbGroupExpense, 'id' | 'group_id' | 'created_at'>) => Promise<void>
  onUpdateExpense: (expenseId: string, updates: Omit<DbGroupExpense, 'id' | 'group_id' | 'created_at'>) => Promise<void>
  onDeleteExpense: (expenseId: string) => Promise<void>
  onGetInviteToken: (groupId: string) => Promise<string | null>
}

/** Format a foreign-currency amount with appropriate decimal places */
function fmtFcy(amt: number, cur: string): string {
  const noDecimals = ['JPY', 'KRW', 'IDR', 'VND']
  return noDecimals.includes(cur)
    ? Math.round(amt).toLocaleString('en-SG')
    : amt.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function GroupDetail({ group, currentUserId, onBack, onAddExpense, onUpdateExpense, onDeleteExpense, onGetInviteToken }: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [showSettle, setShowSettle] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [editingExpense, setEditingExpense] = useState<DbGroupExpense | null>(null)
  const [copied, setCopied] = useState(false)

  const sorted = [...group.expenses].sort((a, b) => b.date.localeCompare(a.date))
  const total = group.expenses.reduce((sum, e) => sum + e.sgd_amount, 0)
  const memberNames = group.members.map(m => m.display_name)
  const myName = group.members.find(m => m.user_id === currentUserId)?.display_name ?? 'Me'

  async function handleCopyInvite() {
    const token = await onGetInviteToken(group.id)
    if (!token) return
    const link = `${window.location.origin}?join=${token}`
    navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  function handleDelete(id: string) {
    if (confirmDelete === id) {
      onDeleteExpense(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 2000)
    }
  }

  // Convert DB expenses to legacy format for SettleUpModal / ExportModal
  const legacyGroup = {
    id: group.id,
    name: group.name,
    members: memberNames,
    createdAt: group.created_at,
    expenses: group.expenses.map(e => ({
      id: e.id,
      category: e.category,
      date: e.date,
      description: e.description,
      notes: e.notes,
      sgdAmount: e.sgd_amount,
      isFCY: e.is_fcy,
      fcyAmt: e.fcy_amt,
      fcyCur: e.fcy_cur,
      fcyRate: e.fcy_rate,
      paidBy: e.paid_by_name,
      splitWith: e.split_with,
    })),
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
          <p className="text-xs text-gray-400">{memberNames.join(', ')}</p>
        </div>
        {/* Invite link button */}
        <button
          onClick={handleCopyInvite}
          title="Copy invite link"
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border transition-all ${
            copied
              ? 'bg-green-50 border-green-200 text-green-600'
              : 'bg-white border-gray-200 text-gray-500 hover:border-[#2B8EEE] hover:text-[#2B8EEE]'
          }`}
        >
          {copied ? <Check size={13} /> : <Link size={13} />}
          {copied ? 'Copied!' : 'Invite'}
        </button>
      </div>

      {/* Stats */}
      <div className="bg-[#2B8EEE] rounded-2xl p-4 text-white">
        <p className="text-xs opacity-70 mb-1">Total expenses</p>
        <p className="text-2xl font-bold">{fmt(total)}</p>
        <p className="text-xs opacity-70 mt-1">{group.expenses.length} item{group.expenses.length !== 1 ? 's' : ''} · {group.members.length} member{group.members.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowAdd(true)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#2B8EEE] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#1d7fd8] transition-colors"
        >
          <Plus size={16} /> Add Expense
        </button>
        <button
          onClick={() => setShowSettle(true)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#2DC64A] text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-[#24b040] transition-colors"
        >
          <Scale size={16} /> Settle Up
        </button>
        <button
          onClick={() => setShowExport(true)}
          className="px-3.5 flex items-center justify-center bg-white text-gray-600 rounded-xl py-2.5 border border-gray-200 hover:border-gray-300"
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
              const canDelete = expense.paid_by_user_id === currentUserId
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
                      {formatDateDisplay(expense.date)} · {expense.paid_by_name} paid
                    </p>
                    <p className="text-xs text-gray-400">Split: {expense.split_with.join(', ')}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        {fmt(expense.sgd_amount)}
                        {expense.is_fcy && expense.fcy_amt != null && expense.fcy_cur && (
                          <span className="text-gray-400 font-normal"> | {expense.fcy_cur} {fmtFcy(expense.fcy_amt, expense.fcy_cur)}</span>
                        )}
                      </p>
                    </div>
                    {canDelete && (
                      <>
                        <button
                          onClick={() => setEditingExpense(expense)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-[#2B8EEE] transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            confirmDelete === expense.id ? 'bg-red-500 text-white' : 'text-gray-300 hover:text-red-400'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
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
          currentUserId={currentUserId}
          myName={myName}
          onAdd={expense => onAddExpense(group.id, expense)}
          onClose={() => setShowAdd(false)}
        />
      )}
      {editingExpense && (
        <AddGroupExpenseModal
          group={group}
          currentUserId={currentUserId}
          myName={myName}
          initialExpense={editingExpense}
          onAdd={updates => onUpdateExpense(editingExpense.id, updates)}
          onClose={() => setEditingExpense(null)}
        />
      )}
      {showSettle && <SettleUpModal group={legacyGroup} onClose={() => setShowSettle(false)} />}
      {showExport && <ExportModal mode="group" group={legacyGroup} onClose={() => setShowExport(false)} />}
    </div>
  )
}
