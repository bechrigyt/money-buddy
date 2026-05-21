import { Wallet, BarChart2, Users } from 'lucide-react'
import { LogoMark } from '../shared/LogoMark'

type Tab = 'personal' | 'charts' | 'group'

interface Props {
  active: Tab
  onChange: (tab: Tab) => void
}

const TABS = [
  { id: 'personal' as Tab, label: 'Personal', Icon: Wallet },
  { id: 'charts'   as Tab, label: 'Charts',   Icon: BarChart2 },
  { id: 'group'    as Tab, label: 'Groups',   Icon: Users },
]

export function Sidebar({ active, onChange }: Props) {
  return (
    <aside className="hidden sm:flex flex-col items-center gap-1 py-4 w-20 bg-white border-r border-gray-200 min-h-screen fixed top-0 left-0 z-40">
      {/* Logo mark */}
      <div className="mb-4 mt-2">
        <LogoMark size={36} />
      </div>

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
    </aside>
  )
}
