import { prisma } from '../config/prisma.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'
import { slugify } from '../utils/slugify.js'
import { str, positiveInt } from '../utils/validators.js'

// Convierte un valor del cuerpo de la petición según la especificación del campo.
// Devuelve undefined para "no tocar este campo".
function parseField(name, spec, value) {
  const empty = value === undefined || value === null || value === ''
  if (empty) {
    if (spec.required) throw new HttpError(400, `El campo "${name}" es obligatorio`)
    return spec.nullable ? null : undefined
  }
  switch (spec.type) {
    case 'string': {
      const v = str(value, name, { min: 1, max: spec.max ?? 255 })
      if (spec.pattern && !spec.pattern.test(v)) {
        throw new HttpError(400, spec.patternMessage || `El campo "${name}" tiene un formato inválido`)
      }
      return v
    }
    case 'text':
      return str(value, name, { min: 1, max: spec.max ?? 20000 })
    case 'url': {
      const v = str(value, name, { max: 500 })
      if (!/^https?:\/\//i.test(v)) throw new HttpError(400, `El campo "${name}" debe empezar por http:// o https://`)
      return v
    }
    case 'int': {
      const n = Number(value)
      const min = spec.min ?? 0
      const max = spec.max ?? 100000
      if (!Number.isInteger(n) || n < min || n > max) {
        throw new HttpError(400, `El campo "${name}" debe ser un número entero entre ${min} y ${max}`)
      }
      return n
    }
    case 'bool':
      return value === true || value === 'true'
    case 'enum':
      if (!spec.values.includes(value)) {
        throw new HttpError(400, `El campo "${name}" debe ser uno de: ${spec.values.join(', ')}`)
      }
      return value
    default:
      throw new HttpError(500, `Tipo de campo desconocido: ${spec.type}`)
  }
}

function buildData(fields, body, partial) {
  const data = {}
  for (const [name, spec] of Object.entries(fields)) {
    if (partial && body[name] === undefined) continue
    const value = parseField(name, spec, body[name])
    if (value !== undefined) data[name] = value
  }
  return data
}

async function uniqueSlug(delegate, text) {
  const base = slugify(text) || 'item'
  let slug = base
  let n = 1
  while (await delegate.findUnique({ where: { slug } })) {
    n += 1
    slug = `${base}-${n}`
  }
  return slug
}

// Crea los 4 controladores (listar, crear, editar, eliminar) de un recurso
export function makeCrud({ model, fields, orderBy, slugFrom, include }) {
  const delegate = prisma[model]
  return {
    list: asyncHandler(async (req, res) => {
      res.json(await delegate.findMany({ orderBy, ...(include ? { include } : {}) }))
    }),
    create: asyncHandler(async (req, res) => {
      const data = buildData(fields, req.body, false)
      if (slugFrom) data.slug = await uniqueSlug(delegate, data[slugFrom])
      res.status(201).json(await delegate.create({ data }))
    }),
    update: asyncHandler(async (req, res) => {
      const id = positiveInt(req.params.id, 'id')
      const data = buildData(fields, req.body, true)
      res.json(await delegate.update({ where: { id }, data })) // P2025 -> 404 (errorHandler)
    }),
    remove: asyncHandler(async (req, res) => {
      const id = positiveInt(req.params.id, 'id')
      try {
        await delegate.delete({ where: { id } })
      } catch (err) {
        if (err.code === 'P2003') {
          throw new HttpError(409, 'No se puede eliminar: tiene elementos relacionados (ej. artículos de esa categoría)')
        }
        throw err
      }
      res.status(204).end()
    }),
  }
}
