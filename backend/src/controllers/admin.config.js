import { ENUMS } from '../utils/enums.js'

// Cada recurso del panel: modelo de Prisma + campos permitidos y cómo validarlos.
// type: string | text | url | int | bool | enum
// required: obligatorio al crear · nullable: se guarda como null si llega vacío
export const RESOURCES = {
  categories: {
    model: 'category',
    orderBy: { name: 'asc' },
    slugFrom: 'name',
    include: { _count: { select: { articles: true } } },
    fields: { name: { type: 'string', required: true, max: 60 } },
  },
  careers: {
    model: 'career',
    orderBy: { name: 'asc' },
    slugFrom: 'name',
    include: { _count: { select: { universities: true } } },
    fields: {
      name: { type: 'string', required: true, max: 120 },
      area: { type: 'string', required: true, max: 80 },
      level: { type: 'enum', values: ENUMS.level },
      description: { type: 'text', required: true },
      outlook: { type: 'text', nullable: true },
      durationYears: { type: 'int', required: true, min: 1, max: 12 },
      durationLabel: { type: 'string', nullable: true, max: 120 },
      riasecCode: { type: 'string', required: true, pattern: /^[RIASEC]{3}$/, patternMessage: 'Usa 3 letras entre R, I, A, S, E, C (ej: IRC)' },
    },
  },
  universities: {
    model: 'university',
    orderBy: { name: 'asc' },
    include: { _count: { select: { careers: true } } },
    fields: {
      name: { type: 'string', required: true, max: 160 },
      city: { type: 'string', required: true, max: 120 },
      kind: { type: 'enum', values: ENUMS.kind },
      isPublic: { type: 'bool' },
      website: { type: 'url', nullable: true },
      description: { type: 'text', nullable: true },
    },
  },
  financing: {
    model: 'financing',
    orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    fields: {
      name: { type: 'string', required: true, max: 160 },
      entity: { type: 'string', required: true, max: 160 },
      type: { type: 'enum', values: ENUMS.financingType },
      scope: { type: 'enum', values: ENUMS.financingScope },
      description: { type: 'text', required: true },
      requirements: { type: 'text', nullable: true },
      url: { type: 'url', nullable: true },
      sortOrder: { type: 'int', min: 0, max: 1000 },
    },
  },
  resources: {
    model: 'resource',
    orderBy: [{ category: 'asc' }, { title: 'asc' }],
    fields: {
      title: { type: 'string', required: true, max: 160 },
      type: { type: 'enum', values: ENUMS.resourceType },
      category: { type: 'string', required: true, max: 80 },
      description: { type: 'text', required: true },
      url: { type: 'url', nullable: true },
    },
  },
  wellbeing: {
    model: 'wellbeingService',
    orderBy: [{ category: 'asc' }, { id: 'asc' }],
    fields: {
      title: { type: 'string', required: true, max: 160 },
      category: { type: 'enum', values: ENUMS.wellbeingCategory, required: true },
      description: { type: 'text', required: true },
      url: { type: 'url', nullable: true },
    },
  },
  faqs: {
    model: 'faq',
    orderBy: { sortOrder: 'asc' },
    fields: {
      question: { type: 'string', required: true, max: 300 },
      answer: { type: 'text', required: true },
      category: { type: 'string', required: true, max: 80 },
      sortOrder: { type: 'int', min: 0, max: 1000 },
    },
  },
  'admission-steps': {
    model: 'admissionStep',
    orderBy: [{ track: 'asc' }, { order: 'asc' }],
    fields: {
      track: { type: 'enum', values: ENUMS.track, required: true },
      order: { type: 'int', required: true, min: 1, max: 50 },
      title: { type: 'string', required: true, max: 160 },
      description: { type: 'text', required: true },
      url: { type: 'url', nullable: true },
    },
  },
  'important-dates': {
    model: 'importantDate',
    orderBy: { sortOrder: 'asc' },
    fields: {
      title: { type: 'string', required: true, max: 160 },
      whenLabel: { type: 'string', required: true, max: 160 },
      description: { type: 'text', required: true },
      url: { type: 'url', nullable: true },
      sortOrder: { type: 'int', min: 0, max: 1000 },
    },
  },
}
