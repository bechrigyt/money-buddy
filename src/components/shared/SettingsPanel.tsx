import { useEffect, useRef } from 'react'
import { X, Clock, CalendarDays, Timer } from 'lucide-react'
import { storage } from '../../lib/storage'
import { formatDuration } from '../../lib/activityTracker'
import type { ActivityStats } from '../../lib/activityTracker'

type DefaultTab = 'personal' | 'group'

interface Props {
  defaultTab: DefaultTab
  onChangeDefaultTab: (tab: DefaultTab) => void
  activityStats: ActivityStats
  onClose: () => void
}

export function SettingsPanel({ defaultTab, onChangeDefaultTab, activityStats, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onClose])

  function select(tab: DefaultTab) {
    storage.saveDefaultTab(tab)
    onChangeDefaultTab(tab)
  }

  const statRows = [
    {
      icon: <Clock size={13} className="text-[#2B8EEE]" />,
      label: 'Total time',
      value: formatDuration(activityStats.totalMs),
    },
    {
      icon: <CalendarDays size={13} className="text-[#2DC64A]" />,
      label: 'Days logged in',
      value: activityStats.daysLoggedIn.toString(),
    },
    {
      icon: <Timer size={13} className="text-purple-400" />,
      label: 'Avg per session',
      value: activityStats.sessionCount > 0 ? formatDuration(activityStats.avgMs) : '—',
    },
  ]

  return (
    <div
      ref={ref}
      className="absolute left-[84px] bottom-4 z-50 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</span>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Default page */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Default page on login</p>
        <div className="flex gap-2">
          <button
            onClick={() => select('personal')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              defaultTab === 'personal'
                ? 'bg-[#2B8EEE] text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Personal
          </button>
          <button
            onClick={() => select('group')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
              defaultTab === 'group'
                ? 'bg-[#2B8EEE] text-white shadow-sm'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            Groups
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100" />

      {/* Usage stats */}
      <div>
        <p className="text-xs text-gray-400 mb-2">Your usage</p>
        <div className="space-y-2">
          {statRows.map(row => (
            <div key={row.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                {row.icon}
                {row.label}
              </div>
              <span className="text-xs font-semibold text-gray-800 tabular-nums">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
