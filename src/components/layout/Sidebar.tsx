import { useState } from 'react'
import { Wallet, BarChart2, Users, Settings } from 'lucide-react'
import { LogoMark } from '../shared/LogoMark'
import { SettingsPanel } from '../shared/SettingsPanel'

type Tab = 'personal' | 'charts' | 'group'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
  defaultTab: 'personal' | 'group'
  onChangeDefaultTab: (tab: 'personal' | 'group') => void
}

const TABS = [
  { id: 'personal' as Tab, label: 'Personal', Icon: Wallet },
  { id: 'charts'   as Tab, label: 'Charts',   Icon: BarChart2 },
  { id: 'group'    as Tab, label: 'Groups',   Icon: Users },
]

export function Sidebar({ active, onChange, defaultTab, onChangeDefaultTab }: Props) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <aside className="hidden sm:flex flex-col items-center gap-1 py-4 w-20 bg-white border-r border-gray-200 min-h-screen fixed top-0 left-0 z-40">
      {/* Logo mark */}
      <div className="mb-4 mt-2">
        <LogoMark size={44} />
      </div>

      {/* Nav tabs */}
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 w-full py-3 px-1 transition-colors ${
              isActive ? 'text-[#2B8EEE]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        )
      })}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Settings gear */}
      <div className="relative mb-2">
        <button
          onClick={() => setShowSettings(v => !v)}
          className={`flex flex-col items-center gap-1 w-full py-3 px-1 transition-colors ${
            showSettings ? 'text-[#2B8EEE]' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Settings size={20} strokeWidth={showSettings ? 2.5 : 1.8} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>

        {showSettings && (
          <SettingsPanel
            defaultTab={defaultTab}
            onChangeDefaultTab={onChangeDefaultTab}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </aside>
  )
}
