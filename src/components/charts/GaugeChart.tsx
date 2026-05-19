import { PieChart, Pie, Cell } from 'recharts'
import { fmt } from '../../lib/format'

interface Props {
  spent: number
  budget: number
}

export function GaugeChart({ spent, budget }: Props) {
  const pct = budget > 0 ? Math.min(spent / budget, 1) : 0
  const remaining = Math.max(budget - spent, 0)

  const color = pct > 1 ? '#E24B4A' : pct > 0.8 ? '#EF9F27' : '#1D9E75'

  // 270° gauge: fill arc from left to right, remaining arc is gray
  const fillAngle = pct * 270
  const emptyAngle = 270 - fillAngle

  const data = [
    { value: fillAngle },
    { value: emptyAngle },
    { value: 90 }, // invisible gap to close the circle on the bottom
  ]

  if (budget === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm h-48 flex items-center justify-center text-gray-400 text-sm">
        Set a budget to see usage
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col items-center">
      <h3 className="text-sm font-semibold text-gray-700 mb-1 self-start">Budget Usage</h3>
      <div className="relative">
        <PieChart width={180} height={130}>
          <Pie
            data={data}
            cx={90}
            cy={110}
            startAngle={225}
            endAngle={-45}
            innerRadius={55}
            outerRadius={80}
            paddingAngle={0}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
            <Cell fill="transparent" />
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-4">
          <span className="text-xl font-bold text-gray-900">{Math.round(pct * 100)}%</span>
          <span className="text-xs text-gray-400">used</span>
        </div>
      </div>
      <div className="flex gap-6 mt-1 text-xs text-gray-500">
        <div className="text-center">
          <p className="font-semibold text-gray-900">{fmt(spent)}</p>
          <p>Spent</p>
        </div>
        <div className="text-center">
          <p className="font-semibold" style={{ color }}>{fmt(remaining)}</p>
          <p>Remaining</p>
        </div>
      </div>
    </div>
  )
}
