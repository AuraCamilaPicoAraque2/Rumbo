import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { formatDate, pastelVar } from '../utils/format.js'

export default function ArticleRow({ article, featured = false }) {
  const { t, i18n } = useTranslation()
  const date = article.publishedAt || article.createdAt

  return (
    <article
      className={featured ? 'row row--featured' : 'row'}
      style={{ '--cat': pastelVar(article.category.id) }}
    >
      <span className="tag">{article.category.name}</span>
      <h3 className="row__title">
        <Link to={`/blog/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="row__excerpt">{article.excerpt}</p>
      <div className="row__meta">
        <span>{t('article.by', { name: article.author.name })}</span>
        <span>{formatDate(date, i18n.language)}</span>
      </div>
    </article>
  )
}
