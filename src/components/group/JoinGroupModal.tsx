import { useState } from 'react'
import { Users } from 'lucide-react'

interface Props {
  token: string
  userId: string
  onJoin: (token: string, displayName: string) => Promise<{ groupId: string; groupName: string } | null>
  onJoined: (groupId: string) => void
  onClose: () => void
}

export function JoinGroupModal({ token, onJoin, onJoined, onClose }: Props) {
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!displayName.trim()) return
    setLoading(true)
    setError('')
    const result = await onJoin(token, displayName.trim())
    if (result) {
      onJoined(result.groupId)
    } else {
      setError('Invalid or expired invite link. Please ask for a new one.')
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#2B8EEE]/10 flex items-center justify-center mx-auto mb-4">
            <Users size={26} className="text-[#2B8EEE]" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">You've been invited!</h2>
          <p className="text-sm text-gray-500 mb-5">Enter your name as it will appear to others in the group.</p>

          <form onSubmit={handleJoin} className="space-y-3">
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name e.g. Ben"
              autoFocus
              required
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B8EEE] focus:border-transparent"
            />
            {error && <p className="text-xs text-red-500 text-left">{error}</p>}
            <button
              type="submit"
              disabled={loading || !displayName.trim()}
              className="w-full bg-[#2B8EEE] text-white rounded-xl py-2.5 font-semibold text-sm hover:bg-[#1d7fd8] transition-colors disabled:opacity-50"
            >
              {loading ? 'Joining…' : 'Join Group'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-sm text-gray-400 hover:text-gray-600 py-1"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
