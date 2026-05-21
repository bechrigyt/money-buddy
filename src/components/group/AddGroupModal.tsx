import { useState } from 'react'
import { X, Copy, Check, Smartphone, Users, Plus, Trash2 } from 'lucide-react'

interface Props {
  /** Create a Supabase-backed shared group */
  onAddShared: (name: string, displayName: string) => Promise<{ groupId: string; token: string | null } | null>
  /** Create a local (device-only) group — returns the new group's id */
  onAddLocal: (name: string, members: string[]) => string
  onClose: () => void
}

type Step = 'pick' | 'local' | 'shared' | 'invite'

export function AddGroupModal({ onAddShared, onAddLocal, onClose }: Props) {
  const [step, setStep] = useState<Step>('pick')

  // Shared flow state
  const [sharedName, setSharedName] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [inviteLink, setInviteLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [sharedLoading, setSharedLoading] = useState(false)

  // Local flow state
  const [localName, setLocalName] = useState('')
  const [members, setMembers] = useState<string[]>([''])
  const [localLoading, setLocalLoading] = useState(false)

  /* ── Shared handlers ── */
  async function handleSharedSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sharedName.trim() || !displayName.trim()) return
    setSharedLoading(true)
    const result = await onAddShared(sharedName.trim(), displayName.trim())
    if (result) {
      const link = result.token
        ? `${window.location.origin}?join=${result.token}`
        : `${window.location.origin}?join=unavailable`
      setInviteLink(link)
      setStep('invite')
    }
    setSharedLoading(false)
  }

  function copy() {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── Local handlers ── */
  function setMember(i: number, val: string) {
    setMembers(prev => prev.map((m, idx) => idx === i ? val : m))
  }
  function addMemberField() { setMembers(prev => [...prev, '']) }
  function removeMember(i: number) {
    setMembers(prev => prev.filter((_, idx) => idx !== i))
  }

  function handleLocalSubmit(e: React.FormEvent) {
    e.preventDefault()
    const filled = members.map(m => m.trim()).filter(Boolean)
    if (!localName.trim() || filled.length === 0) return
    setLocalLoading(true)
    onAddLocal(localName.trim(), filled)
    // parent closes modal and navigates — just close here
    onClose()
  }

  /* ── Render ── */
  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-[420px]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {step === 'pick' && 'New Group'}
            {step === 'local' && 'Local Group'}
            {step === 'shared' && 'Shared Group'}
            {step === 'invite' && 'Group Created! 🎉'}
          </h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* ── Step: pick type ── */}
        {step === 'pick' && (
          <div className="p-5 space-y-3">
            <p className="text-sm text-gray-500 mb-1">How do you want to use this group?</p>

            <button
              onClick={() => setStep('local')}
              className="w-full flex items-start gap-4 p-4 border border-gray-200 rounded-2xl hover:border-gray-300 hover:bg-gray-50 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Smartphone size={20} className="text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Local group</p>
                <p className="text-xs text-gray-400 mt-0.5">Add members by name, track expenses on this device only. No sign-in needed for others.</p>
              </div>
            </button>

            <button
              onClick={() => setStep('shared')}
              className="w-full flex items-start gap-4 p-4 border border-[#2B8EEE]/40 rounded-2xl hover:border-[#2B8EEE] hover:bg-blue-50/40 transition-all text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-[#2B8EEE]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users size={20} className="text-[#2B8EEE]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Shared group</p>
                <p className="text-xs text-gray-400 mt-0.5">Invite friends via a link. Everyone logs in and adds expenses from their own device in real time.</p>
              </div>
            </button>
          </div>
        )}

        {/* ── Step: local form ── */}
        {step === 'local' && (
          <form onSubmit={handleLocalSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group name</label>
              <input
                type="text"
                value={localName}
                onChange={e => setLocalName(e.target.value)}
                placeholder="e.g. Japan Trip 2026"
                required
                autoFocus
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Members</label>
              <div className="space-y-2">
                {members.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={m}
                      onChange={e => setMember(i, e.target.value)}
                      placeholder={`Member ${i + 1} name`}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#2B8EEE]"
                    />
                    {members.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMember(i)}
                        className="p-2.5 text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMemberField}
                className="mt-2 flex items-center gap-1.5 text-xs text-[#2B8EEE] hover:text-[#1d7fd8] font-medium"
              >
                <Plus size={13} /> Add member
              </button>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('pick')}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={localLoading}
                className="flex-1 bg-[#2B8EEE] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#1d7fd8] transition-colors disabled:opacity-50"
              >
                {localLoading ? 'Creating…' : 'Create Group'}
              </button>
            </div>
          </form>
        )}

        {/* ── Step: shared form ── */}
        {step === 'shared' && (
          <form onSubmit={handleSharedSubmit} className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group name</label>
              <input
                type="text"
                value={sharedName}
                onChange={e => setSharedName(e.target.value)}
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
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('pick')}
                className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-3 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={sharedLoading}
                className="flex-1 bg-[#2B8EEE] text-white rounded-xl py-3 font-semibold text-sm hover:bg-[#1d7fd8] transition-colors disabled:opacity-50"
              >
                {sharedLoading ? 'Creating…' : 'Create Group'}
              </button>
            </div>
          </form>
        )}

        {/* ── Step: invite link (shared only) ── */}
        {step === 'invite' && (
          <div className="p-5 space-y-4">
            <p className="text-sm text-gray-600">
              Share this link with friends so they can join <strong>{sharedName}</strong>:
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
            <p className="text-xs text-gray-400">You can always get this link again from inside the group.</p>
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
