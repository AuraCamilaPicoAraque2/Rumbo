import { Router } from 'express'
import { getQuestions, submitTest, myResults } from '../controllers/test.controller.js'
import { authenticate, optionalAuth } from '../middlewares/auth.js'

const router = Router()
router.get('/questions', getQuestions)
router.post('/submit', optionalAuth, submitTest) // guarda el resultado solo si hay sesión
router.get('/results', authenticate, myResults)

export default router
