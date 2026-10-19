import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  )
}

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggle } = useTheme()
  const { user, logout } = useAuth()
  const nextLang = i18n.language === 'es' ? 'en' : 'es'

  return (
    <header className="topbar">
      <div className="utility">
        <div className="container utility__inner">
          <nav className="utility__links" aria-label={t('nav.support')}>
            <NavLink to="/admisiones">{t('nav.admissions')}</NavLink>
            <NavLink to="/biblioteca">{t('nav.library')}</NavLink>
            <NavLink to="/bienestar">{t('nav.wellbeing')}</NavLink>
            <NavLink to="/preguntas-frecuentes">{t('nav.faq')}</NavLink>
          </nav>
          <div className="utility__tools">
            <button type="button" className="icon-btn" onClick={() => i18n.changeLanguage(nextLang)} aria-label={t('nav.language')}>
              {nextLang.toUpperCase()}
            </button>
            <button type="button" className="icon-btn" onClick={toggle} aria-label={t('nav.theme')}>
              {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>

      <div className="nav">
        <div className="container nav__inner">
          <Link to="/" className="nav__brand">
            <img src="/favicon.png" alt="" aria-hidden="true" />
            <span>{t('brand')}</span>
          </Link>

          <nav className="nav__links" aria-label={t('nav.menuLabel')}>
            <NavLink to="/" end>{t('nav.home')}</NavLink>
            <NavLink to="/carreras">{t('nav.careers')}</NavLink>
            <NavLink to="/instituciones">{t('nav.institutions')}</NavLink>
            <NavLink to="/financiacion">{t('nav.financing')}</NavLink>
            <NavLink to="/test-vocacional">{t('nav.test')}</NavLink>
            <NavLink to="/blog">{t('nav.blog')}</NavLink>
          </nav>

          <div className="nav__actions">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="btn btn--ghost">{t('nav.admin')}</Link>
                )}
                <span className="nav__user">{user.name}</span>
                <button type="button" className="btn btn--ghost" onClick={logout}>{t('nav.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost">{t('nav.login')}</Link>
                <Link to="/registro" className="btn btn--primary">{t('nav.register')}</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
