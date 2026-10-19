import { useState } from 'react'
import { useTranslation } from 'react-i18next'

// Rutas de tus fotos (están en la carpeta frontend/public/collage/).
// Si tus fotos tienen otro nombre o formato (.png, .webp), cámbialo aquí.
const PHOTOS = {
  a: '/collage/comunidad.jpg',
  b: '/collage/estudio.jpg',
  c: '/collage/campus.jpg',
}

// Ilustraciones que se muestran mientras no haya foto
const ICONS = {
  people: (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="8" r="3" /><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
      <circle cx="17" cy="9" r="2.4" /><path d="M16 14.2a4 4 0 0 1 5 3.8v2" />
    </svg>
  ),
  laptop: (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="1.5" /><path d="M2 19h20" /><path d="M9 9l-2 2 2 2M15 9l2 2-2 2" />
    </svg>
  ),
  book: (
    <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z" /><path d="M12 6.5v13" />
    </svg>
  ),
}

function Tile({ className, src, alt, label, icon, color }) {
  const [failed, setFailed] = useState(false)
  return (
    <figure className={`tile ${className}`}>
      {failed ? (
        <div className="tile__fallback" style={{ background: color }} role="img" aria-label={alt}>
          {ICONS[icon]}
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      )}
      {label && <figcaption className="tile__label">{label}</figcaption>}
    </figure>
  )
}

export default function Collage({ programs = 0 }) {
  const { t } = useTranslation()
  return (
    <div className="collage">
      <Tile className="tile--a" src={PHOTOS.a} alt={t('collage.altA')} label={t('collage.community')} icon="people" color="var(--p1)" />
      <Tile className="tile--b" src={PHOTOS.b} alt={t('collage.altB')} icon="laptop" color="var(--p4)" />
      <Tile className="tile--c" src={PHOTOS.c} alt={t('collage.altC')} label={t('collage.campus')} icon="book" color="var(--p2)" />

      <div className="tile tile--stat">
        <span className="stat-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 2 9 2 12 0v-5" />
          </svg>
        </span>
        {programs > 0 ? (
          <>
            <strong className="stat-tile__n">{t('collage.statTitle', { count: programs })}</strong>
            <span className="muted">{t('collage.statText')}</span>
          </>
        ) : (
          <span className="muted">{t('collage.statFallback')}</span>
        )}
      </div>
    </div>
  )
}
