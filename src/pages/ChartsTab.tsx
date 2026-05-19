import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Expense } from '../types'
import { DonutChart } from '../components/charts/DonutChart'
import { GaugeChart } from '../components/charts/GaugeChart'
import { DailyBarChart } from '../components/charts/DailyBarChart'
import { TrendLineChart } from '../components/charts/TrendLineChart'
import { monthLabel, prevMonth, nextMonth, monthKey } from '../lib/format'

interface Props {
  expenses: Expense[]
  monthExpenses: Expense[]
  currentMonth: string
  onMonthChange: (key: string) => void
  budget: number
}

export function ChartsTab({ expenses, monthExpenses, currentMonth, onMonthChange, budget }: Props) {
  const spent = monthExpenses.reduce((sum, e) => sum + e.sgdAmount, 0)
  const isCurrentMonth = currentMonth === monthKey()

  return (
    <div className="space-y-4">
      {/* Header */}
      <h2 className="text-xl font-bold text-gray-900">Charts</h2>

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

      <GaugeChart spent={spent} budget={budget} />
      <DonutChart expenses={monthExpenses} />
      <DailyBarChart expenses={monthExpenses} monthKey={currentMonth} />
      <TrendLineChart expenses={expenses} />
    </div>
  )
}
