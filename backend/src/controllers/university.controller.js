import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/universities?q=&sector=public|private&kind=SENA
export const listUniversities = asyncHandler(async (req, res) => {
  const { q, sector, kind } = req.query
  const where = {
    ...(sector === 'public' ? { isPublic: true } : {}),
    ...(sector === 'private' ? { isPublic: false } : {}),
    ...(kind ? { kind: String(kind) } : {}),
    ...(q ? { name: { contains: String(q), mode: 'insensitive' } } : {}),
  }
  const items = await prisma.university.findMany({
    where,
    orderBy: { name: 'asc' },
    include: { _count: { select: { careers: true } } },
  })
  res.json(items)
})
