// Rutas del catálogo (carreras, instituciones, financiación, admisiones, etc.)

const json = (schema) => ({ 'application/json': { schema } })
const arrayOf = (name) => ({ type: 'array', items: { $ref: `#/components/schemas/${name}` } })
const get = (tag, summary, schema, parameters = [], extra = {}) => ({
  get: {
    tags: [tag],
    summary,
    parameters,
    responses: { 200: { description: 'OK', content: json(schema) }, ...extra },
  },
})
const query = (name, description, schema = { type: 'string' }) => ({ name, in: 'query', description, schema })

export const catalogTags = [
  { name: 'Carreras', description: 'Catálogo de programas (profesional, técnico y tecnólogo)' },
  { name: 'Instituciones' },
  { name: 'Financiación' },
  { name: 'Admisiones' },
  { name: 'Biblioteca' },
  { name: 'Bienestar' },
  { name: 'Preguntas frecuentes' },
]

export const catalogSchemas = {
  CareerSummary: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, name: { type: 'string' }, slug: { type: 'string' },
      area: { type: 'string', example: 'Ingeniería y tecnología' },
      level: { type: 'string', enum: ['AUXILIAR', 'OPERARIO', 'TECNICO', 'TECNOLOGO', 'PROFUNDIZACION', 'PROFESIONAL'] },
      description: { type: 'string' }, durationLabel: { type: 'string', nullable: true },
      riasecCode: { type: 'string', example: 'IRC' },
      vigentes: { type: 'integer', description: 'Instituciones con oferta vigente' },
    },
  },
  CareerDetail: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, name: { type: 'string' }, slug: { type: 'string' }, area: { type: 'string' },
      level: { type: 'string' }, description: { type: 'string' }, outlook: { type: 'string', nullable: true },
      durationLabel: { type: 'string', nullable: true }, riasecCode: { type: 'string' },
      offerings: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            modality: { type: 'string', enum: ['PRESENCIAL', 'VIRTUAL', 'HIBRIDA'] },
            offerStatus: { type: 'string', enum: ['VIGENTE', 'POR_CONFIRMAR', 'NO_VIGENTE'] },
            verifiedAt: { type: 'string', format: 'date-time', nullable: true },
            programUrl: { type: 'string', nullable: true },
            university: { $ref: '#/components/schemas/University' },
          },
        },
      },
    },
  },
  AreaCount: { type: 'object', properties: { area: { type: 'string' }, count: { type: 'integer' } } },
  University: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, name: { type: 'string' }, city: { type: 'string' },
      isPublic: { type: 'boolean' },
      kind: { type: 'string', enum: ['UNIVERSIDAD', 'INSTITUCION_UNIVERSITARIA', 'TECNOLOGICA_TECNICA', 'SENA'] },
      website: { type: 'string', nullable: true }, description: { type: 'string', nullable: true },
    },
  },
  Financing: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, name: { type: 'string' }, entity: { type: 'string' }, description: { type: 'string' },
      requirements: { type: 'string', nullable: true }, url: { type: 'string', nullable: true },
      type: { type: 'string', enum: ['BECA', 'CREDITO', 'GRATUIDAD', 'SUBSIDIO'] },
      scope: { type: 'string', enum: ['TODAS', 'PUBLICA', 'PRIVADA'] },
    },
  },
  AdmissionStep: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, track: { type: 'string', enum: ['UNIVERSIDAD', 'SENA'] }, order: { type: 'integer' },
      title: { type: 'string' }, description: { type: 'string' }, url: { type: 'string', nullable: true },
    },
  },
  ImportantDate: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, title: { type: 'string' }, whenLabel: { type: 'string' },
      description: { type: 'string' }, url: { type: 'string', nullable: true },
    },
  },
  Admission: {
    type: 'object',
    properties: { steps: arrayOf('AdmissionStep'), dates: arrayOf('ImportantDate') },
  },
  Resource: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, title: { type: 'string' }, description: { type: 'string' },
      url: { type: 'string', nullable: true }, category: { type: 'string' },
      type: { type: 'string', enum: ['GUIA', 'ENLACE', 'HERRAMIENTA', 'VIDEO'] },
    },
  },
  WellbeingService: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, title: { type: 'string' }, description: { type: 'string' },
      category: { type: 'string', enum: ['SALUD', 'APOYO_ECONOMICO', 'ACADEMICO', 'DEPORTE_CULTURA', 'INCLUSION'] },
    },
  },
  Faq: {
    type: 'object',
    properties: { id: { type: 'integer' }, question: { type: 'string' }, answer: { type: 'string' }, category: { type: 'string' } },
  },
}

export const catalogPaths = {
  '/careers': get('Carreras', 'Listar carreras y programas (con filtros)', arrayOf('CareerSummary'), [
    query('q', 'Busca en nombre y descripción'),
    query('area', 'Área, ej: Ciencias de la salud'),
    query('level', 'Nivel de formación', { type: 'string', enum: ['AUXILIAR', 'OPERARIO', 'TECNICO', 'TECNOLOGO', 'PROFUNDIZACION', 'PROFESIONAL'] }),
  ], { 400: { description: 'Nivel inválido' } }),
  '/careers/areas': get('Carreras', 'Áreas disponibles con su cantidad de programas', arrayOf('AreaCount')),
  '/careers/{slug}': get('Carreras', 'Detalle de una carrera y dónde estudiarla', { $ref: '#/components/schemas/CareerDetail' }, [
    { name: 'slug', in: 'path', required: true, schema: { type: 'string' }, description: 'Ej: medicina' },
  ], { 404: { description: 'No encontrada' } }),
  '/universities': get('Instituciones', 'Listar instituciones', arrayOf('University'), [
    query('q', 'Busca por nombre'),
    query('sector', 'Públicas o privadas', { type: 'string', enum: ['public', 'private'] }),
    query('kind', 'Tipo de institución', { type: 'string', enum: ['UNIVERSIDAD', 'INSTITUCION_UNIVERSITARIA', 'TECNOLOGICA_TECNICA', 'SENA'] }),
  ]),
  '/financing': get('Financiación', 'Becas, créditos, gratuidad y subsidios', arrayOf('Financing'), [
    query('type', 'Tipo', { type: 'string', enum: ['BECA', 'CREDITO', 'GRATUIDAD', 'SUBSIDIO'] }),
    query('scope', 'A quién aplica', { type: 'string', enum: ['TODAS', 'PUBLICA', 'PRIVADA'] }),
  ]),
  '/admission': get('Admisiones', 'Pasos de inscripción (universidad y SENA) y fechas importantes', { $ref: '#/components/schemas/Admission' }),
  '/resources': get('Biblioteca', 'Guías, enlaces y herramientas', arrayOf('Resource'), [
    query('type', 'Tipo de recurso', { type: 'string', enum: ['GUIA', 'ENLACE', 'HERRAMIENTA', 'VIDEO'] }),
  ]),
  '/wellbeing': get('Bienestar', 'Servicios de apoyo y bienestar', arrayOf('WellbeingService')),
  '/faqs': get('Preguntas frecuentes', 'Preguntas frecuentes', arrayOf('Faq')),
}
