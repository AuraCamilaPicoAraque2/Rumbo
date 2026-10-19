import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getUniversities } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import DataState from '../components/DataState.jsx'

const FILTERS = {
  all: {},
  public: { sector: 'public' },
  private: { sector: 'private' },
  sena: { kind: 'SENA' },
}
const FILTER_LABEL = { all: 'common.allM', public: 'institutions.filterPublic', private: 'institutions.filterPrivate', sena: 'institutions.filterSena' }

export default function Institutions() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const filter = FILTERS[params.get('f')] ? params.get('f') : 'all'

  const list = useFetch(() => getUniversities(FILTERS[filter]), [filter])
  const items = list.data || []

  return (
    <>
      <h1 className="page-title">{t('institutions.title')}</h1>
      <p className="lead">{t('institutions.subtitle')}</p>

      <div className="chips">
        {Object.keys(FILTERS).map((key, i) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'chip chip--on' : 'chip'}
            style={{ '--cat': `var(--p${i + 1})` }}
            onClick={() => setParams(key === 'all' ? {} : { f: key })}
          >
            {t(FILTER_LABEL[key])}
          </button>
        ))}
      </div>

      <DataState status={list.status} isEmpty={items.length === 0} emptyText={t('institutions.empty')}>
        <div className="grid">
          {items.map((u) => (
            <article key={u.id} className="card card--static" style={{ '--cat': u.isPublic ? 'var(--p2)' : 'var(--p5)' }}>
              <span className="card__area">{u.city}</span>
              <h3 className="card__title">{u.name}</h3>
              <div className="tags">
                <span className="tag">{t(u.isPublic ? 'sector.public' : 'sector.private')}</span>
                <span className="tag tag--plain">{t(`kind.${u.kind}`)}</span>
              </div>
              {u.description && <p className="card__text">{u.description}</p>}
              <span className="card__foot">
                {t('institutions.programs', { count: u._count.careers })}
                {u.website && (
                  <>
                    {' '}
                    <a className="link" href={u.website} target="_blank" rel="noreferrer">{t('common.site')}</a>
                  </>
                )}
              </span>
            </article>
          ))}
        </div>
      </DataState>

      <p className="disclaimer muted">{t('common.disclaimer')}</p>
    </>
  )
}
