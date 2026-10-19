import { Router } from 'express'
import { listFinancing } from '../controllers/financing.controller.js'

const router = Router()
router.get('/', listFinancing)

export default router
