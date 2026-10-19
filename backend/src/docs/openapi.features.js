// Documentación del test vocacional, el orientador y el panel de administración
import { RESOURCES } from '../controllers/admin.config.js'

const json = (schema) => ({ 'application/json': { schema } })
const secured = [{ bearerAuth: [] }]
const err = (description) => ({ description, content: json({ $ref: '#/components/schemas/Error' }) })

export const featureTags = [
  { name: 'Test vocacional' },
  { name: 'Orientador' },
  { name: 'Administración', description: 'Solo rol ADMIN. Usa el botón Authorize con el token de un administrador.' },
]

export const featureSchemas = {
  TestAnswer: { type: 'object', required: ['questionId', 'value'], properties: { questionId: { type: 'integer' }, value: { type: 'integer', minimum: 1, maximum: 5 } } },
  TestResult: {
    type: 'object',
    properties: {
      scores: { type: 'object', example: { R: 40, I: 85, A: 60, S: 30, E: 45, C: 70 } },
      topCode: { type: 'string', example: 'ICA' },
      saved: { type: 'boolean' },
      recommendations: { type: 'array', items: { type: 'object', properties: { name: { type: 'string' }, slug: { type: 'string' }, area: { type: 'string' }, level: { type: 'string' }, match: { type: 'integer' } } } },
    },
  },
  AdvisorReply: {
    type: 'object',
    properties: {
      reply: { type: 'string' },
      careers: { type: 'array', items: { type: 'object', properties: { slug: { type: 'string' }, name: { type: 'string' }, area: { type: 'string' }, level: { type: 'string' }, match: { type: 'integer' } } } },
      links: { type: 'array', items: { type: 'object', properties: { label: { type: 'string' }, to: { type: 'string' } } } },
    },
  },
  AdminStats: { type: 'object', additionalProperties: { type: 'integer' } },
  OfferingInput: {
    type: 'object',
    required: ['careerId', 'universityId'],
    properties: {
      careerId: { type: 'integer' }, universityId: { type: 'integer' },
      modality: { type: 'string', enum: ['PRESENCIAL', 'VIRTUAL', 'HIBRIDA'] },
      offerStatus: { type: 'string', enum: ['VIGENTE', 'POR_CONFIRMAR', 'NO_VIGENTE'] },
      programUrl: { type: 'string', nullable: true },
      verified: { type: 'boolean', description: 'true = marca la fecha de verificación de hoy' },
    },
  },
}

const adminPaths = {}
for (const key of Object.keys(RESOURCES)) {
  const fieldNames = Object.keys(RESOURCES[key].fields).join(', ')
  const body = { required: true, content: json({ type: 'object', description: `Campos: ${fieldNames}`, additionalProperties: true }) }
  const idParam = [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }]
  adminPaths[`/admin/${key}`] = {
    get: { tags: ['Administración'], summary: `Listar (${key})`, security: secured, responses: { 200: { description: 'OK' }, 403: err('No eres administrador') } },
    post: { tags: ['Administración'], summary: `Crear (${key})`, security: secured, requestBody: body, responses: { 201: { description: 'Creado' }, 400: err('Datos inválidos') } },
  }
  adminPaths[`/admin/${key}/{id}`] = {
    put: { tags: ['Administración'], summary: `Editar (${key})`, security: secured, parameters: idParam, requestBody: body, responses: { 200: { description: 'Actualizado' }, 404: err('No encontrado') } },
    delete: { tags: ['Administración'], summary: `Eliminar (${key})`, security: secured, parameters: idParam, responses: { 204: { description: 'Eliminado' }, 409: err('Tiene elementos relacionados') } },
  }
}

export const featurePaths = {
  '/test/questions': { get: { tags: ['Test vocacional'], summary: 'Preguntas del test (intercaladas)', responses: { 200: { description: 'OK' } } } },
  '/test/submit': {
    post: {
      tags: ['Test vocacional'],
      summary: 'Enviar respuestas (1 a 5) y obtener perfil y carreras afines',
      description: 'Si envías un token de sesión, el resultado se guarda en tu cuenta.',
      requestBody: { required: true, content: json({ type: 'object', properties: { answers: { type: 'array', items: { $ref: '#/components/schemas/TestAnswer' } } } }) },
      responses: { 200: { description: 'Resultado', content: json({ $ref: '#/components/schemas/TestResult' }) }, 400: err('Faltan respuestas') },
    },
  },
  '/test/results': { get: { tags: ['Test vocacional'], summary: 'Mis últimos resultados', security: secured, responses: { 200: { description: 'OK' }, 401: err('Sin sesión') } } },
  '/orientador': {
    post: {
      tags: ['Orientador'],
      summary: 'Preguntarle al orientador (reglas, sin IA)',
      requestBody: { required: true, content: json({ type: 'object', required: ['message'], properties: { message: { type: 'string', example: 'me gusta dibujar y la tecnología' } } }) },
      responses: { 200: { description: 'Respuesta', content: json({ $ref: '#/components/schemas/AdvisorReply' }) }, 400: err('Mensaje inválido') },
    },
  },
  '/admin/stats': { get: { tags: ['Administración'], summary: 'Totales del sitio', security: secured, responses: { 200: { description: 'OK', content: json({ $ref: '#/components/schemas/AdminStats' }) } } } },
  '/admin/offerings': {
    post: { tags: ['Administración'], summary: 'Crear o actualizar la oferta de una carrera en una institución', security: secured, requestBody: { required: true, content: json({ $ref: '#/components/schemas/OfferingInput' }) }, responses: { 200: { description: 'OK' } } },
  },
  '/admin/offerings/{careerId}/{universityId}': {
    delete: {
      tags: ['Administración'], summary: 'Quitar una oferta', security: secured,
      parameters: [
        { name: 'careerId', in: 'path', required: true, schema: { type: 'integer' } },
        { name: 'universityId', in: 'path', required: true, schema: { type: 'integer' } },
      ],
      responses: { 204: { description: 'Eliminada' } },
    },
  },
  ...adminPaths,
}
