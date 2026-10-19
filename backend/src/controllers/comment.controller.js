import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'
import { str, positiveInt } from '../utils/validators.js'

async function findPublishedArticle(slug) {
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article || !article.published) throw new HttpError(404, 'Artículo no encontrado')
  return article
}

// GET /api/articles/:slug/comments
export const listComments = asyncHandler(async (req, res) => {
  const article = await findPublishedArticle(req.params.slug)
  const comments = await prisma.comment.findMany({
    where: { articleId: article.id },
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { id: true, name: true } } },
  })
  res.json(comments)
})

// POST /api/articles/:slug/comments  (sesión iniciada)
export const createComment = asyncHandler(async (req, res) => {
  const article = await findPublishedArticle(req.params.slug)
  const content = str(req.body.content, 'content', { min: 2, max: 1000 })
  const comment = await prisma.comment.create({
    data: { content, articleId: article.id, userId: req.user.id },
    include: { user: { select: { id: true, name: true } } },
  })
  res.status(201).json(comment)
})

// DELETE /api/comments/:id  (dueño del comentario o ADMIN)
export const deleteComment = asyncHandler(async (req, res) => {
  const id = positiveInt(req.params.id, 'id')
  const comment = await prisma.comment.findUnique({ where: { id } })
  if (!comment) throw new HttpError(404, 'Comentario no encontrado')
  if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
    throw new HttpError(403, 'No puedes eliminar este comentario')
  }
  await prisma.comment.delete({ where: { id } })
  res.status(204).end()
})
