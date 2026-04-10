import { AppShell } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems = [
    { label: 'About the Team', href: '/about', isActive: true },
    { label: 'Projects & Initiatives', href: '/projects' },
    { label: 'Learning Resources', href: '/resources' },
    { label: 'News & Updates', href: '/updates' },
  ]

  const user = {
    name: 'Alex Morgan',
    avatarUrl: undefined,
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
          Content Area
        </p>
        <h1 className="text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Section content renders here
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mx-auto">
          Design individual sections with <code className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">/shape-section</code> and they will appear inside this shell.
        </p>
      </div>
    </AppShell>
  )
}
