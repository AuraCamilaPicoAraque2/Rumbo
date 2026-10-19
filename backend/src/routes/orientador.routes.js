import { Router } from 'express'
import { askAdvisor } from '../controllers/orientador.controller.js'

const router = Router()
router.post('/', askAdvisor)

export default router
