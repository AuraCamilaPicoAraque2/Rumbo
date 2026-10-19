import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'
import { LETTERS, DIM_TO_LETTER, rankCareers } from '../utils/matching.js'

// Intercala las preguntas para que dos seguidas no sean de la misma dimensión
function interleave(questions) {
  const groups = {}
  for (const q of questions) (groups[q.dimension] ||= []).push(q)
  const lists = Object.values(groups)
  const out = []
  for (let i = 0; lists.some((l) => i < l.length); i++) {
    for (const l of lists) if (i < l.length) out.push(l[i])
  }
  return out
}

// GET /api/test/questions
export const getQuestions = asyncHandler(async (req, res) => {
  const questions = await prisma.question.findMany({ orderBy: { id: 'asc' } })
  res.json(interleave(questions).map((q) => ({ id: q.id, text: q.text })))
})

// POST /api/test/submit   { answers: [{ questionId, value (1-5) }] }
export const submitTest = asyncHandler(async (req, res) => {
  const { answers } = req.body
  if (!Array.isArray(answers)) throw new HttpError(400, 'Debes enviar la lista de respuestas')

  const questions = await prisma.question.findMany()
  const byId = new Map(answers.map((a) => [Number(a.questionId), Number(a.value)]))

  const totals = {}
  const counts = {}
  for (const q of questions) {
    const value = byId.get(q.id)
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new HttpError(400, 'Responde todas las preguntas con un valor entre 1 y 5')
    }
    const letter = DIM_TO_LETTER[q.dimension]
    totals[letter] = (totals[letter] || 0) + (value - 1) // 1 = 0 puntos ... 5 = 4 puntos
    counts[letter] = (counts[letter] || 0) + 1
  }

  const weights = {}
  const percents = {}
  for (const letter of LETTERS) {
    const max = (counts[letter] || 0) * 4
    weights[letter] = max ? totals[letter] / max : 0
    percents[letter] = Math.round(weights[letter] * 100)
  }

  const topCode = [...LETTERS]
    .sort((a, b) => weights[b] - weights[a] || LETTERS.indexOf(a) - LETTERS.indexOf(b))
    .slice(0, 3)
    .join('')

  const careers = await prisma.career.findMany({
    select: { id: true, name: true, slug: true, area: true, level: true, riasecCode: true },
  })
  const recommendations = rankCareers(weights, careers, 8).map(({ riasecCode, ...c }) => c)

  if (req.user) {
    await prisma.testResult.create({ data: { userId: req.user.id, scores: percents, topCode } })
  }

  res.json({ scores: percents, topCode, recommendations, saved: Boolean(req.user) })
})

// GET /api/test/results  (sesión iniciada)
export const myResults = asyncHandler(async (req, res) => {
  const results = await prisma.testResult.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  res.json(results)
})
