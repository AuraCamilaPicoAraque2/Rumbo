import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/financing?type=CREDITO&scope=PUBLICA
export const listFinancing = asyncHandler(async (req, res) => {
  const { type, scope } = req.query
  const items = await prisma.financing.findMany({
    where: { ...(type ? { type: String(type) } : {}), ...(scope ? { scope: String(scope) } : {}) },
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
  })
  res.json(items)
})
