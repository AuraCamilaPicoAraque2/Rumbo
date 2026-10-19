import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'

// GET /api/admission  -> pasos por ruta (UNIVERSIDAD / SENA) y fechas importantes
export const getAdmission = asyncHandler(async (req, res) => {
  const [steps, dates] = await Promise.all([
    prisma.admissionStep.findMany({ orderBy: [{ track: 'asc' }, { order: 'asc' }] }),
    prisma.importantDate.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  res.json({ steps, dates })
})

// GET /api/resources?type=GUIA
export const listResources = asyncHandler(async (req, res) => {
  const { type } = req.query
  res.json(
    await prisma.resource.findMany({
      where: type ? { type: String(type) } : {},
      orderBy: [{ category: 'asc' }, { title: 'asc' }],
    })
  )
})

// GET /api/wellbeing
export const listWellbeing = asyncHandler(async (req, res) => {
  res.json(await prisma.wellbeingService.findMany({ orderBy: [{ category: 'asc' }, { id: 'asc' }] }))
})

// GET /api/faqs
export const listFaqs = asyncHandler(async (req, res) => {
  res.json(await prisma.faq.findMany({ orderBy: { sortOrder: 'asc' } }))
})
