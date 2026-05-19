import * as XLSX from 'xlsx'
import type { Expense, Group } from '../types'
import { getCategoryMeta } from '../types'
import { computeSettlement } from './settlement'
import { fmt } from './format'

function expenseRows(expenses: Expense[]) {
  return expenses.map(e => ({
    Date: e.date,
    Category: `${getCategoryMeta(e.category).emoji} ${e.category}`,
    Description: e.description,
    'Amount (SGD)': e.sgdAmount.toFixed(4),
    'FCY Amount': e.fcyAmt ?? '',
    Currency: e.fcyCur ?? '',
    'Exchange Rate': e.fcyRate ?? '',
    Notes: e.notes ?? '',
  }))
}

function groupExpenseRows(group: Group) {
  return group.expenses.map(e => ({
    Date: e.date,
    Category: `${getCategoryMeta(e.category).emoji} ${e.category}`,
    Description: e.description,
    'Amount (SGD)': e.sgdAmount.toFixed(4),
    'Paid By': e.paidBy,
    'Split With': e.splitWith.join(', '),
    'FCY Amount': e.fcyAmt ?? '',
    Currency: e.fcyCur ?? '',
    Notes: e.notes ?? '',
  }))
}

export function exportPersonalXLSX(expenses: Expense[], filename = 'money-buddy-personal') {
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(expenseRows(expenses))
  XLSX.utils.book_append_sheet(wb, ws, 'Expenses')
  XLSX.writeFile(wb, `${filename}.xlsx`)
}

export function exportPersonalCSV(expenses: Expense[], filename = 'money-buddy-personal') {
  const ws = XLSX.utils.json_to_sheet(expenseRows(expenses))
  const csv = XLSX.utils.sheet_to_csv(ws)
  downloadText(csv, `${filename}.csv`, 'text/csv')
}

export function exportGroupXLSX(group: Group, filename?: string) {
  const name = filename ?? `money-buddy-${group.name.toLowerCase().replace(/\s+/g, '-')}`
  const { balances, transactions } = computeSettlement(group)

  const wb = XLSX.utils.book_new()
  const expWs = XLSX.utils.json_to_sheet(groupExpenseRows(group))
  XLSX.utils.book_append_sheet(wb, expWs, 'Expenses')

  const balanceRows = Object.entries(balances).map(([member, bal]) => ({
    Member: member,
    'Net Balance (SGD)': bal.toFixed(2),
    Status: bal > 0.005 ? 'Gets back' : bal < -0.005 ? 'Owes' : 'Settled',
  }))
  const settlRows = transactions.map(t => ({
    From: t.from,
    To: t.to,
    'Amount (SGD)': t.amount.toFixed(2),
  }))

  const settleWs = XLSX.utils.json_to_sheet([
    ...balanceRows,
    {},
    { Member: 'TRANSACTIONS' },
    ...settlRows,
  ])
  XLSX.utils.book_append_sheet(wb, settleWs, 'Settlement')
  XLSX.writeFile(wb, `${name}.xlsx`)
}

export function exportGroupCSV(group: Group, filename?: string) {
  const name = filename ?? `money-buddy-${group.name.toLowerCase().replace(/\s+/g, '-')}`
  const { transactions } = computeSettlement(group)

  const expWs = XLSX.utils.json_to_sheet(groupExpenseRows(group))
  let csv = XLSX.utils.sheet_to_csv(expWs)
  csv += '\n\nSETTLEMENT\nFrom,To,Amount (SGD)\n'
  csv += transactions.map(t => `${t.from},${t.to},${fmt(t.amount)}`).join('\n')
  downloadText(csv, `${name}.csv`, 'text/csv')
}

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
