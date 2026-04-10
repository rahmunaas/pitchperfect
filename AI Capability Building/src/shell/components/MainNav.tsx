import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { UserMenu } from './UserMenu'

interface NavItem {
  label: string
  href: string
  isActive?: boolean
}

interface MainNavProps {
  navigationItems: NavItem[]
  user?: { name: string; avatarUrl?: string }
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function MainNav({ navigationItems, user, onNavigate, onLogout }: MainNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 rounded-md bg-blue-800 flex items-center justify-center">
              <span className="text-white text-xs font-bold tracking-tight">DXD</span>
            </div>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 hidden sm:block leading-tight">
              AI Capability Centre
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <button
                key={item.href}
                onClick={() => onNavigate?.(item.href)}
                className={`
                  relative px-4 py-2 text-sm font-medium rounded-md transition-colors
                  ${item.isActive
                    ? 'text-blue-800 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-sky-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }
                `}
              >
                {item.label}
                {item.isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-blue-800 dark:bg-sky-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:block">
                <UserMenu user={user} onLogout={onLogout} />
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3 space-y-1">
          {navigationItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                onNavigate?.(item.href)
                setMobileOpen(false)
              }}
              className={`
                w-full text-left px-4 py-2.5 text-sm font-medium rounded-md transition-colors
                ${item.isActive
                  ? 'bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-sky-400'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }
              `}
            >
              {item.label}
            </button>
          ))}
          {user && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <UserMenu user={user} onLogout={onLogout} />
            </div>
          )}
        </div>
      )}
    </header>
  )
}
