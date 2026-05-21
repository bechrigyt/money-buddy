import { useEffect, useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { BottomNav } from './components/layout/BottomNav'
import { PersonalTab } from './pages/PersonalTab'
import { ChartsTab } from './pages/ChartsTab'
import { GroupTab } from './pages/GroupTab'
import { LoginPage } from './pages/LoginPage'
import { JoinGroupModal } from './components/group/JoinGroupModal'
import { useAuth } from './contexts/AuthContext'
import { useExpenses } from './hooks/useExpenses'
import { useBudget } from './hooks/useBudget'
import { useSupabaseGroups } from './hooks/useSupabaseGroups'
import { monthKey } from './lib/format'
import { setStorageUser, storage } from './lib/storage'
import { LogOut } from 'lucide-react'
import { LogoMark } from './components/shared/LogoMark'

type Tab = 'personal' | 'charts' | 'group'

function AppShell() {
  const { user, signOut } = useAuth()

  // Derive a friendly first name: Google full name → first word, else email prefix
  const userName = (() => {
    const full = user?.user_metadata?.full_name || user?.user_metadata?.name
    if (full) return (full as string).split(' ')[0]
    const email = user?.email ?? ''
    return email.split('@')[0]
  })()
  const [currentMonth, setCurrentMonth] = useState(monthKey())
  const [defaultTab, setDefaultTab] = useState<'personal' | 'group'>('personal')
  const [tab, setTab] = useState<Tab>('personal')

  // Detect ?join=TOKEN in URL
  const [joinToken, setJoinToken] = useState<string | null>(() => {
    const p = new URLSearchParams(window.location.search)
    return p.get('join')
  })
  const [joinedGroupId, setJoinedGroupId] = useState<string | null>(null)

  // Point storage at this user's namespace, then read their default tab
  useEffect(() => {
    if (user) {
      setStorageUser(user.id)
      const saved = storage.getDefaultTab()
      setDefaultTab(saved)
      setTab(saved)
    }
  }, [user?.id])

  const { expenses, addExpense, deleteExpense } = useExpenses()
  const { getBudget, setBudget } = useBudget()
  const {
    groups, loading: groupsLoading,
    createGroup, getInviteToken, joinGroup,
    deleteGroup, addExpense: addGroupExpense,
    deleteExpense: deleteGroupExpense,
  } = useSupabaseGroups(user?.id)

  const monthExpenses = expenses.filter(e => {
    const [y, m] = e.date.split('-')
    return `${y}-${parseInt(m)}` === currentMonth
  })

  function handleJoined(groupId: string) {
    setJoinToken(null)
    setJoinedGroupId(groupId)
    setTab('group')
    // Clean URL
    window.history.replaceState({}, '', window.location.pathname)
  }

  return (
    <div className="min-h-svh bg-gray-50">
      <Sidebar
        active={tab}
        onChange={setTab}
        defaultTab={defaultTab}
        onChangeDefaultTab={(t) => { setDefaultTab(t); setTab(t) }}
      />

      {/* Sign-out button */}
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
              userName={userName}
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
              loading={groupsLoading}
              currentUserId={user!.id}
              onCreateGroup={createGroup}
              onDeleteGroup={deleteGroup}
              onAddExpense={addGroupExpense}
              onDeleteExpense={deleteGroupExpense}
              onGetInviteToken={getInviteToken}
              initialGroupId={joinedGroupId}
            />
          )}
        </div>
      </main>

      <BottomNav active={tab} onChange={setTab} />

      {/* Join group modal — shown when ?join=TOKEN is in URL */}
      {joinToken && user && (
        <JoinGroupModal
          token={joinToken}
          userId={user.id}
          onJoin={joinGroup}
          onJoined={handleJoined}
          onClose={() => {
            setJoinToken(null)
            window.history.replaceState({}, '', window.location.pathname)
          }}
        />
      )}
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
