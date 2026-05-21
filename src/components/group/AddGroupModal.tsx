import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'

interface Props {
  onAdd: (name: string, displayName: string) => Promise<{ groupId: string; token: string | null } | null>
  onClose: () => void
}

export function AddGroupModal({ onAdd, onClose }: Props) {
  const [step, setStep] = useState<'form' | 'invite'>('form')
  const [name, setName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !displayName.trim()) return
    setLoading(true)
    const result = await onAdd(name.trim(), displayName.trim())
    if (result) {
      const link = result.token
        ? `${window.location.origin}?join=${result.token}`
        : `${window.location.origin}?join=unavailable`
      setInviteLink(link)
      setStep('invite')
    }
    setLoading(false)
  }

  function copy() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[420px]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {step === 'form' ? 'New Group' : 'Group Created! 🎉'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Japan Trip 2026"
                required
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your name in this group</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. Ben"
                required
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
              />
              <p className="text-xs text-gray-400 mt-1">This is how you'll appear to others in the group</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B8EEE] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#1d7fd8] transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Create Group'}
            </button>
          </form>
        ) : (
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-600">
              Share this link with friends so they can join <strong>{name}</strong>:
            </p>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
              <p className="flex-1 text-xs text-gray-500 truncate">{inviteLink}</p>
              <button
                onClick={copy}
                className="flex items-center gap-1 text-xs font-medium text-[#2B8EEE] hover:text-[#1d7fd8] flex-shrink-0"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              You can always get this link again from inside the group.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-[#2B8EEE] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#1d7fd8] transition-colors"
            >
              Open Group
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
