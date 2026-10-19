import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCareers, getCareerAreas } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import { areaColor } from '../utils/format.js'
import DataState from '../components/DataState.jsx'

const LEVELS = ['TECNICO', 'TECNOLOGO', 'PROFESIONAL']

export default function Careers() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const area = params.get('area') || ''
  const level = params.get('level') || ''
  const [text, setText] = useState(q)

  const areas = useFetch(getCareerAreas, [])
  const careers = useFetch(
    () => getCareers({ q: q || undefined, area: area || undefined, level: level || undefined }),
    [q, area, level]
  )

  function update(next) {
    const merged = { q, area, level, ...next }
    const clean = {}
    Object.entries(merged).forEach(([key, value]) => {
      if (value) clean[key] = value
    })
    setParams(clean)
  }

  function onSearch(e) {
    e.preventDefault()
    update({ q: text.trim() })
  }

  const list = careers.data || []

  return (
    <>
      <h1 className="page-title">{t('careers.title')}</h1>
      <p className="lead">{t('careers.subtitle')}</p>

      <form className="search" onSubmit={onSearch} role="search">
        <label htmlFor="q" className="sr-only">{t('careers.searchLabel')}</label>
        <input id="q" className="field" type="search" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('careers.searchPlaceholder')} />
        <button type="submit" className="btn btn--primary">{t('common.search')}</button>
      </form>

      <p className="filter-label">{t('careers.level')}</p>
      <div className="chips">
        <button type="button" className={level === '' ? 'chip chip--on' : 'chip'} style={{ '--cat': 'var(--p1)' }} onClick={() => update({ level: '' })}>
          {t('common.allM')}
        </button>
        {LEVELS.map((lv, i) => (
          <button key={lv} type="button" className={level === lv ? 'chip chip--on' : 'chip'} style={{ '--cat': `var(--p${i * 2 + 1})` }} onClick={() => update({ level: lv })}>
            {t(`level.${lv}`)}
          </button>
        ))}
      </div>

      <p className="filter-label">{t('careers.area')}</p>
      <div className="chips">
        <button type="button" className={area === '' ? 'chip chip--on' : 'chip'} style={{ '--cat': 'var(--p1)' }} onClick={() => update({ area: '' })}>
          {t('common.all')}
        </button>
        {(areas.data || []).map((a) => (
          <button key={a.area} type="button" className={area === a.area ? 'chip chip--on' : 'chip'} style={{ '--cat': areaColor(a.area) }} onClick={() => update({ area: a.area })}>
            {a.area}
          </button>
        ))}
      </div>

      <DataState status={careers.status} isEmpty={list.length === 0} emptyText={t('careers.empty')}>
        <p className="count">{t('careers.total', { count: list.length })}</p>
        <div className="grid">
          {list.map((c) => (
            <Link key={c.id} to={`/carreras/${c.slug}`} className="card" style={{ '--cat': areaColor(c.area) }}>
              <span className="card__area">{c.area} · {t(`level.${c.level}`)}</span>
              <h3 className="card__title">{c.name}</h3>
              <p className="card__text">{c.description}</p>
              <span className="card__foot">{t('careers.counts', { count: c._count.universities, vigentes: c.vigentes })}</span>
            </Link>
          ))}
        </div>
      </DataState>

      <p className="disclaimer muted">{t('common.disclaimer')}</p>
    </>
  )
}
