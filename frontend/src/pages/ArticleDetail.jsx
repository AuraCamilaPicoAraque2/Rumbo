import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { getArticle, getComments, addComment, removeComment } from '../services/blog.js'
import { errorMessage } from '../services/api.js'
import { formatDate, pastelVar } from '../utils/format.js'

export default function ArticleDetail() {
  const { slug } = useParams()
  const { t, i18n } = useTranslation()
  const { user } = useAuth()

  const [article, setArticle] = useState(null)
  const [comments, setComments] = useState([])
  const [status, setStatus] = useState('loading')
  const [text, setText] = useState('')
  const [formError, setFormError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let active = true
    setStatus('loading')
    Promise.all([getArticle(slug), getComments(slug)])
      .then(([art, coms]) => {
        if (!active) return
        setArticle(art)
        setComments(coms)
        setStatus('ok')
      })
      .catch((err) => active && setStatus(err.response?.status === 404 ? 'missing' : 'error'))
    return () => {
      active = false
    }
  }, [slug])

  async function onComment(e) {
    e.preventDefault()
    setFormError('')
    setSending(true)
    try {
      const created = await addComment(slug, text)
      setComments([created, ...comments])
      setText('')
    } catch (err) {
      setFormError(errorMessage(err, t('article.commentError')))
    } finally {
      setSending(false)
    }
  }

  async function onDelete(id) {
    try {
      await removeComment(id)
      setComments(comments.filter((c) => c.id !== id))
    } catch (err) {
      setFormError(errorMessage(err, t('article.commentError')))
    }
  }

  if (status === 'loading') return <p className="state">{t('common.loading')}</p>
  if (status === 'error') return <p className="state state--error" role="alert">{t('common.error')}</p>
  if (status === 'missing') {
    return (
      <div className="state">
        <strong>{t('article.notFoundTitle')}</strong>
        <p>{t('article.notFoundText')}</p>
        <Link to="/blog" className="btn btn--ghost">{t('article.back')}</Link>
      </div>
    )
  }

  const date = article.publishedAt || article.createdAt
  const paragraphs = article.content.split(/\n{2,}/)

  return (
    <article className="detail">
      <Link to="/blog" className="link">{t('article.back')}</Link>

      <header className="detail__head" style={{ '--cat': pastelVar(article.category.id) }}>
        <span className="tag">{article.category.name}</span>
        <h1>{article.title}</h1>
        <div className="row__meta">
          <span>{t('article.by', { name: article.author.name })}</span>
          <span>{formatDate(date, i18n.language)}</span>
        </div>
      </header>

      <div className="prose">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <section className="comments">
        <h2>{t('article.comments')} ({comments.length})</h2>

        {user ? (
          <form onSubmit={onComment} className="comment-form">
            <label htmlFor="comment">{t('article.commentLabel')}</label>
            <textarea
              id="comment"
              className="field"
              rows="3"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t('article.commentPlaceholder')}
              required
              minLength={2}
              maxLength={1000}
            />
            {formError && <p className="alert" role="alert">{formError}</p>}
            <button type="submit" className="btn btn--primary" disabled={sending}>
              {sending ? t('article.publishing') : t('article.publish')}
            </button>
          </form>
        ) : (
          <p>
            <Link to="/login" state={{ from: `/blog/${slug}` }} className="link">
              {t('article.loginToComment')}
            </Link>
          </p>
        )}

        {comments.length === 0 && <p className="muted">{t('article.noComments')}</p>}
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment">
              <div className="comment__head">
                <strong>{c.user.name}</strong>
                <span className="muted">{formatDate(c.createdAt, i18n.language)}</span>
                {user && (user.id === c.user.id || user.role === 'ADMIN') && (
                  <button type="button" className="text-btn" onClick={() => onDelete(c.id)}>
                    {t('article.delete')}
                  </button>
                )}
              </div>
              <p>{c.content}</p>
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
