import { fmt } from '../../lib/format'

interface Props {
  enabled: boolean
  onToggle: (v: boolean) => void
  fcyAmt: string
  fcyCur: string
  fcyRate: string
  onFcyAmt: (v: string) => void
  onFcyCur: (v: string) => void
  onFcyRate: (v: string) => void
}

const COMMON_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'MYR', 'THB', 'HKD', 'CNY', 'KRW', 'IDR', 'PHP', 'VND']

export function FCYToggle({ enabled, onToggle, fcyAmt, fcyCur, fcyRate, onFcyAmt, onFcyCur, onFcyRate }: Props) {
  const sgdPreview = enabled && fcyAmt && fcyRate
    ? parseFloat(fcyAmt) * parseFloat(fcyRate)
    : null

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => onToggle(!enabled)}
          className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-[#1D9E75]' : 'bg-gray-300'}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : ''}`}
          />
        </div>
        <span className="text-sm text-gray-600">Foreign currency</span>
      </label>

      {enabled && (
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <select
              value={fcyCur}
              onChange={e => onFcyCur(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white w-28"
            >
              {COMMON_CURRENCIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={fcyAmt}
              onChange={e => onFcyAmt(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">1 {fcyCur || '?'} =</span>
            <input
              type="number"
              placeholder="Rate (SGD)"
              value={fcyRate}
              onChange={e => onFcyRate(e.target.value)}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              min="0"
              step="0.0001"
            />
            <span className="text-xs text-gray-500">SGD</span>
          </div>
          {sgdPreview !== null && !isNaN(sgdPreview) && (
            <p className="text-xs text-[#1D9E75] font-medium">≈ {fmt(sgdPreview)}</p>
          )}
        </div>
      )}
    </div>
  )
}
