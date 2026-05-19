import { Wallet, BarChart2, Users } from 'lucide-react'

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

export function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex sm:hidden z-40 safe-bottom">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="flex-1 flex flex-col items-center gap-1 py-2 min-h-[56px]"
          >
            <Icon
              size={22}
              className={isActive ? 'text-[#1D9E75]' : 'text-gray-400'}
              strokeWidth={isActive ? 2.5 : 1.8}
            />
            <span
              className={`text-[10px] font-medium ${isActive ? 'text-[#1D9E75]' : 'text-gray-400'}`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
