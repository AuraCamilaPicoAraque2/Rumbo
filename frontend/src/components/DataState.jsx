import { useTranslation } from 'react-i18next'

// Muestra "cargando", "error" o "vacío"; si todo está bien, muestra el contenido
export default function DataState({ status, isEmpty = false, emptyText = '', children }) {
  const { t } = useTranslation()
  if (status === 'loading') return <p className="state">{t('common.loading')}</p>
  if (status === 'error') return <p className="state state--error" role="alert">{t('common.error')}</p>
  if (isEmpty) return <p className="state">{emptyText}</p>
  return children
}
