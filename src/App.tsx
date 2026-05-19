import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { BottomNav } from './components/layout/BottomNav'
import { PersonalTab } from './pages/PersonalTab'
import { ChartsTab } from './pages/ChartsTab'
import { GroupTab } from './pages/GroupTab'
import { useExpenses } from './hooks/useExpenses'
import { useBudget } from './hooks/useBudget'
import { useGroups } from './hooks/useGroups'
import { monthKey } from './lib/format'

type Tab = 'personal' | 'charts' | 'group'

export default function App() {
  const [tab, setTab] = useState<Tab>('personal')
  const [currentMonth, setCurrentMonth] = useState(monthKey())

  const { expenses, addExpense, deleteExpense } = useExpenses()
  const { getBudget, setBudget } = useBudget()
  const { groups, addGroup, deleteGroup, addGroupExpense, deleteGroupExpense } = useGroups()

  const monthExpenses = expenses.filter(e => {
    const [y, m] = e.date.split('-')
    return `${y}-${parseInt(m)}` === currentMonth
  })

  return (
    <div className="min-h-svh bg-gray-50">
      <Sidebar active={tab} onChange={setTab} />

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
