import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Sun, Moon, User, LogOut, ChevronDown } from 'lucide-react'
import useThemeStore from '../store/themeStore'
import useAuthStore from '../store/authStore'
import { cn, getUserInitials } from '../lib/utils'

export default function Header() {
  const { t } = useTranslation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  
  const { theme, toggleTheme, currency, setCurrency, language, setLanguage } = useThemeStore()
  const { user, isAuthenticated, logout } = useAuthStore()

  const publicLinks = [
    { to: '/', label: t('nav_home') },
    { to: '/courses', label: t('nav_courses') },
    { to: '/pricing', label: t('nav_pricing') },
    { to: '/blog', label: t('nav_blog') },
  ]

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/courses', label: t('nav_courses') },
    { to: '/ai-tutor', label: 'AI Tutor' },
    { to: '/community', label: t('nav_community') },
    { to: '/projects', label: t('nav_projects') },
  ]

  const navLinks = isAuthenticated ? authLinks : publicLinks

  const currencies = ['USD', 'EUR', 'KES', 'GBP', 'NGN', 'GHS']
  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
    { code: 'fr', label: 'FR' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-dark-panel border-b border-light-border dark:border-dark-border">
      <div className="container">
        <div className="flex items-center justify-between h-header">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient">Uplas</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:text-secondary'
                      : 'text-light-text-secondary dark:text-dark-text-secondary hover:text-primary dark:hover:text-secondary'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="hidden md:block text-xs px-2 py-1 rounded border border-light-border dark:border-dark-border bg-transparent"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>{lang.label}</option>
              ))}
            </select>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="hidden md:block text-xs px-2 py-1 rounded border border-light-border dark:border-dark-border bg-transparent"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-light-border dark:hover:bg-dark-border transition-colors"
              aria-label={theme === 'dark' ? t('toggle_theme_light') : t('toggle_theme_dark')}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-light-border dark:hover:bg-dark-border transition-colors"
                >
                  <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {getUserInitials(user?.full_name)}
                  </span>
                  <ChevronDown size={16} className={cn('transition-transform', userMenuOpen && 'rotate-180')} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-panel rounded-lg shadow-lg border border-light-border dark:border-dark-border py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-light-border dark:border-dark-border">
                      <p className="font-medium">{user?.full_name}</p>
                      <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-light-border dark:hover:bg-dark-border"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User size={16} />
                      <span>{t('nav_profile')}</span>
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false) }}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-light-border dark:hover:bg-dark-border text-error"
                    >
                      <LogOut size={16} />
                      <span>{t('nav_logout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <a href="#auth-section" className="btn btn-secondary text-sm px-4 py-2">
                  {t('nav_login')}
                </a>
                <a href="#auth-section" className="btn btn-primary text-sm px-4 py-2">
                  {t('nav_signup')}
                </a>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-light-border dark:hover:bg-dark-border"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-light-border dark:border-dark-border animate-slide-up">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block px-4 py-3 rounded-lg font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary dark:text-secondary'
                      : 'hover:bg-light-border dark:hover:bg-dark-border'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 mt-4 px-4">
                <a href="#auth-section" className="btn btn-secondary flex-1" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav_login')}
                </a>
                <a href="#auth-section" className="btn btn-primary flex-1" onClick={() => setMobileMenuOpen(false)}>
                  {t('nav_signup')}
                </a>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
