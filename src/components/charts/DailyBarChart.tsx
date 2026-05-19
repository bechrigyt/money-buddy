import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { Expense } from '../../types'
import { fmt } from '../../lib/format'

interface Props {
  expenses: Expense[]
  monthKey: string
}

export function DailyBarChart({ expenses, monthKey }: Props) {
  const [year, month] = monthKey.split('-').map(Number)
  const daysInMonth = new Date(year, month, 0).getDate()

  const byDay: Record<number, number> = {}
  expenses.forEach(e => {
    const d = new Date(e.date + 'T00:00:00').getDate()
    byDay[d] = (byDay[d] ?? 0) + e.sgdAmount
  })

  const today = new Date()
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month
  const todayDate = isCurrentMonth ? today.getDate() : -1

  const data = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    amount: byDay[i + 1] ?? 0,
    isToday: i + 1 === todayDate,
  }))

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm h-52 flex items-center justify-center text-gray-400 text-sm">
        No data
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Daily Spending</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            interval={4}
          />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
          <Tooltip
            formatter={(val) => [fmt(Number(val)), 'Spent']}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: 12 }}
            cursor={{ fill: '#f3f4f6' }}
          />
          <Bar dataKey="amount" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.isToday ? '#185FA5' : entry.amount > 0 ? '#1D9E75' : '#e5e7eb'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
