import { NavLink } from 'react-router-dom'
import { Home, Package, Star, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = [
  { to: '/', label: '홈', icon: Home, end: true },
  { to: '/fridge', label: '냉장고', icon: Package },
  { to: '/favorites', label: '즐겨찾기', icon: Star },
]

export default function BottomNav() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 flex border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 md:static md:h-screen md:w-56 md:flex-col md:border-r md:border-t-0 md:py-6">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 py-2 text-xs md:flex-row md:justify-start md:gap-3 md:px-6 md:py-3 md:text-sm ${
              isActive ? 'font-medium text-emerald-600 dark:text-emerald-400' : 'text-gray-500 dark:text-gray-400'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
      <button
        type="button"
        onClick={toggleTheme}
        data-testid="theme-toggle"
        aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
        className="flex flex-1 flex-col items-center gap-1 py-2 text-xs text-gray-500 dark:text-gray-400 md:flex-row md:justify-start md:gap-3 md:px-6 md:py-3 md:text-sm"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
        <span>{isDark ? '라이트 모드' : '다크 모드'}</span>
      </button>
    </nav>
  )
}
