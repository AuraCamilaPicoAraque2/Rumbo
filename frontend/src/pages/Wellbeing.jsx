import { useTranslation } from 'react-i18next'
import { getWellbeing } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import DataState from '../components/DataState.jsx'

const CATEGORIES = ['SALUD', 'APOYO_ECONOMICO', 'ACADEMICO', 'DEPORTE_CULTURA', 'INCLUSION']

export default function Wellbeing() {
  const { t } = useTranslation()
  const list = useFetch(getWellbeing, [])
  const items = list.data || []

  const groups = CATEGORIES.map((cat, i) => ({
    cat,
    color: `var(--p${i + 1})`,
    items: items.filter((it) => it.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      <h1 className="page-title">{t('wellbeingPage.title')}</h1>
      <p className="lead">{t('wellbeingPage.subtitle')}</p>

      <DataState status={list.status} isEmpty={items.length === 0} emptyText={t('common.error')}>
        {groups.map((g) => (
          <section key={g.cat} className="block" style={{ '--cat': g.color }}>
            <h2><span className="swatch" />{t(`wbCat.${g.cat}`)}</h2>
            <div className="stack">
              {g.items.map((it) => (
                <article key={it.id} className="row">
                  <h3 className="row__title">{it.title}</h3>
                  <p className="row__excerpt">{it.description}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </DataState>

      <p className="disclaimer muted">{t('common.disclaimer')}</p>
    </>
  )
}
