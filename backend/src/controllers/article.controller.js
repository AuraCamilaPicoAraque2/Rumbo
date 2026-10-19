import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'
import { slugify } from '../utils/slugify.js'
import { str, positiveInt } from '../utils/validators.js'

const listSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverUrl: true,
  published: true,
  publishedAt: true,
  createdAt: true,
  author: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, slug: true } },
  _count: { select: { comments: true } },
}

const detailInclude = {
  author: { select: { id: true, name: true } },
  category: { select: { id: true, name: true, slug: true } },
}

async function uniqueSlug(title) {
  const base = slugify(title) || 'articulo'
  let slug = base
  let n = 1
  while (await prisma.article.findUnique({ where: { slug } })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}

// GET /api/articles?page=1&limit=9&q=texto&category=becas&drafts=true(solo ADMIN)
export const listArticles = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1)
  const limit = Math.min(Math.max(parseInt(req.query.limit) || 9, 1), 50)
  const { q, category } = req.query
  const seeDrafts = req.user?.role === 'ADMIN' && req.query.drafts === 'true'

  const where = {
    ...(seeDrafts ? {} : { published: true }),
    ...(category ? { category: { slug: String(category) } } : {}),
    ...(q
      ? {
          OR: [
            { title: { contains: String(q), mode: 'insensitive' } },
            { excerpt: { contains: String(q), mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const [total, items] = await prisma.$transaction([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      select: listSelect,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) })
})

// GET /api/articles/:slug
export const getArticle = asyncHandler(async (req, res) => {
  const article = await prisma.article.findUnique({
    where: { slug: req.params.slug },
    include: detailInclude,
  })
  const canSee = article && (article.published || req.user?.role === 'ADMIN')
  if (!canSee) throw new HttpError(404, 'Artículo no encontrado')
  res.json(article)
})

// POST /api/articles  (ADMIN)
export const createArticle = asyncHandler(async (req, res) => {
  const b = req.body
  const title = str(b.title, 'title', { min: 3, max: 200 })
  const excerpt = str(b.excerpt, 'excerpt', { min: 10, max: 300 })
  const content = str(b.content, 'content', { min: 20, max: 50000 })
  const categoryId = positiveInt(b.categoryId, 'categoryId')
  const published = b.published === true
  const coverUrl = b.coverUrl ? str(b.coverUrl, 'coverUrl', { max: 500 }) : null

  const article = await prisma.article.create({
    data: {
      title,
      slug: await uniqueSlug(title),
      excerpt,
      content,
      coverUrl,
      published,
      publishedAt: published ? new Date() : null,
      authorId: req.user.id,
      categoryId,
    },
    include: detailInclude,
  })
  res.status(201).json(article)
})

// PUT /api/articles/:id  (ADMIN) - actualización parcial
export const updateArticle = asyncHandler(async (req, res) => {
  const id = positiveInt(req.params.id, 'id')
  const existing = await prisma.article.findUnique({ where: { id } })
  if (!existing) throw new HttpError(404, 'Artículo no encontrado')

  const b = req.body
  const data = {}
  if (b.title !== undefined) data.title = str(b.title, 'title', { min: 3, max: 200 })
  if (b.excerpt !== undefined) data.excerpt = str(b.excerpt, 'excerpt', { min: 10, max: 300 })
  if (b.content !== undefined) data.content = str(b.content, 'content', { min: 20, max: 50000 })
  if (b.categoryId !== undefined) data.categoryId = positiveInt(b.categoryId, 'categoryId')
  if (b.coverUrl !== undefined) data.coverUrl = b.coverUrl ? str(b.coverUrl, 'coverUrl', { max: 500 }) : null
  if (b.published !== undefined) {
    data.published = b.published === true
    if (data.published && !existing.publishedAt) data.publishedAt = new Date()
  }

  const article = await prisma.article.update({ where: { id }, data, include: detailInclude })
  res.json(article)
})

// DELETE /api/articles/:id  (ADMIN)
export const deleteArticle = asyncHandler(async (req, res) => {
  const id = positiveInt(req.params.id, 'id')
  await prisma.article.delete({ where: { id } })
  res.status(204).end()
})
