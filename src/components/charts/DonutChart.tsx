import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { Expense } from '../../types'
import { getCategoryMeta } from '../../types'
import { fmt } from '../../lib/format'

interface Props {
  expenses: Expense[]
}

export function DonutChart({ expenses }: Props) {
  const byCategory: Record<string, number> = {}
  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] ?? 0) + e.sgdAmount
  })

  const data = Object.entries(byCategory)
    .map(([label, value]) => ({ label, value, color: getCategoryMeta(label as any).color }))
    .sort((a, b) => b.value - a.value)

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm h-64 flex items-center justify-center text-gray-400 text-sm">
        No data
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Spend by Category</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(val) => [fmt(Number(val)), '']}
            contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-1 mt-2">
        {data.slice(0, 6).map(d => (
          <div key={d.label} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
            <span className="truncate">{d.label}</span>
            <span className="ml-auto font-medium text-gray-800">{fmt(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
