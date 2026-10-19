import { Router } from 'express'
import healthRoutes from './health.routes.js'
import authRoutes from './auth.routes.js'
import categoryRoutes from './category.routes.js'
import articleRoutes from './article.routes.js'
import commentRoutes from './comment.routes.js'
import careerRoutes from './career.routes.js'
import universityRoutes from './university.routes.js'
import financingRoutes from './financing.routes.js'
import infoRoutes from './info.routes.js'
import testRoutes from './test.routes.js'
import orientadorRoutes from './orientador.routes.js'
import adminRoutes from './admin.routes.js'

const router = Router()

router.use('/health', healthRoutes)
router.use('/auth', authRoutes)
router.use('/categories', categoryRoutes)
router.use('/articles', articleRoutes)
router.use('/comments', commentRoutes)
router.use('/careers', careerRoutes)
router.use('/universities', universityRoutes)
router.use('/financing', financingRoutes)
router.use(infoRoutes) // /admission, /resources, /wellbeing, /faqs
router.use('/test', testRoutes)
router.use('/orientador', orientadorRoutes)
router.use('/admin', adminRoutes)

export default router
