import { Router } from 'express'
import { authenticate, requireRole } from '../middlewares/auth.js'
import { RESOURCES } from '../controllers/admin.config.js'
import { makeCrud } from '../controllers/admin.crud.js'
import { getStats, saveOffering, deleteOffering } from '../controllers/admin.controller.js'

const router = Router()

// Todo lo de /api/admin exige sesión de administrador
router.use(authenticate, requireRole('ADMIN'))

router.get('/stats', getStats)
router.post('/offerings', saveOffering)
router.delete('/offerings/:careerId/:universityId', deleteOffering)

// CRUD automático para cada recurso definido en admin.config.js
for (const [path, config] of Object.entries(RESOURCES)) {
  const crud = makeCrud(config)
  router.get(`/${path}`, crud.list)
  router.post(`/${path}`, crud.create)
  router.put(`/${path}/:id`, crud.update)
  router.delete(`/${path}/:id`, crud.remove)
}

export default router
