import { useState } from 'react'
import { Pencil, Check } from 'lucide-react'
import { fmt, daysLeftInMonth, monthKey } from '../../lib/format'

interface Props {
  currentMonthKey: string
  spent: number
  budget: number
  onSetBudget: (amount: number) => void
}

export function BudgetCard({ currentMonthKey, spent, budget, onSetBudget }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')

  const pct = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0
  const remaining = Math.max(budget - spent, 0)
  const daysLeft = daysLeftInMonth(currentMonthKey)
  const daily = daysLeft > 0 ? remaining / daysLeft : 0

  const barColor =
    pct > 100 ? '#E24B4A' : pct > 80 ? '#EF9F27' : '#1D9E75'

  const isCurrentMonth = currentMonthKey === monthKey()

  function save() {
    const n = parseFloat(draft)
    if (!isNaN(n) && n >= 0) onSetBudget(n)
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-gray-500 mb-0.5">Monthly Budget</p>
          {editing ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">S$</span>
              <input
                autoFocus
                type="number"
                value={draft}
                onChange={e => setDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && save()}
                className="w-28 border border-[#1D9E75] rounded-lg px-2 py-1 text-sm font-semibold focus:outline-none"
                placeholder="0.00"
                min="0"
              />
              <button onClick={save} className="p-1 text-[#1D9E75]">
                <Check size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {budget > 0 ? fmt(budget) : 'Not set'}
              </span>
              {isCurrentMonth && (
                <button
                  onClick={() => { setDraft(budget > 0 ? budget.toString() : ''); setEditing(true) }}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <Pencil size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 mb-0.5">Spent</p>
          <p className="text-lg font-bold" style={{ color: barColor }}>{fmt(spent)}</p>
        </div>
      </div>

      {budget > 0 && (
        <>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, backgroundColor: barColor }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{pct.toFixed(0)}% used</span>
            {isCurrentMonth && budget > 0 && (
              <span>
                {fmt(daily)}/day · {daysLeft}d left
              </span>
            )}
            {!isCurrentMonth && (
              <span className={spent > budget ? 'text-red-500 font-medium' : 'text-[#1D9E75] font-medium'}>
                {spent > budget ? `Over by ${fmt(spent - budget)}` : `Under by ${fmt(budget - spent)}`}
              </span>
            )}
          </div>
        </>
      )}

      {budget === 0 && isCurrentMonth && (
        <p className="text-xs text-gray-400">
          Tap <Pencil size={10} className="inline" /> to set your monthly budget
        </p>
      )}
    </div>
  )
}
