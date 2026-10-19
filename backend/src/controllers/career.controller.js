import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'

const LEVELS = ['AUXILIAR', 'OPERARIO', 'TECNICO', 'TECNOLOGO', 'PROFUNDIZACION', 'PROFESIONAL']

// GET /api/careers?q=&area=&level=
export const listCareers = asyncHandler(async (req, res) => {
  const { q, area, level } = req.query
  if (level && !LEVELS.includes(String(level))) {
    throw new HttpError(400, `El nivel debe ser uno de: ${LEVELS.join(', ')}`)
  }

  const where = {
    ...(area ? { area: String(area) } : {}),
    ...(level ? { level: String(level) } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: String(q), mode: 'insensitive' } },
            { description: { contains: String(q), mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const items = await prisma.career.findMany({
    where,
    orderBy: { name: 'asc' },
    select: {
      id: true, name: true, slug: true, area: true, level: true, description: true,
      durationYears: true, durationLabel: true, riasecCode: true,
      _count: { select: { universities: true } },
    },
  })

  // Cuántas instituciones tienen la oferta vigente por carrera
  const vigentes = await prisma.careerUniversity.groupBy({
    by: ['careerId'],
    where: { offerStatus: 'VIGENTE', careerId: { in: items.map((c) => c.id) } },
    _count: { _all: true },
  })
  const vigentesById = Object.fromEntries(vigentes.map((v) => [v.careerId, v._count._all]))

  res.json(items.map((c) => ({ ...c, vigentes: vigentesById[c.id] || 0 })))
})

// GET /api/careers/areas
export const listAreas = asyncHandler(async (req, res) => {
  const rows = await prisma.career.groupBy({
    by: ['area'],
    _count: { _all: true },
    orderBy: { area: 'asc' },
  })
  res.json(rows.map((r) => ({ area: r.area, count: r._count._all })))
})

// GET /api/careers/:slug
export const getCareer = asyncHandler(async (req, res) => {
  const career = await prisma.career.findUnique({
    where: { slug: req.params.slug },
    include: {
      universities: {
        include: { university: true },
        orderBy: { university: { name: 'asc' } },
      },
    },
  })
  if (!career) throw new HttpError(404, 'Carrera no encontrada')

  const { universities, ...rest } = career
  res.json({
    ...rest,
    offerings: universities.map((o) => ({
      modality: o.modality,
      offerStatus: o.offerStatus,
      verifiedAt: o.verifiedAt,
      programUrl: o.programUrl,
      university: {
        id: o.university.id,
        name: o.university.name,
        city: o.university.city,
        isPublic: o.university.isPublic,
        kind: o.university.kind,
        website: o.university.website,
      },
    })),
  })
})
