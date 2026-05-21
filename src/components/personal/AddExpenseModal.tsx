import { useState } from 'react'
import { X } from 'lucide-react'
import { CATEGORIES } from '../../types'
import type { Category, Expense } from '../../types'
import { FCYToggle } from '../shared/FCYToggle'
import { isoToday } from '../../lib/format'

interface Props {
  onAdd: (expense: Expense) => void
  onClose: () => void
  initialExpense?: Expense
}

export function AddExpenseModal({ onAdd, onClose, initialExpense }: Props) {
  const isEdit = !!initialExpense
  const [category, setCategory] = useState<Category>(initialExpense?.category ?? 'Food')
  const [description, setDescription] = useState(initialExpense?.description ?? '')
  const [date, setDate] = useState(initialExpense?.date ?? isoToday())
  const [amount, setAmount] = useState(initialExpense && !initialExpense.isFCY ? String(initialExpense.sgdAmount) : '')
  const [notes, setNotes] = useState(initialExpense?.notes ?? '')
  const [isFCY, setIsFCY] = useState(initialExpense?.isFCY ?? false)
  const [fcyAmt, setFcyAmt] = useState(initialExpense?.fcyAmt != null ? String(initialExpense.fcyAmt) : '')
  const [fcyCur, setFcyCur] = useState(initialExpense?.fcyCur ?? 'USD')
  const [fcyRate, setFcyRate] = useState(initialExpense?.fcyRate != null ? String(initialExpense.fcyRate) : '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let sgdAmount: number

    if (isFCY && fcyAmt && fcyRate) {
      sgdAmount = parseFloat(fcyAmt) * parseFloat(fcyRate)
    } else {
      sgdAmount = parseFloat(amount)
    }

    if (!sgdAmount || isNaN(sgdAmount) || sgdAmount <= 0) return

    const expense: Expense = {
      id: initialExpense?.id ?? crypto.randomUUID(),
      category,
      date,
      description: description.trim() || category,
      notes: notes.trim() || undefined,
      sgdAmount: parseFloat(sgdAmount.toFixed(4)),
      isFCY,
      fcyAmt: isFCY && fcyAmt ? parseFloat(fcyAmt) : undefined,
      fcyCur: isFCY ? fcyCur : undefined,
      fcyRate: isFCY && fcyRate ? parseFloat(fcyRate) : undefined,
    }

    onAdd(expense)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{isEdit ? 'Edit Expense' : 'Add Expense'}</h2>
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
                    category === cat.label
                      ? 'border-transparent text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                  style={category === cat.label ? { backgroundColor: cat.color } : {}}
                >
                  <span className="text-base leading-none">{cat.emoji}</span>
                  <span className="leading-tight text-center" style={{ fontSize: '10px' }}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder={`e.g. Lunch at hawker`}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
            />
          </div>

          {/* FCY Toggle */}
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

          {/* SGD Amount (shown when not FCY) */}
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
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any extra details..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#1D9E75]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1D9E75] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#179062] transition-colors mt-2"
          >
            {isEdit ? 'Save Changes' : 'Add Expense'}
          </button>
        </form>
      </div>
    </div>
  )
}
