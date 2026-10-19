import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getAdmission } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import DataState from '../components/DataState.jsx'

const TRACKS = ['UNIVERSIDAD', 'SENA']

export default function Admissions() {
  const { t } = useTranslation()
  const [track, setTrack] = useState('UNIVERSIDAD')
  const data = useFetch(getAdmission, [])

  const steps = (data.data?.steps || []).filter((s) => s.track === track)
  const dates = data.data?.dates || []

  return (
    <>
      <h1 className="page-title">{t('admissions.title')}</h1>
      <p className="lead">{t('admissions.subtitle')}</p>

      <div className="chips">
        {TRACKS.map((tr, i) => (
          <button key={tr} type="button" className={track === tr ? 'chip chip--on' : 'chip'} style={{ '--cat': `var(--p${i * 2 + 1})` }} onClick={() => setTrack(tr)}>
            {t(`admissions.track${tr}`)}
          </button>
        ))}
      </div>

      <DataState status={data.status} isEmpty={steps.length === 0} emptyText={t('common.error')}>
        <ol className="steps">
          {steps.map((s) => (
            <li key={s.id}>
              <h3>{s.title}</h3>
              <p className="muted">{s.description}</p>
              {s.url && (
                <a className="link" href={s.url} target="_blank" rel="noreferrer">{t('common.site')}</a>
              )}
            </li>
          ))}
        </ol>

        <section className="block">
          <h2>{t('admissions.datesTitle')}</h2>
          <dl className="dates">
            {dates.map((d) => (
              <div key={d.id}>
                <dt>
                  <strong>{d.title}</strong>
                  <span className="tag tag--plain">{d.whenLabel}</span>
                </dt>
                <dd>
                  {d.description}
                  {d.url && (
                    <>
                      {' '}
                      <a className="link" href={d.url} target="_blank" rel="noreferrer">{t('common.site')}</a>
                    </>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="block"><Link to="/preguntas-frecuentes" className="link">{t('admissions.faqLink')}</Link></p>
      </DataState>

      <p className="disclaimer muted">{t('common.disclaimer')}</p>
    </>
  )
}
