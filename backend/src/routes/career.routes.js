import { Router } from 'express'
import { listCareers, listAreas, getCareer } from '../controllers/career.controller.js'

const router = Router()
router.get('/', listCareers)
router.get('/areas', listAreas) // antes de "/:slug"
router.get('/:slug', getCareer)

export default router
