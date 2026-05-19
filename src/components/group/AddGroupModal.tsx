import { useState } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import type { Group } from '../../types'

interface Props {
  onAdd: (group: Group) => void
  onClose: () => void
}

export function AddGroupModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [members, setMembers] = useState(['', ''])

  function addMember() {
    if (members.length < 10) setMembers(m => [...m, ''])
  }

  function removeMember(i: number) {
    if (members.length <= 2) return
    setMembers(m => m.filter((_, idx) => idx !== i))
  }

  function updateMember(i: number, val: string) {
    setMembers(m => m.map((v, idx) => (idx === i ? val : v)))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validMembers = members.map(m => m.trim()).filter(Boolean)
    if (!name.trim() || validMembers.length < 2) return

    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      members: validMembers,
      expenses: [],
      createdAt: new Date().toISOString(),
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[420px] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">New Group</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Japan Trip 2026"
              required
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Members (min 2)</label>
            <div className="space-y-2">
              {members.map((m, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="text"
                    value={m}
                    onChange={e => updateMember(i, e.target.value)}
                    placeholder={`Member ${i + 1}`}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#185FA5]"
                  />
                  <button
                    type="button"
                    onClick={() => removeMember(i)}
                    disabled={members.length <= 2}
                    className="p-2 text-gray-400 hover:text-red-400 disabled:opacity-30"
                  >
                    <Minus size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addMember}
              className="mt-2 flex items-center gap-1 text-sm text-[#185FA5] hover:text-[#185FA5]/80"
            >
              <Plus size={14} /> Add member
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#185FA5] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#185FA5]/90 transition-colors"
          >
            Create Group
          </button>
        </form>
      </div>
    </div>
  )
}
