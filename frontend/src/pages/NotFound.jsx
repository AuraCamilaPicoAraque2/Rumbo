import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="state">
      <strong>{t('notFound.title')}</strong>
      <p>{t('notFound.text')}</p>
      <Link to="/" className="btn btn--primary">{t('notFound.home')}</Link>
    </div>
  )
}
