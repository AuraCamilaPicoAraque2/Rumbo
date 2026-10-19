import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getResources } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import DataState from '../components/DataState.jsx'

const TYPES = ['GUIA', 'ENLACE', 'HERRAMIENTA', 'VIDEO']

export default function Library() {
  const { t } = useTranslation()
  const [type, setType] = useState('')
  const list = useFetch(() => getResources(type ? { type } : undefined), [type])
  const items = list.data || []

  return (
    <>
      <h1 className="page-title">{t('library.title')}</h1>
      <p className="lead">{t('library.subtitle')}</p>

      <div className="chips">
        <button type="button" className={type === '' ? 'chip chip--on' : 'chip'} style={{ '--cat': 'var(--p1)' }} onClick={() => setType('')}>
          {t('common.allM')}
        </button>
        {TYPES.map((tp, i) => (
          <button key={tp} type="button" className={type === tp ? 'chip chip--on' : 'chip'} style={{ '--cat': `var(--p${i + 2})` }} onClick={() => setType(tp)}>
            {t(`resType.${tp}`)}
          </button>
        ))}
      </div>

      <DataState status={list.status} isEmpty={items.length === 0} emptyText={t('library.empty')}>
        <div className="grid">
          {items.map((r) => (
            <article key={r.id} className="card card--static" style={{ '--cat': `var(--p${TYPES.indexOf(r.type) + 2})` }}>
              <span className="card__area">{t(`resType.${r.type}`)} · {r.category}</span>
              <h3 className="card__title">{r.title}</h3>
              <p className="card__text card__text--full pre">{r.description}</p>
              {r.url && (
                <a className="link card__foot" href={r.url} target="_blank" rel="noreferrer">{t('common.openResource')}</a>
              )}
            </article>
          ))}
        </div>
      </DataState>
    </>
  )
}
