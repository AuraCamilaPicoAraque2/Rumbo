import { useTranslation } from 'react-i18next'
import { getFaqs } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import DataState from '../components/DataState.jsx'

export default function Faq() {
  const { t } = useTranslation()
  const list = useFetch(getFaqs, [])
  const items = list.data || []

  return (
    <>
      <h1 className="page-title">{t('faqPage.title')}</h1>
      <p className="lead">{t('faqPage.subtitle')}</p>

      <DataState status={list.status} isEmpty={items.length === 0} emptyText={t('common.error')}>
        <div className="faq-list">
          {items.map((f) => (
            <details key={f.id} className="faq">
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </DataState>
    </>
  )
}
