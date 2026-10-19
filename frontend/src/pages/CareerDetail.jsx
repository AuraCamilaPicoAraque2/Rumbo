import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getCareer, getFinancing } from '../services/catalog.js'
import useFetch from '../utils/useFetch.js'
import { areaColor, riasecColor, formatDate } from '../utils/format.js'
import StatusBadge from '../components/StatusBadge.jsx'
import DataState from '../components/DataState.jsx'

export default function CareerDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const career = useFetch(() => getCareer(slug), [slug])
  const financing = useFetch(() => getFinancing(), [])

  if (career.status === 'error' && career.error?.response?.status === 404) {
    return (
      <div className="state">
        <strong>{t('career.notFoundTitle')}</strong>
        <p>{t('career.notFoundText')}</p>
        <Link to="/carreras" className="btn btn--ghost">{t('career.back')}</Link>
      </div>
    )
  }

  const c = career.data

  return (
    <DataState status={career.status}>
      {c && (
        <article className="detail detail--wide">
          <Link to="/carreras" className="link">{t('career.back')}</Link>

          <header className="detail__head" style={{ '--cat': areaColor(c.area) }}>
            <span className="tag">{c.area}</span>
            <h1>{c.name}</h1>
            <div className="facts">
              <span><strong>{t(`level.${c.level}`)}</strong></span>
              {c.durationLabel && <span>{t('career.duration')}: {c.durationLabel}</span>}
            </div>
          </header>

          <p className="prose prose--lead">{c.description}</p>

          <section className="block">
            <h2>{t('career.interests')}</h2>
            <ul className="riasec">
              {c.riasecCode.split('').map((letter) => (
                <li key={letter}>
                  <span className="dot" style={{ background: riasecColor(letter) }}>{letter}</span>
                  {t(`hex.${letter}`)}
                </li>
              ))}
            </ul>
          </section>

          {c.outlook && (
            <section className="block">
              <h2>{t('career.outlook')}</h2>
              <p className="prose">{c.outlook}</p>
            </section>
          )}

          <section className="block">
            <h2>{t('career.where')}</h2>
            {c.offerings.length === 0 ? (
              <p className="muted">{t('career.noOffer')}</p>
            ) : (
              <ul className="offers">
                {c.offerings.map((o) => (
                  <li key={o.university.id} className="offer">
                    <div className="offer__head">
                      <strong>{o.university.name}</strong>
                      <StatusBadge status={o.offerStatus} />
                    </div>
                    <div className="offer__meta">
                      <span>{o.university.city}</span>
                      <span>{t(o.university.isPublic ? 'sector.public' : 'sector.private')}</span>
                      <span>{t(`modality.${o.modality}`)}</span>
                      <span>
                        {o.verifiedAt
                          ? t('common.verifiedOn', { date: formatDate(o.verifiedAt, i18n.language) })
                          : t('common.notVerified')}
                      </span>
                    </div>
                    {(o.programUrl || o.university.website) && (
                      <a className="link" href={o.programUrl || o.university.website} target="_blank" rel="noreferrer">
                        {t('common.site')}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <p className="disclaimer muted">{t('common.disclaimer')}</p>
          </section>

          {financing.status === 'ok' && financing.data.length > 0 && (
            <section className="block">
              <h2>{t('career.financing')}</h2>
              <ul className="mini-list">
                {financing.data.slice(0, 4).map((f) => (
                  <li key={f.id}>
                    <span className="tag tag--plain">{t(`finType.${f.type}`)}</span>
                    <Link to="/financiacion" className="link">{f.name}</Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      )}
    </DataState>
  )
}
