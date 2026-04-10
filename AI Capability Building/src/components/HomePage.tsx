import { ArrowRight, Sparkles, FileDown, LayoutTemplate, Upload, CheckCircle, Clock, Users, TrendingUp, ChevronRight } from 'lucide-react'

const NAVY = '#1A2B4A'
const GREEN = '#8CC63F'
const TEAL = '#5ACBF0'

interface Props {
  onLogin: () => void
  onRegister: () => void
}

function Navbar({ onLogin, onRegister }: Props) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{ background: 'rgba(26,43,74,0.97)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-3">
        <img src="/dxd-logo.png" alt="DXD" className="h-8 w-auto rounded-md" />
        <div className="border-l border-white/20 pl-3">
          <span className="font-bold text-white text-base tracking-wide">PitchPerfect</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button onClick={onLogin}
          className="text-sm font-semibold text-white/80 hover:text-white px-4 py-2 rounded-lg transition-colors">
          Log In
        </button>
        <button onClick={onRegister}
          className="text-sm font-bold text-white px-5 py-2 rounded-lg transition-all"
          style={{ background: GREEN }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#7ab534')}
          onMouseLeave={(e) => (e.currentTarget.style.background = GREEN)}>
          Get Started
        </button>
      </div>
    </nav>
  )
}

