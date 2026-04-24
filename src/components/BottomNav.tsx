import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/',         icon: '🦍', label: 'HOME' },
  { to: '/routines', icon: '📋', label: 'ROUTINE' },
  { to: '/brain',    icon: '🧠', label: 'BRAIN' },
  { to: '/museum',   icon: '📚', label: 'MUSEUM' },
  { to: '/help',     icon: '❓', label: 'HELP' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around bg-[#0d0d1a] border-t border-white/10 py-2 max-w-sm mx-auto">
      {tabs.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 text-xs ${isActive ? 'text-accent' : 'text-white/40'}`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
