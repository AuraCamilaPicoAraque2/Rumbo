import { Router } from 'express'
import { listCategories, createCategory } from '../controllers/category.controller.js'
import { authenticate, requireRole } from '../middlewares/auth.js'

const router = Router()
router.get('/', listCategories)
router.post('/', authenticate, requireRole('ADMIN'), createCategory)

export default router
