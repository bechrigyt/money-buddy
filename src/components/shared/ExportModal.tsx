import { X, FileSpreadsheet, FileText, Sheet } from 'lucide-react'
import type { Expense, Group } from '../../types'
import {
  exportPersonalXLSX,
  exportPersonalCSV,
  exportGroupXLSX,
  exportGroupCSV,
} from '../../lib/export'

interface PersonalProps {
  mode: 'personal'
  expenses: Expense[]
  onClose: () => void
}
interface GroupProps {
  mode: 'group'
  group: Group
  onClose: () => void
}
type Props = PersonalProps | GroupProps

export function ExportModal(props: Props) {
  const { onClose } = props

  function handleXLSX() {
    if (props.mode === 'personal') exportPersonalXLSX(props.expenses)
    else exportGroupXLSX(props.group)
    onClose()
  }

  function handleCSV() {
    if (props.mode === 'personal') exportPersonalCSV(props.expenses)
    else exportGroupCSV(props.group)
    onClose()
  }

  function handleGSheets() {
    if (props.mode === 'personal') exportPersonalCSV(props.expenses, 'money-buddy-gsheets')
    else exportGroupCSV(props.group, `${(props as GroupProps).group.name}-gsheets`)
    alert('CSV downloaded. In Google Sheets, go to File → Import → Upload to import.')
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Export</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={handleXLSX}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-left"
          >
            <FileSpreadsheet size={20} className="text-green-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">Excel (.xlsx)</div>
              <div className="text-xs text-gray-500">Open in Microsoft Excel or Numbers</div>
            </div>
          </button>

          <button
            onClick={handleCSV}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-left"
          >
            <FileText size={20} className="text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">CSV</div>
              <div className="text-xs text-gray-500">Universal spreadsheet format</div>
            </div>
          </button>

          <button
            onClick={handleGSheets}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-left"
          >
            <Sheet size={20} className="text-[#185FA5]" />
            <div>
              <div className="text-sm font-medium text-gray-900">Google Sheets</div>
              <div className="text-xs text-gray-500">Download CSV + import instructions</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
