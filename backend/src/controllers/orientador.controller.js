import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { str } from '../utils/validators.js'
import { LETTERS, normalize, rankCareers } from '../utils/matching.js'

// Palabras clave (sin tildes) que revelan cada tipo de interés
const KEYWORDS = {
  R: ['construir', 'armar', 'reparar', 'maquina', 'herramienta', 'aire libre', 'campo', 'animal', 'mecanic', 'cultivo', 'manual', 'deporte', 'cocin', 'plantas'],
  I: ['matematic', 'numero', 'investig', 'ciencia', 'laboratorio', 'experiment', 'analiz', 'program', 'computador', 'tecnolog', 'biolog', 'quimic', 'fisica', 'problema', 'datos', 'software'],
  A: ['dibuj', 'dise', 'crear', 'creativ', 'arte', 'music', 'escrib', 'pint', 'fotograf', 'video', 'moda', 'actuar', 'cine', 'imagin'],
  S: ['ayudar', 'ensen', 'personas', 'salud', 'cuidar', 'psicolog', 'social', 'escuchar', 'ninos', 'comunidad', 'medic', 'enfermer', 'docente', 'profesor'],
  E: ['negocio', 'emprend', 'lider', 'vender', 'empresa', 'dinero', 'gerenc', 'mercadeo', 'politic', 'abogad', 'persuadir'],
  C: ['organiz', 'orden', 'contab', 'detalle', 'archivo', 'finanza', 'administr', 'planific', 'procedimiento', 'excel'],
}

const LABELS = {
  R: 'práctico y técnico',
  I: 'investigativo y analítico',
  A: 'creativo y artístico',
  S: 'social y de ayuda a otros',
  E: 'emprendedor y de liderazgo',
  C: 'organizado y de detalle',
}

const INTENTS = [
  {
    test: /beca|credito|icetex|pagar|financ|matricula cero|gratis|costo|plata/,
    reply: 'Para pagar tus estudios hay varias opciones: Matrícula Cero en universidades públicas, créditos del ICETEX, becas de cada universidad y la formación gratuita del SENA.',
    links: [{ label: 'Ver opciones de financiación', to: '/financiacion' }],
  },
  {
    test: /sena|tecnico|tecnologo|corto|rapido/,
    reply: 'Si prefieres una formación más corta y práctica, mira los programas técnicos y tecnólogos. El SENA los ofrece gratis por convocatorias.',
    links: [
      { label: 'Ver programas técnicos', to: '/carreras?level=TECNICO' },
      { label: 'Cómo inscribirte', to: '/admisiones' },
    ],
  },
  {
    test: /admision|inscrib|inscripcion|saber 11|icfes|requisito|documento/,
    reply: 'Aquí tienes los pasos para inscribirte a una universidad o al SENA, con fechas importantes.',
    links: [{ label: 'Ver admisiones', to: '/admisiones' }],
  },
  {
    test: /bienestar|ansied|estres|apoyo psicolog|me siento mal|presion/,
    reply: 'Las instituciones suelen tener bienestar universitario con apoyo emocional, económico y académico. Vale la pena preguntar por esos servicios desde antes de matricularte.',
    links: [{ label: 'Ver bienestar', to: '/bienestar' }],
  },
]

const GREETING = /^(hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|ola)\b/

// POST /api/orientador   { message }
export const askAdvisor = asyncHandler(async (req, res) => {
  const message = str(req.body.message, 'message', { min: 2, max: 500 })
  const text = normalize(message)

  const careers = await prisma.career.findMany({
    select: { id: true, name: true, slug: true, area: true, level: true, description: true, riasecCode: true },
  })

  const parts = []
  const links = []
  let suggested = []

  // 1) ¿Menciona una carrera por su nombre? (se prefiere el nombre más largo)
  const named = careers
    .filter((c) => text.includes(normalize(c.name)))
    .sort((a, b) => b.name.length - a.name.length)[0]
  if (named) {
    parts.push(`Sobre ${named.name}: ${named.description} En su ficha puedes ver dónde estudiarla y qué opciones de financiación existen.`)
    suggested = [named]
  }

  // 2) Intenciones: financiación, SENA, admisiones, bienestar
  for (const intent of INTENTS) {
    if (intent.test.test(text)) {
      parts.push(intent.reply)
      links.push(...intent.links)
    }
  }

  // 3) Intereses detectados -> carreras afines
  const weights = {}
  for (const letter of LETTERS) {
    weights[letter] = KEYWORDS[letter].reduce((n, word) => n + (text.includes(word) ? 1 : 0), 0)
  }
  const top = LETTERS.filter((l) => weights[l] > 0).sort((a, b) => weights[b] - weights[a]).slice(0, 2)
  if (top.length > 0 && !named) {
    parts.push(`Por lo que me cuentas, tus intereses apuntan a lo ${top.map((l) => LABELS[l]).join(' y lo ')}. Estas carreras podrían encajar contigo:`)
    suggested = rankCareers(weights, careers, 5)
  }

  // 4) Saludo o mensaje sin pistas
  if (parts.length === 0) {
    if (GREETING.test(text)) {
      parts.push('¡Hola! Cuéntame qué te gusta hacer, en qué eres bueno o qué te imaginas haciendo, y te sugiero carreras.')
    } else {
      parts.push('Cuéntame un poco más: qué te gusta hacer, en qué eres bueno o qué te imaginas haciendo. Por ejemplo: «me gusta dibujar y la tecnología».')
    }
    links.push({ label: 'Hacer el test vocacional', to: '/test-vocacional' })
  } else if (suggested.length === 0 && links.length === 0) {
    links.push({ label: 'Hacer el test vocacional', to: '/test-vocacional' })
  }

  res.json({
    reply: parts.join('\n\n'),
    careers: suggested.slice(0, 5).map((c) => ({
      slug: c.slug, name: c.name, area: c.area, level: c.level, ...(c.match ? { match: c.match } : {}),
    })),
    links,
  })
})
