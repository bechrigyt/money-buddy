import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import type { Expense } from '../../types'
import { fmt, monthLabel } from '../../lib/format'

interface Props {
  expenses: Expense[]
}

export function TrendLineChart({ expenses }: Props) {
  // Build last 6 months
  const months: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(`${d.getFullYear()}-${d.getMonth() + 1}`)
  }

  const byMonth: Record<string, number> = {}
  expenses.forEach(e => {
    const [y, m] = e.date.split('-')
    const key = `${y}-${parseInt(m)}`
    byMonth[key] = (byMonth[key] ?? 0) + e.sgdAmount
  })

  const data = months.map(key => ({
    month: monthLabel(key).replace(/\s+\d{4}$/, ''), // strip year for compact label
    amount: byMonth[key] ?? 0,
    fullLabel: monthLabel(key),
  }))

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">6-Month Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
          <Tooltip
            formatter={(val) => [fmt(Number(val)), 'Total']}
            labelFormatter={(_, payload) => payload?.[0]?.payload?.fullLabel ?? ''}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)', fontSize: 12 }}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#1D9E75"
            strokeWidth={2.5}
            dot={{ fill: '#1D9E75', r: 4 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
