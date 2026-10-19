import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'
import { positiveInt } from '../utils/validators.js'
import { ENUMS } from '../utils/enums.js'

// GET /api/admin/stats
export const getStats = asyncHandler(async (req, res) => {
  const [articles, drafts, comments, careers, universities, financing, resources, users, tests] = await Promise.all([
    prisma.article.count({ where: { published: true } }),
    prisma.article.count({ where: { published: false } }),
    prisma.comment.count(),
    prisma.career.count(),
    prisma.university.count(),
    prisma.financing.count(),
    prisma.resource.count(),
    prisma.user.count(),
    prisma.testResult.count(),
  ])
  res.json({ articles, drafts, comments, careers, universities, financing, resources, users, tests })
})

// POST /api/admin/offerings  -> crea o actualiza una oferta (carrera + institución)
export const saveOffering = asyncHandler(async (req, res) => {
  const { modality, offerStatus, programUrl, verified } = req.body
  const careerId = positiveInt(req.body.careerId, 'careerId')
  const universityId = positiveInt(req.body.universityId, 'universityId')

  if (modality !== undefined && !ENUMS.modality.includes(modality)) throw new HttpError(400, 'Modalidad inválida')
  if (offerStatus !== undefined && !ENUMS.offerStatus.includes(offerStatus)) throw new HttpError(400, 'Estado de oferta inválido')
  if (programUrl && !/^https?:\/\//i.test(programUrl)) throw new HttpError(400, 'El enlace debe empezar por http:// o https://')

  const data = {
    ...(modality !== undefined ? { modality } : {}),
    ...(offerStatus !== undefined ? { offerStatus } : {}),
    ...(programUrl !== undefined ? { programUrl: programUrl || null } : {}),
    // verified=true marca la fecha de hoy; verified=false la quita
    ...(verified === true ? { verifiedAt: new Date() } : {}),
    ...(verified === false ? { verifiedAt: null } : {}),
  }

  const offering = await prisma.careerUniversity.upsert({
    where: { careerId_universityId: { careerId, universityId } },
    update: data,
    create: { careerId, universityId, ...data },
  })
  res.json(offering)
})

// DELETE /api/admin/offerings/:careerId/:universityId
export const deleteOffering = asyncHandler(async (req, res) => {
  const careerId = positiveInt(req.params.careerId, 'careerId')
  const universityId = positiveInt(req.params.universityId, 'universityId')
  await prisma.careerUniversity.delete({ where: { careerId_universityId: { careerId, universityId } } })
  res.status(204).end()
})
