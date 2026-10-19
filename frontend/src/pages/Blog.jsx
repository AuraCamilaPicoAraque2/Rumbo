import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getArticles, getCategories } from '../services/blog.js'
import { pastelVar } from '../utils/format.js'
import ArticleRow from '../components/ArticleRow.jsx'

export default function Blog() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const category = params.get('category') || ''
  const page = Math.max(parseInt(params.get('page')) || 1, 1)

  const [text, setText] = useState(q)
  const [categories, setCategories] = useState([])
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    getCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    let active = true
    setStatus('loading')
    getArticles({ q: q || undefined, category: category || undefined, page, limit: 6 })
      .then((d) => {
        if (!active) return
        setData(d)
        setStatus('ok')
      })
      .catch(() => active && setStatus('error'))
    return () => {
      active = false
    }
  }, [q, category, page])

  // Actualiza los filtros en la URL; vuelve a la página 1 salvo que se indique otra
  function update(next) {
    const merged = { q, category, page: 1, ...next }
    const clean = {}
    Object.entries(merged).forEach(([key, value]) => {
      if (value && !(key === 'page' && value === 1)) clean[key] = String(value)
    })
    setParams(clean)
  }

  function onSearch(e) {
    e.preventDefault()
    update({ q: text.trim() })
  }

  function clearFilters() {
    setText('')
    setParams({})
  }

  return (
    <>
      <h1 className="page-title">{t('blog.title')}</h1>

      <form className="search" onSubmit={onSearch} role="search">
        <label htmlFor="q" className="sr-only">{t('blog.searchLabel')}</label>
        <input
          id="q"
          className="field"
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t('blog.searchPlaceholder')}
        />
        <button type="submit" className="btn btn--primary">{t('blog.search')}</button>
      </form>

      <div className="chips">
        <button
          type="button"
          className={category === '' ? 'chip chip--on' : 'chip'}
          style={{ '--cat': 'var(--p1)' }}
          onClick={() => update({ category: '' })}
        >
          {t('blog.all')}
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            className={category === c.slug ? 'chip chip--on' : 'chip'}
            style={{ '--cat': pastelVar(c.id) }}
            onClick={() => update({ category: c.slug })}
          >
            {c.name}
          </button>
        ))}
      </div>

      {status === 'loading' && <p className="state">{t('common.loading')}</p>}
      {status === 'error' && <p className="state state--error" role="alert">{t('common.error')}</p>}

      {status === 'ok' && data.items.length === 0 && (
        <div className="state">
          <strong>{t('blog.emptyTitle')}</strong>
          <p>{t('blog.emptyText')}</p>
          <button type="button" className="btn btn--ghost" onClick={clearFilters}>
            {t('blog.clear')}
          </button>
        </div>
      )}

      {status === 'ok' && data.items.length > 0 && (
        <>
          <p className="count">{t('blog.results', { count: data.total })}</p>
          <div className="stack">
            {data.items.map((a) => (
              <ArticleRow key={a.id} article={a} />
            ))}
          </div>

          {data.totalPages > 1 && (
            <nav className="pager">
              <button
                type="button"
                className="btn btn--ghost"
                disabled={page <= 1}
                onClick={() => update({ page: page - 1 })}
              >
                {t('blog.prev')}
              </button>
              <span>{t('blog.page', { page: data.page, totalPages: data.totalPages })}</span>
              <button
                type="button"
                className="btn btn--ghost"
                disabled={page >= data.totalPages}
                onClick={() => update({ page: page + 1 })}
              >
                {t('blog.next')}
              </button>
            </nav>
          )}
        </>
      )}
    </>
  )
}
