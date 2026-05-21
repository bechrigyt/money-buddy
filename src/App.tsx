import { useEffect, useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { BottomNav } from './components/layout/BottomNav'
import { PersonalTab } from './pages/PersonalTab'
import { ChartsTab } from './pages/ChartsTab'
import { GroupTab } from './pages/GroupTab'
import { LoginPage } from './pages/LoginPage'
import { useAuth } from './contexts/AuthContext'
import { useExpenses } from './hooks/useExpenses'
import { useBudget } from './hooks/useBudget'
import { useGroups } from './hooks/useGroups'
import { monthKey } from './lib/format'
import { setStorageUser, storage } from './lib/storage'
import { LogOut } from 'lucide-react'
import { LogoMark } from './components/shared/LogoMark'

type Tab = 'personal' | 'charts' | 'group'

function AppShell() {
  const { user, signOut } = useAuth()
  const [currentMonth, setCurrentMonth] = useState(monthKey())
  const [defaultTab, setDefaultTab] = useState<'personal' | 'group'>('personal')

  // Point storage at this user's namespace, then read their default tab
  useEffect(() => {
    if (user) {
      setStorageUser(user.id)
      setDefaultTab(storage.getDefaultTab())
    }
  }, [user?.id])

  const [tab, setTab] = useState<Tab>(() => storage.getDefaultTab())

  const { expenses, addExpense, deleteExpense } = useExpenses()
  const { getBudget, setBudget } = useBudget()
  const { groups, addGroup, deleteGroup, addGroupExpense, deleteGroupExpense } = useGroups()

  const monthExpenses = expenses.filter(e => {
    const [y, m] = e.date.split('-')
    return `${y}-${parseInt(m)}` === currentMonth
  })

  return (
    <div className="min-h-svh bg-gray-50">
      <Sidebar
        active={tab}
        onChange={setTab}
        defaultTab={defaultTab}
        onChangeDefaultTab={(t) => { setDefaultTab(t); setTab(t) }}
      />

      {/* Sign-out button — top right */}
      <button
        onClick={signOut}
        title="Sign out"
        className="fixed top-3 right-3 z-50 flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 bg-white border border-gray-100 rounded-lg px-2.5 py-1.5 shadow-sm transition-colors"
      >
        <LogOut size={13} />
        <span className="hidden sm:inline">Sign out</span>
      </button>

      <main className="sm:ml-20 pb-20 sm:pb-0 min-h-svh">
        <div className="max-w-lg mx-auto px-4 py-5 sm:py-6">
          {tab === 'personal' && (
            <PersonalTab
              monthExpenses={monthExpenses}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              budget={getBudget(currentMonth)}
              onSetBudget={amt => setBudget(currentMonth, amt)}
              onAddExpense={addExpense}
              onDeleteExpense={deleteExpense}
            />
          )}
          {tab === 'charts' && (
            <ChartsTab
              expenses={expenses}
              monthExpenses={monthExpenses}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              budget={getBudget(currentMonth)}
            />
          )}
          {tab === 'group' && (
            <GroupTab
              groups={groups}
              onAddGroup={addGroup}
              onDeleteGroup={deleteGroup}
              onAddGroupExpense={addGroupExpense}
              onDeleteGroupExpense={deleteGroupExpense}
            />
          )}
        </div>
      </main>

      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse opacity-70"><LogoMark size={48} /></div>
      </div>
    )
  }

  return user ? <AppShell /> : <LoginPage />
}