function HeroSection({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #0f1e3a 60%, #162844 100%)` }}>

      {/* Background glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: GREEN }} />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: TEAL }} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8"
          style={{ background: 'rgba(140,198,63,0.12)', border: '1px solid rgba(140,198,63,0.3)', color: GREEN }}>
          <Sparkles className="w-3.5 h-3.5" />
          AI-Powered for MOE Officers
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
          PitchPerfect turns raw notes to{' '}
          <span style={{ color: GREEN }}>perfect slides</span>
          {' '}in seconds.
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
          PitchPerfect turns your draft content into polished, MOE-compliant PowerPoint slides automatically.
          No more manual formatting. No more template hunting. Just results.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={onRegister}
            className="flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-lg transition-all"
            style={{ background: GREEN }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#7ab534')}
            onMouseLeave={(e) => (e.currentTarget.style.background = GREEN)}>
            Start for free
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mock slide preview */}
        <div className="mt-16 relative mx-auto max-w-3xl">
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            {/* Mock slide */}
            <div className="relative" style={{ background: NAVY, paddingTop: '56.25%' }}>
              <div className="absolute inset-0 flex flex-col">
                {/* Header bar */}
                <div className="h-12 flex items-center px-6" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="w-2 h-full mr-3" style={{ background: GREEN }} />
                  <div className="h-2.5 rounded w-64 opacity-60" style={{ background: 'rgba(255,255,255,0.4)' }} />
                </div>
                {/* Content area */}
                <div className="flex-1 p-6 flex flex-col gap-3 justify-center">
                  <div className="h-4 rounded w-3/4 opacity-40" style={{ background: 'rgba(255,255,255,0.5)' }} />
                  <div className="h-3 rounded w-2/3 opacity-25" style={{ background: 'rgba(255,255,255,0.4)' }} />
                  <div className="h-3 rounded w-4/5 opacity-25" style={{ background: 'rgba(255,255,255,0.4)' }} />
                  <div className="h-3 rounded w-1/2 opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
                </div>
                {/* Footer */}
                <div className="h-8 flex items-center justify-between px-6 text-[10px] opacity-30 text-white"
                  style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <span>RESTRICTED \ NON-SENSITIVE</span>
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl px-4 py-2.5 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${GREEN}22` }}>
              <CheckCircle className="w-4 h-4" style={{ color: GREEN }} />
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: NAVY }}>MOE Template Applied</p>
              <p className="text-[10px] text-slate-400">Formatting compliant</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const stats = [
    { value: '40–60%', label: 'Less time on formatting', icon: <Clock className="w-5 h-5" /> },
    { value: '3×', label: 'Fewer revision cycles', icon: <TrendingUp className="w-5 h-5" /> },
    { value: '1,000+', label: 'Decks created monthly', icon: <Users className="w-5 h-5" /> },
    { value: '100%', label: 'MOE template compliant', icon: <CheckCircle className="w-5 h-5" /> },
  ]

  return (
    <section className="py-16 px-6" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="flex justify-center mb-2" style={{ color: GREEN }}>{s.icon}</div>
            <p className="text-3xl font-extrabold mb-1" style={{ color: NAVY }}>{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: <Upload className="w-6 h-6" />,
      title: 'Upload Any Format',
      desc: 'Drop in a .docx, .pdf, or .txt file — or just paste your notes directly. PitchPerfect reads it all.',
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Structures Your Content',
      desc: 'Our AI parses your raw content and organises it into a logical slide-by-slide structure automatically.',
    },
    {
      icon: <LayoutTemplate className="w-6 h-6" />,
      title: 'Your Template, Your Brand',
      desc: 'Choose from built-in MOE templates or add your own team template. Every slide matches your organisation\'s standards.',
    },
    {
      icon: <FileDown className="w-6 h-6" />,
      title: 'Download-Ready PPTX',
      desc: 'Get a fully editable PowerPoint file — formatted, compliant, and ready to present or refine further.',
    },
  ]

  return (
    <section className="py-24 px-6" style={{ background: '#fff' }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Features</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: NAVY }}>
            Everything you need to present with confidence
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Built specifically for MOE officers who want to spend less time on formatting and more time on the work that matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl p-6 border border-slate-100 hover:border-transparent hover:shadow-lg transition-all group"
              style={{ background: '#f8fafc' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                style={{ background: `${GREEN}18`, color: GREEN }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: NAVY }}>{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'Paste or Upload', desc: 'Add your raw notes, paste from Word, or upload a .docx / .pdf / .txt file.' },
    { num: '02', title: 'AI Structures It', desc: 'PitchPerfect\'s AI organises your content into a clear slide outline with titles and bullets.' },
    { num: '03', title: 'Download Your Deck', desc: 'Instantly download a fully formatted, MOE-compliant PowerPoint file ready to present.' },
  ]

  return (
    <section className="py-24 px-6" style={{ background: NAVY }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Three steps to a polished deck
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            No design skills needed. No PowerPoint expertise required. Just your content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.num} className="relative rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-5xl font-extrabold mb-4 leading-none" style={{ color: `${GREEN}40` }}>{s.num}</div>
              <h3 className="font-bold text-white text-base mb-2">{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.desc}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ChevronRight className="w-5 h-5" style={{ color: `${GREEN}60` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function PrivacySection() {
  return (
    <section className="py-24 px-6" style={{ background: '#f8fafc' }}>
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: GREEN }}>Private & Secure</p>
          <h2 className="text-3xl font-extrabold mb-4" style={{ color: NAVY }}>Your templates, your account</h2>
          <p className="text-base text-slate-500 leading-relaxed mb-6">
            Every officer gets their own private workspace. Custom templates you create are only visible to you —
            other users cannot see or access them. Built-in MOE templates are shared across all users.
          </p>
          <ul className="flex flex-col gap-3">
            {[
              'Private template storage per account',
              'Session persists securely across visits',
              'Built-in MOE templates available to all',
              'Add or remove your own templates anytime',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 shrink-0" style={{ color: GREEN }} />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="w-64 h-64 rounded-3xl flex items-center justify-center shadow-xl"
            style={{ background: `linear-gradient(135deg, ${NAVY}, #243659)` }}>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner"
                style={{ background: 'rgba(140,198,63,0.15)' }}>
                <LayoutTemplate className="w-9 h-9" style={{ color: GREEN }} />
              </div>
              <p className="text-white font-bold text-sm">Your private templates</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Visible only to you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CtaSection({ onRegister }: { onRegister: () => void }) {
  return (
    <section className="py-24 px-6" style={{ background: '#fff' }}>
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner"
          style={{ background: NAVY }}>
          <Sparkles className="w-7 h-7" style={{ color: GREEN }} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-4" style={{ color: NAVY }}>
          Ready to save hours on your next deck?
        </h2>
        <p className="text-base text-slate-500 mb-8">
          Join MOE officers who are already spending less time on formatting and more time on the work that matters.
        </p>
        <button onClick={onRegister}
          className="inline-flex items-center gap-2 text-white font-bold px-8 py-3.5 rounded-xl text-base shadow-lg transition-all"
          style={{ background: GREEN }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#7ab534')}
          onMouseLeave={(e) => (e.currentTarget.style.background = GREEN)}>
          Create your free account
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  )
}

function Footer({ onLogin }: { onLogin: () => void }) {
  return (
    <footer className="px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
      style={{ background: NAVY, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-center gap-3">
        <img src="/dxd-logo.png" alt="DXD" className="h-7 w-auto rounded-md opacity-80" />
        <span className="text-sm font-bold text-white/60">PitchPerfect</span>
      </div>
      <p className="text-xs text-white/30">© 2025 DXD · Ministry of Education · Internal Tool</p>
      <button onClick={onLogin} className="text-xs font-semibold hover:underline" style={{ color: GREEN }}>
        Sign in →
      </button>
    </footer>
  )
}

export function HomePage({ onLogin, onRegister }: Props) {
  return (
    <div className="font-sans">
      <Navbar onLogin={onLogin} onRegister={onRegister} />
      <HeroSection onRegister={onRegister} />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <PrivacySection />
      <CtaSection onRegister={onRegister} />
      <Footer onLogin={onLogin} />
    </div>
  )
}
