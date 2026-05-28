import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Download } from 'lucide-react'
import type { Expense } from '../types'
import { BudgetCard } from '../components/personal/BudgetCard'
import { ExpenseList } from '../components/personal/ExpenseList'
import { AddExpenseModal } from '../components/personal/AddExpenseModal'
import { ExportModal } from '../components/shared/ExportModal'
import { monthLabel, prevMonth, nextMonth, monthKey } from '../lib/format'

interface Props {
  monthExpenses: Expense[]
  currentMonth: string
  onMonthChange: (key: string) => void
  budget: number
  onSetBudget: (amt: number) => void
  onAddExpense: (e: Expense) => void
  onUpdateExpense: (id: string, e: Expense) => void
  onDeleteExpense: (id: string) => void
  userName?: string
}

export function PersonalTab({
  monthExpenses,
  currentMonth,
  onMonthChange,
  budget,
  onSetBudget,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  userName,
}: Props) {
  const [showAdd, setShowAdd] = useState(false)
  const [showExport, setShowExport] = useState(false)

  const spent = monthExpenses.reduce((sum, e) => sum + e.sgdAmount, 0)
  const isCurrentMonth = currentMonth === monthKey()

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm text-gray-400">
            Welcome to&nbsp;
            <span style={{ fontFamily: "'Poppins', sans-serif" }} className="font-bold text-[#1F2229]">Money </span>
            <span style={{ fontFamily: "'Poppins', sans-serif" }} className="font-bold text-[#2B8EEE]">Buddy</span>
            {userName && <span className="font-normal text-gray-400">, {userName}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowExport(true)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <Download size={18} />
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 bg-[#2DC64A] text-white px-3 py-2 rounded-xl text-sm font-semibold"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onMonthChange(prevMonth(currentMonth))}
          className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-gray-700">{monthLabel(currentMonth)}</span>
        <button
          onClick={() => onMonthChange(nextMonth(currentMonth))}
          disabled={isCurrentMonth}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-30 rounded-lg"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <BudgetCard
        currentMonthKey={currentMonth}
        spent={spent}
        budget={budget}
        onSetBudget={onSetBudget}
      />

      <ExpenseList expenses={monthExpenses} onDelete={onDeleteExpense} onEdit={e => onUpdateExpense(e.id, e)} />

      {showAdd && (
        <AddExpenseModal onAdd={onAddExpense} onClose={() => setShowAdd(false)} />
      )}
      {showExport && (
        <ExportModal
          mode="personal"
          expenses={monthExpenses}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
