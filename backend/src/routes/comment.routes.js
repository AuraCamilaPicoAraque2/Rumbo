import { Router } from 'express'
import { deleteComment } from '../controllers/comment.controller.js'
import { authenticate } from '../middlewares/auth.js'

const router = Router()
router.delete('/:id', authenticate, deleteComment)

export default router
