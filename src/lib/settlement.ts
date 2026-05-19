import type { Group } from '../types'

export type Transaction = { from: string; to: string; amount: number }
export type SettlementResult = {
  balances: Record<string, number>
  transactions: Transaction[]
}

export function computeSettlement(group: Group): SettlementResult {
  const balances: Record<string, number> = {}
  group.members.forEach(m => (balances[m] = 0))

  group.expenses.forEach(expense => {
    const share = expense.sgdAmount / expense.splitWith.length
    expense.splitWith.forEach(member => {
      if (member !== expense.paidBy) {
        balances[member] -= share
        balances[expense.paidBy] += share
      }
    })
  })

  const creditors = Object.entries(balances)
    .filter(([, v]) => v > 0.005)
    .map(([k, v]) => ({ name: k, val: v }))
  const debtors = Object.entries(balances)
    .filter(([, v]) => v < -0.005)
    .map(([k, v]) => ({ name: k, val: v }))

  const transactions: Transaction[] = []
  let ci = 0,
    di = 0
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci],
      d = debtors[di]
    const amount = Math.min(c.val, -d.val)
    if (amount > 0.005) transactions.push({ from: d.name, to: c.name, amount })
    c.val -= amount
    d.val += amount
    if (Math.abs(c.val) < 0.005) ci++
    if (Math.abs(d.val) < 0.005) di++
  }

  return { balances, transactions }
}
