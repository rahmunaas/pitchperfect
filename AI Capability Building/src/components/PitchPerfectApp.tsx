import { useState, useRef, useEffect } from 'react'
import { LayoutTemplate, Sparkles, LogOut, ChevronDown } from 'lucide-react'
import { SlideFormatterPage } from './SlideFormatterPage'
import { TemplateListPage } from './TemplateListPage'
import { AuthPage } from './AuthPage'
import { HomePage } from './HomePage'
import {
  loadTemplates,
  loadSelectedTemplateId,
  saveSelectedTemplateId,
  saveTemplates,
  type Template,
} from '@/lib/templates'
import { getSession, logout, getInitials, type User } from '@/lib/auth'

const NAVY = '#1A2B4A'
const GREEN = '#8CC63F'
type Tab = 'generate' | 'templates'
type Screen = 'home' | 'auth' | 'app'

function UserMenu({ user, onLogout }: { user: User; onLogout: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors hover:bg-white/10"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
          style={{ background: GREEN }}>
          {getInitials(user.name)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-white leading-none">{user.name}</p>
          <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{user.email}</p>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-white/50" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-xs font-semibold truncate" style={{ color: NAVY }}>{user.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
          {/* Logout */}
          <button
            onClick={() => { setOpen(false); onLogout() }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}

export function PitchPerfectApp() {
  const [user, setUser] = useState<User | null>(getSession)
  const [screen, setScreen] = useState<Screen>(() => (getSession() ? 'app' : 'home'))
  const [tab, setTab] = useState<Tab>('generate')
  const [templates, setTemplates] = useState<Template[]>(() =>
    user ? loadTemplates(user.id) : []
  )
  const [selectedId, setSelectedId] = useState<string>(() =>
    user ? loadSelectedTemplateId(user.id) : 'moe-corporate-2025'
  )

  const selectedTemplate = templates.find((t) => t.id === selectedId) ?? templates[0]

  const handleAuth = (loggedInUser: User) => {
    setUser(loggedInUser)
    setScreen('app')
    setTemplates(loadTemplates(loggedInUser.id))
    setSelectedId(loadSelectedTemplateId(loggedInUser.id))
  }

  const handleLogout = () => {
    logout()
    setUser(null)
    setTab('generate')
    setScreen('home')
  }

  const goHome = () => setScreen('home')

  const handleSelectTemplate = (id: string) => {
    setSelectedId(id)
    if (user) saveSelectedTemplateId(user.id, id)
  }

  const handleTemplatesChange = (updated: Template[]) => {
    setTemplates(updated)
    if (user) saveTemplates(user.id, updated)
  }

  // Show homepage
  if (screen === 'home') {
    return (
      <HomePage
        onLogin={() => setScreen('auth')}
        onRegister={() => setScreen('auth')}
      />
    )
  }

  // Show auth page
  if (!user && screen === 'auth') return <AuthPage onAuth={handleAuth} onBack={() => setScreen('home')} />

  // Redirect to app if already logged in and hit auth
  if (user && screen === 'auth') setScreen('app')

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'generate', label: 'Generate Slides', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'templates', label: 'Template List', icon: <LayoutTemplate className="w-4 h-4" /> },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f4f8' }}>

      {/* Header */}
      <header className="px-6 py-3 flex items-center justify-between shadow-md" style={{ background: NAVY }}>
        <button onClick={goHome} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src="/dxd-logo.png" alt="DXD Logo" className="h-9 w-auto rounded-md" />
          <div className="border-l border-white/20 pl-3 text-left">
            <h1 className="font-bold text-white text-base leading-none tracking-wide">PitchPerfect</h1>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
              MOE Slide Compliance Assistant
            </p>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {/* Active template badge */}
          <span className="text-xs px-3 py-1 rounded-full font-semibold hidden md:inline-block"
            style={{ background: 'rgba(140,198,63,0.15)', color: GREEN, border: '1px solid rgba(140,198,63,0.3)' }}>
            {selectedTemplate?.name ?? 'No template'}
          </span>
          {/* User menu */}
          {user && <UserMenu user={user} onLogout={handleLogout} />}
        </div>
      </header>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200 bg-white px-6">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors mr-2"
            style={{
              borderBottomColor: tab === id ? GREEN : 'transparent',
              color: tab === id ? NAVY : '#94a3b8',
            }}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Overview banner — only on generate tab */}
      {tab === 'generate' && (
        <div className="px-6 py-4" style={{ background: '#e8f0fe', borderBottom: '1px solid #c7d7f9' }}>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold" style={{ color: NAVY }}>What is PitchPerfect?</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#334155' }}>
              PitchPerfect helps MOE officers turn raw notes and draft content into polished,
              template-compliant PowerPoint slides — in seconds. Paste your content, let AI structure
              it, and download a ready-to-submit{' '}
              <code className="font-mono bg-white/60 px-1 rounded">.pptx</code> file.
              Spend less time on formatting, more time on the work that matters.
            </p>
          </div>
        </div>
      )}

      {/* Page content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {tab === 'generate' ? (
          <SlideFormatterPage selectedTemplate={selectedTemplate} />
        ) : (
          <TemplateListPage
            templates={templates}
            selectedId={selectedId}
            onSelect={handleSelectTemplate}
            onTemplatesChange={handleTemplatesChange}
          />
        )}
      </div>
    </div>
  )
}
