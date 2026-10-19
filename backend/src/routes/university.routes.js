import { Router } from 'express'
import { listUniversities } from '../controllers/university.controller.js'

const router = Router()
router.get('/', listUniversities)

export default router
