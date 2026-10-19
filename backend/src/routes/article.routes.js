import { Router } from 'express'
import {
  listArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
} from '../controllers/article.controller.js'
import { listComments, createComment } from '../controllers/comment.controller.js'
import { authenticate, optionalAuth, requireRole } from '../middlewares/auth.js'

const router = Router()

router.get('/', optionalAuth, listArticles)
router.get('/:slug', optionalAuth, getArticle)
router.post('/', authenticate, requireRole('ADMIN'), createArticle)
router.put('/:id', authenticate, requireRole('ADMIN'), updateArticle)
router.delete('/:id', authenticate, requireRole('ADMIN'), deleteArticle)

// Comentarios de un artículo
router.get('/:slug/comments', listComments)
router.post('/:slug/comments', authenticate, createComment)

export default router
