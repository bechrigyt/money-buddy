import { useState } from 'react'
import { X } from 'lucide-react'
import type { DbGroup, DbGroupExpense } from '../../hooks/useSupabaseGroups'
import type { Category } from '../../types'
import { CATEGORIES } from '../../types'
import { FCYToggle } from '../shared/FCYToggle'
import { isoToday } from '../../lib/format'

interface Props {
  group: DbGroup
  currentUserId: string
  myName: string
  onAdd: (expense: Omit<DbGroupExpense, 'id' | 'group_id' | 'created_at'>) => Promise<void>
  onClose: () => void
}

export function AddGroupExpenseModal({ group, currentUserId, myName, onAdd, onClose }: Props) {
  const memberNames = group.members.map(m => m.display_name)

  const [category, setCategory] = useState<Category>('Food')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(isoToday())
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [paidBy, setPaidBy] = useState(myName)
  const [splitWith, setSplitWith] = useState<string[]>(memberNames)
  const [isFCY, setIsFCY] = useState(false)
  const [fcyAmt, setFcyAmt] = useState('')
  const [fcyCur, setFcyCur] = useState('USD')
  const [fcyRate, setFcyRate] = useState('')
  const [saving, setSaving] = useState(false)

  function toggleSplit(member: string) {
    setSplitWith(prev =>
      prev.includes(member) ? prev.filter(m => m !== member) : [...prev, member]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (splitWith.length === 0) return
    setSaving(true)

    let sgdAmount: number
    if (isFCY && fcyAmt && fcyRate) {
      sgdAmount = parseFloat(fcyAmt) * parseFloat(fcyRate)
    } else {
      sgdAmount = parseFloat(amount)
    }
    if (!sgdAmount || isNaN(sgdAmount) || sgdAmount <= 0) { setSaving(false); return }

    await onAdd({
      paid_by_user_id: currentUserId,
      paid_by_name: paidBy,
      category,
      date,
      description: description.trim() || category,
      notes: notes.trim() || undefined,
      sgd_amount: parseFloat(sgdAmount.toFixed(4)),
      is_fcy: isFCY,
      fcy_amt: isFCY && fcyAmt ? parseFloat(fcyAmt) : undefined,
      fcy_cur: isFCY ? fcyCur : undefined,
      fcy_rate: isFCY && fcyRate ? parseFloat(fcyRate) : undefined,
      split_with: splitWith,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Add Group Expense</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setCategory(cat.label)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border text-xs transition-all ${
                    category === cat.label ? 'border-transparent text-white' : 'border-gray-200 text-gray-600'
                  }`}
                  style={category === cat.label ? { backgroundColor: cat.color } : {}}
                >
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span className="leading-tight text-center" style={{ fontSize: '10px' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description + Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. Dinner at Shibuya"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
            />
          </div>

          {/* Paid by */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Paid by</label>
            <div className="flex flex-wrap gap-2">
              {memberNames.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaidBy(m)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    paidBy === m ? 'bg-[#2B8EEE] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Split with */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Split with</label>
            <div className="flex flex-wrap gap-2">
              {memberNames.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleSplit(m)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    splitWith.includes(m) ? 'bg-[#2DC64A] text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
            {splitWith.length === 0 && (
              <p className="text-xs text-red-500 mt-1">Select at least one member</p>
            )}
          </div>

          {/* FCY */}
          <FCYToggle
            enabled={isFCY}
            onToggle={setIsFCY}
            fcyAmt={fcyAmt}
            fcyCur={fcyCur}
            fcyRate={fcyRate}
            onFcyAmt={setFcyAmt}
            onFcyCur={setFcyCur}
            onFcyRate={setFcyRate}
          />

          {!isFCY && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (SGD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">S$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra details..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
            />
          </div>

          <button
            type="submit"
            disabled={splitWith.length === 0 || saving}
            className="w-full bg-[#2B8EEE] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#1d7fd8] transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
