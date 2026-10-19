import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAdvisor } from '../context/AdvisorContext.jsx'

const SUGGESTIONS = ['s1', 's2', 's3', 's4']

export default function AdvisorWidget() {
  const { t } = useTranslation()
  const { open, setOpen, messages, busy, ask } = useAdvisor()
  const [text, setText] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, busy, open])

  function onSubmit(e) {
    e.preventDefault()
    ask(text)
    setText('')
  }

  if (!open) {
    return (
      <button type="button" className="advisor-fab" onClick={() => setOpen(true)}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
        </svg>
        {t('advisor.open')}
      </button>
    )
  }

  return (
    <section className="advisor" role="dialog" aria-label={t('advisor.title')}>
      <header className="advisor__head">
        <strong>{t('advisor.title')}</strong>
        <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label={t('advisor.close')}>×</button>
      </header>

      <div className="advisor__body" aria-live="polite">
        <div className="msg msg--bot"><p>{t('advisor.greeting')}</p></div>

        {messages.map((m, i) => (
          <div key={i} className={`msg msg--${m.from}`}>
            <p className="pre">{m.text}</p>
            {m.careers?.length > 0 && (
              <ul className="msg__list">
                {m.careers.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/carreras/${c.slug}`} onClick={() => setOpen(false)}>{c.name}</Link>
                    {c.match ? <span className="muted"> · {t('advisor.match', { percent: c.match })}</span> : null}
                  </li>
                ))}
              </ul>
            )}
            {m.links?.length > 0 && (
              <div className="msg__links">
                {m.links.map((l) => (
                  <Link key={l.to} to={l.to} className="chip" style={{ '--cat': 'var(--p2)' }} onClick={() => setOpen(false)}>{l.label}</Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {busy && <div className="msg msg--bot"><p className="muted">{t('advisor.thinking')}</p></div>}

        {messages.length === 0 && (
          <div className="chips">
            {SUGGESTIONS.map((key) => (
              <button
                key={key}
                type="button"
                className="chip"
                style={{ '--cat': 'var(--p1)' }}
                onClick={() => ask(t(`advisor.${key}`, { lng: 'es' }))}
              >
                {t(`advisor.${key}`)}
              </button>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form className="advisor__form" onSubmit={onSubmit}>
        <label htmlFor="advisor-input" className="sr-only">{t('advisor.placeholder')}</label>
        <input id="advisor-input" className="field" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('advisor.placeholder')} maxLength={500} />
        <button type="submit" className="btn btn--primary" disabled={busy}>{t('advisor.send')}</button>
      </form>
      <p className="advisor__note muted">{t('advisor.note')}</p>
    </section>
  )
}
