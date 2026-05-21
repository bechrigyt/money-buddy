import { useState, useEffect, useRef } from 'react'
import { RefreshCw } from 'lucide-react'
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
  const [fetching, setFetching] = useState(false)
  const [rateLabel, setRateLabel] = useState<string | null>(null)
  const [rateError, setRateError] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function fetchRate(currency: string) {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    setFetching(true)
    setRateError(false)
    setRateLabel(null)

    try {
      const res = await fetch(
        `https://api.frankfurter.dev/v1/latest?from=${currency}&to=SGD`,
        { signal: ctrl.signal }
      )
      const data = await res.json()
      const rate: number | undefined = data?.rates?.SGD
      if (rate) {
        onFcyRate(rate.toFixed(4))
        setRateLabel(`Live rate · ${new Date(data.date).toLocaleDateString('en-SG', { day: 'numeric', month: 'short' })}`)
      } else {
        setRateError(true)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') setRateError(true)
    } finally {
      setFetching(false)
    }
  }

  // Fetch whenever FCY is enabled or currency changes
  useEffect(() => {
    if (!enabled) return
    fetchRate(fcyCur)
    return () => abortRef.current?.abort()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, fcyCur])

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
              placeholder={fetching ? 'Fetching…' : 'Rate (SGD)'}
              value={fcyRate}
              onChange={e => { onFcyRate(e.target.value); setRateLabel(null) }}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
              min="0"
              step="0.0001"
            />
            <span className="text-xs text-gray-500">SGD</span>
            <button
              type="button"
              onClick={() => fetchRate(fcyCur)}
              title="Refresh rate"
              className="p-1 text-gray-400 hover:text-[#1D9E75] transition-colors"
            >
              <RefreshCw size={13} className={fetching ? 'animate-spin' : ''} />
            </button>
          </div>
          {/* Rate source label */}
          {rateLabel && !rateError && (
            <p className="text-xs text-gray-400">{rateLabel} · <span className="text-gray-400">edit to override</span></p>
          )}
          {rateError && (
            <p className="text-xs text-red-400">Could not fetch live rate — enter manually</p>
          )}
          {sgdPreview !== null && !isNaN(sgdPreview) && (
            <p className="text-xs text-[#1D9E75] font-medium">≈ {fmt(sgdPreview)}</p>
          )}
        </div>
      )}
    </div>
  )
}
