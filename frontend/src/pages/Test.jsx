import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { getQuestions, submitTest } from '../services/features.js'
import useFetch from '../utils/useFetch.js'
import { areaColor, riasecColor } from '../utils/format.js'
import DataState from '../components/DataState.jsx'

const LETTERS = ['R', 'I', 'A', 'S', 'E', 'C']

export default function Test() {
  const { t } = useTranslation()
  useAuth() // mantiene la sesión sincronizada con el resultado guardado
  const questions = useFetch(getQuestions, [])
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const list = questions.data || []

  async function finish(finalAnswers) {
    setBusy(true)
    setError('')
    try {
      const payload = Object.entries(finalAnswers).map(([questionId, value]) => ({ questionId: Number(questionId), value }))
      setResult(await submitTest(payload))
    } catch {
      setError(t('test.error'))
    } finally {
      setBusy(false)
    }
  }

  function choose(value) {
    const next = { ...answers, [list[index].id]: value }
    setAnswers(next)
    if (index + 1 < list.length) setIndex(index + 1)
    else finish(next)
  }

  function restart() {
    setStarted(false)
    setIndex(0)
    setAnswers({})
    setResult(null)
    setError('')
  }

  return (
    <div className="test">
      <h1 className="page-title">{t('test.title')}</h1>

      <DataState status={questions.status} isEmpty={list.length === 0} emptyText={t('common.error')}>
        {/* ----- Resultado ----- */}
        {result && (
          <div className="test__result">
            <section className="block block--tight">
              <h2>{t('test.resultTitle')}</h2>
              <div className="bars">
                {LETTERS.map((letter) => (
                  <div key={letter} className="bar">
                    <span>{t(`hex.${letter}`)}</span>
                    <div className="bar__track" role="progressbar" aria-valuenow={result.scores[letter]} aria-valuemin="0" aria-valuemax="100">
                      <div className="bar__fill" style={{ width: `${result.scores[letter]}%`, background: riasecColor(letter) }} />
                    </div>
                    <span>{result.scores[letter]}%</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="block">
              <h3>{t('test.topCode')}</h3>
              <ul className="riasec">
                {result.topCode.split('').map((letter) => (
                  <li key={letter}>
                    <span className="dot" style={{ background: riasecColor(letter) }}>{letter}</span>
                    {t(`hex.${letter}`)}
                  </li>
                ))}
              </ul>
            </section>

            <section className="block">
              <h2>{t('test.matchesTitle')}</h2>
              {result.recommendations.length === 0 ? (
                <p className="muted">{t('test.noMatches')}</p>
              ) : (
                <div className="grid">
                  {result.recommendations.map((c) => (
                    <Link key={c.id} to={`/carreras/${c.slug}`} className="card" style={{ '--cat': areaColor(c.area) }}>
                      <span className="card__area">{c.area} · {t(`level.${c.level}`)}</span>
                      <h3 className="card__title">{c.name}</h3>
                      <span className="card__foot">{t('test.affinity', { percent: c.match })}</span>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <div className="test__actions">
              {result.saved ? (
                <p className="muted">{t('test.saved')}</p>
              ) : (
                <Link to="/login" state={{ from: '/test-vocacional' }} className="link">{t('test.loginToSave')}</Link>
              )}
              <button type="button" className="btn btn--ghost" onClick={restart}>{t('test.retry')}</button>
            </div>
            <p className="disclaimer muted">{t('test.note')}</p>
          </div>
        )}

        {/* ----- Introducción ----- */}
        {!result && !started && (
          <div className="flow">
            <p className="prose prose--lead">{t('test.intro')}</p>
            <p className="muted">{t('test.duration', { count: list.length })}</p>
            <div>
              <button type="button" className="btn btn--primary btn--lg" onClick={() => setStarted(true)}>{t('test.start')}</button>
            </div>
            <p className="disclaimer muted">{t('test.note')}</p>
          </div>
        )}

        {/* ----- Preguntas ----- */}
        {!result && started && (
          <>
            {busy ? (
              <p className="state">{t('test.calculating')}</p>
            ) : (
              <>
                <p className="muted">{t('test.question', { current: index + 1, total: list.length })}</p>
                <div className="test__progress" aria-hidden="true">
                  <span style={{ width: `${(index / list.length) * 100}%` }} />
                </div>
                <p className="test__q">{list[index].text}</p>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} type="button" className="option" onClick={() => choose(value)}>
                      {t(`test.scale.${value}`)}
                    </button>
                  ))}
                </div>
                {error && <p className="alert" role="alert">{error}</p>}
                <button type="button" className="text-btn test__back" disabled={index === 0} onClick={() => setIndex(index - 1)}>
                  {t('test.back')}
                </button>
              </>
            )}
          </>
        )}
      </DataState>
    </div>
  )
}
