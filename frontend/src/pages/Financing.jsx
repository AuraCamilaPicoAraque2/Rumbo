import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getFinancing } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import DataState from '../components/DataState.jsx'

const TYPES = ['GRATUIDAD', 'CREDITO', 'BECA', 'SUBSIDIO']
const TYPE_COLOR = { GRATUIDAD: 'var(--p2)', CREDITO: 'var(--p1)', BECA: 'var(--p3)', SUBSIDIO: 'var(--p6)' }

export default function Financing() {
  const { t } = useTranslation()
  const [type, setType] = useState('')
  const list = useFetch(() => getFinancing(type ? { type } : undefined), [type])
  const items = list.data || []

  return (
    <>
      <h1 className="page-title">{t('financingPage.title')}</h1>
      <p className="lead">{t('financingPage.subtitle')}</p>

      <div className="chips">
        <button type="button" className={type === '' ? 'chip chip--on' : 'chip'} style={{ '--cat': 'var(--p4)' }} onClick={() => setType('')}>
          {t('common.allM')}
        </button>
        {TYPES.map((tp) => (
          <button key={tp} type="button" className={type === tp ? 'chip chip--on' : 'chip'} style={{ '--cat': TYPE_COLOR[tp] }} onClick={() => setType(tp)}>
            {t(`finType.${tp}`)}
          </button>
        ))}
      </div>

      <DataState status={list.status} isEmpty={items.length === 0} emptyText={t('financingPage.empty')}>
        <div className="stack">
          {items.map((f) => (
            <article key={f.id} className="row" style={{ '--cat': TYPE_COLOR[f.type] }}>
              <div className="tags">
                <span className="tag">{t(`finType.${f.type}`)}</span>
                <span className="tag tag--plain">{t(`finScope.${f.scope}`)}</span>
              </div>
              <h3 className="row__title">{f.name}</h3>
              <p className="muted">{f.entity}</p>
              <p className="row__excerpt">{f.description}</p>
              {f.requirements && (
                <p className="row__excerpt">
                  <strong>{t('financingPage.requirements')}:</strong> {f.requirements}
                </p>
              )}
              {f.url && (
                <a className="link" href={f.url} target="_blank" rel="noreferrer">{t('common.officialSite')}</a>
              )}
            </article>
          ))}
        </div>
      </DataState>

      <p className="disclaimer muted">{t('common.disclaimer')}</p>
    </>
  )
}
