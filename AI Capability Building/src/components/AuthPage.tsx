import { useState } from 'react'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import { login, register, type User } from '@/lib/auth'

const NAVY = '#1A2B4A'
const GREEN = '#8CC63F'

interface Props {
  onAuth: (user: User) => void
  onBack?: () => void
}

type Mode = 'login' | 'register'

export function AuthPage({ onAuth, onBack }: Props) {
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return }
    if (mode === 'register' && !name.trim()) { setError('Please enter your name.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 400)) // small delay for feel

    const result = mode === 'login'
      ? login(email, password)
      : register(name, email, password)

    setLoading(false)

    if ('error' in result) {
      setError(result.error)
    } else {
      onAuth(result.user)
    }
  }

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f4f8' }}>
      {/* Header */}
      <header className="px-6 py-3 shadow-md flex items-center justify-between" style={{ background: NAVY }}>
        <div className="flex items-center gap-3">
          <img src="/dxd-logo.png" alt="DXD Logo" className="h-9 w-auto rounded-md" />
          <div className="border-l border-white/20 pl-3">
            <h1 className="font-bold text-white text-base leading-none tracking-wide">PitchPerfect</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>MOE Slide Compliance Assistant</p>
          </div>
        </div>
        {onBack && (
          <button onClick={onBack} className="text-sm text-white/60 hover:text-white transition-colors">
            ← Back to home
          </button>
        )}
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Top accent */}
            <div className="h-1.5" style={{ background: `linear-gradient(to right, ${NAVY}, ${GREEN})` }} />

            <div className="px-8 pt-8 pb-6">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 shadow-inner"
                style={{ background: NAVY }}>
                <Sparkles className="w-6 h-6" style={{ color: GREEN }} />
              </div>

              <h2 className="text-xl font-bold mb-1" style={{ color: NAVY }}>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
              <p className="text-sm text-slate-400 mb-6">
                {mode === 'login'
                  ? 'Sign in to access your templates and slides.'
                  : 'Sign up to save your own templates privately.'}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahmuna Bte Ahmad"
                      className="w-full text-sm border rounded-xl px-4 py-2.5 focus:outline-none transition-colors"
                      style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
                      onFocus={(e) => (e.target.style.borderColor = GREEN)}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@moe.gov.sg"
                    className="w-full text-sm border rounded-xl px-4 py-2.5 focus:outline-none transition-colors"
                    style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
                    onFocus={(e) => (e.target.style.borderColor = GREEN)}
                    onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full text-sm border rounded-xl px-4 py-2.5 pr-10 focus:outline-none transition-colors"
                      style={{ borderColor: '#e2e8f0', color: '#1e293b' }}
                      onFocus={(e) => (e.target.style.borderColor = GREEN)}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-60 mt-1"
                  style={{ background: NAVY }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#243659')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = NAVY)}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                    </span>
                  ) : (
                    mode === 'login' ? 'Sign In' : 'Create Account'
                  )}
                </button>
              </form>
            </div>

            {/* Footer toggle */}
            <div className="px-8 py-4 text-center" style={{ background: '#f8fafc', borderTop: '1px solid #f1f5f9' }}>
              <p className="text-xs text-slate-500">
                {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
                <button onClick={switchMode} className="font-semibold hover:underline" style={{ color: NAVY }}>
                  {mode === 'login' ? 'Register here' : 'Sign in'}
                </button>
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-4">
            Your templates are private and only accessible to you.
          </p>
        </div>
      </div>
    </div>
  )
}
