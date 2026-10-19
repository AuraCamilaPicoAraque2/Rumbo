import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { useAdvisor } from '../context/AdvisorContext.jsx'
import { getArticles } from '../services/blog.js'
import { getCareerAreas } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import { areaColor } from '../utils/format.js'
import HexMap from '../components/HexMap.jsx'
import Collage from '../components/Collage.jsx'
import ArticleRow from '../components/ArticleRow.jsx'
import DataState from '../components/DataState.jsx'

const LEVEL_PATHS = ['TECNICO', 'TECNOLOGO', 'PROFESIONAL']
const SUGGESTIONS = ['s1', 's2', 's3', 's4']
const QUICK = [
  ['financing', '/financiacion'],
  ['admissions', '/admisiones'],
  ['library', '/biblioteca'],
  ['wellbeing', '/bienestar'],
]

export default function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { ask } = useAdvisor()
  const [question, setQuestion] = useState('')
  const articles = useFetch(() => getArticles({ limit: 4 }), [])
  const areas = useFetch(getCareerAreas, [])

  function onAsk(e) {
    e.preventDefault()
    ask(question)
    setQuestion('')
  }

  const programs = (areas.data || []).reduce((n, a) => n + a.count, 0)
  const items = articles.data?.items || []
  const [featured, ...rest] = items

  return (
    <>
      <section className="hero">
        <div className="hero__text">
          <h1>{t('home.title')}</h1>
          <p className="hero__sub">{t('home.subtitle')}</p>
          <form className="ask" onSubmit={onAsk}>
            <label htmlFor="ask" className="sr-only">{t('advisor.open')}</label>
            <input id="ask" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t('advisor.heroPlaceholder')} maxLength={500} />
            <button type="submit" className="btn btn--primary">{t('advisor.ask')}</button>
          </form>
          <div className="chips hero__chips">
            {SUGGESTIONS.map((key) => (
              <button key={key} type="button" className="chip" style={{ '--cat': 'var(--p1)' }} onClick={() => ask(t(`advisor.${key}`, { lng: 'es' }))}>
                {t(`advisor.${key}`)}
              </button>
            ))}
          </div>
          <div className="hero__actions">
            <Link to="/test-vocacional" className="btn btn--primary btn--lg">{t('nav.test')}</Link>
            <Link to="/carreras" className="btn btn--ghost btn--lg">{t('nav.careers')}</Link>
          </div>
        </div>
        <Collage programs={programs} />
      </section>

      <section className="section">
        <h2>{t('paths.title')}</h2>
        <div className="paths">
          {LEVEL_PATHS.map((level, i) => (
            <Link key={level} to={`/carreras?level=${level}`} className="path" style={{ '--cat': `var(--p${i * 2 + 1})` }}>
              <span className="path__name">{t(`paths.${level}.name`)}</span>
              <span className="path__text">{t(`paths.${level}.text`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="feature">
        <div className="feature__text">
          <h2>{t('home.hexTitle')}</h2>
          <p className="muted">{t('home.hexText')}</p>
          <Link to="/test-vocacional" className="btn btn--primary btn--lg">{t('home.hexCta')}</Link>
        </div>
        <HexMap />
      </section>

      {areas.status === 'ok' && areas.data.length > 0 && (
        <section className="section">
          <h2>{t('areas.title')}</h2>
          <div className="chips">
            {areas.data.map((a) => (
              <Link key={a.area} to={`/carreras?area=${encodeURIComponent(a.area)}`} className="chip" style={{ '--cat': areaColor(a.area) }}>
                {a.area} ({a.count})
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2>{t('home.latest')}</h2>
        <DataState
          status={articles.status}
          isEmpty={items.length === 0}
          emptyText={`${t('home.emptyTitle')}. ${t('home.emptyText')}`}
        >
          <div className="stack">
            {featured && <ArticleRow article={featured} featured />}
            {rest.map((a) => (
              <ArticleRow key={a.id} article={a} />
            ))}
            <Link to="/blog" className="link">{t('home.viewAll')}</Link>
          </div>
        </DataState>
      </section>

      <section className="section">
        <h2>{t('quick.title')}</h2>
        <div className="quick">
          {QUICK.map(([key, to]) => (
            <Link key={key} to={to}>
              <span className="quick__name">{t(`quick.${key}.name`)}</span>
              <span className="muted">{t(`quick.${key}.text`)}</span>
            </Link>
          ))}
        </div>
      </section>

      {!user && (
        <section className="band">
          <div>
            <h2>{t('home.joinTitle')}</h2>
            <p>{t('home.joinText')}</p>
          </div>
          <Link to="/registro" className="btn btn--primary btn--lg">{t('home.ctaRegister')}</Link>
        </section>
      )}
    </>
  )
}
