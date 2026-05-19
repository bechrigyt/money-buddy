import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage({ type: 'error', text: error.message })
      else setMessage({ type: 'success', text: 'Check your email to confirm your account!' })
    }

    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <div className="min-h-svh bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo / title */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">💰</div>
          <h1 className="text-2xl font-bold text-gray-900">Money Buddy</h1>
          <p className="text-sm text-gray-500 mt-1">Track expenses together</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Google */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmail} className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />

            {message && (
              <p className={`text-xs px-1 ${message.type === 'error' ? 'text-red-500' : 'text-emerald-600'}`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading…' : mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-4">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(null) }}
              className="text-emerald-600 font-medium hover:underline"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
