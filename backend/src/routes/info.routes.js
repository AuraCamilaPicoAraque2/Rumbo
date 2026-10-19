import { Router } from 'express'
import { getAdmission, listResources, listWellbeing, listFaqs } from '../controllers/info.controller.js'

const router = Router()
router.get('/admission', getAdmission)
router.get('/resources', listResources)
router.get('/wellbeing', listWellbeing)
router.get('/faqs', listFaqs)

export default router
