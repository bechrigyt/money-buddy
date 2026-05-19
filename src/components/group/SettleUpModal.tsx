import { X, ArrowRight } from 'lucide-react'
import type { Group } from '../../types'
import { computeSettlement } from '../../lib/settlement'
import { fmt } from '../../lib/format'

interface Props {
  group: Group
  onClose: () => void
}

export function SettleUpModal({ group, onClose }: Props) {
  const { balances, transactions } = computeSettlement(group)

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Settle Up · {group.name}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Balances */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Net Balances</h3>
            <div className="space-y-2">
              {group.members.map(member => {
                const bal = balances[member] ?? 0
                const isPositive = bal > 0.005
                const isNegative = bal < -0.005
                return (
                  <div key={member} className="flex items-center justify-between py-2 border-b border-gray-50">
                    <span className="text-sm font-medium text-gray-800">{member}</span>
                    <span
                      className={`text-sm font-semibold ${isPositive ? 'text-[#1D9E75]' : isNegative ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      {isPositive ? '+' : ''}{fmt(bal)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Transactions */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Payments ({transactions.length})
            </h3>
            {transactions.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Everyone is settled up!</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 bg-blue-50 rounded-xl px-4 py-3"
                  >
                    <span className="text-sm font-medium text-gray-800">{t.from}</span>
                    <ArrowRight size={14} className="text-[#185FA5] flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800">{t.to}</span>
                    <span className="ml-auto text-sm font-bold text-[#185FA5]">{fmt(t.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
