import { Navigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'

// Protege una ruta: exige sesión y, si se indica, un rol (ej. role="ADMIN")
export default function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  const { t } = useTranslation()

  if (loading) return <p className="state">{t('common.loading')}</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (role && user.role !== role) {
    return <div className="state"><strong>{t('admin.forbidden')}</strong></div>
  }
  return children
}
