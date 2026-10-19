import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { HttpError } from '../utils/httpError.js'

function readToken(req) {
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ')
  return type === 'Bearer' && token ? token : null
}

// Exige sesión iniciada
export function authenticate(req, res, next) {
  const token = readToken(req)
  if (!token) return next(new HttpError(401, 'Debes iniciar sesión'))
  try {
    const payload = jwt.verify(token, config.jwtSecret)
    req.user = { id: payload.id, role: payload.role }
    next()
  } catch {
    next(new HttpError(401, 'Sesión inválida o expirada'))
  }
}

// Si hay token válido carga req.user; si no, sigue como visitante
export function optionalAuth(req, res, next) {
  const token = readToken(req)
  if (token) {
    try {
      const payload = jwt.verify(token, config.jwtSecret)
      req.user = { id: payload.id, role: payload.role }
    } catch {
      // token inválido: se trata como visitante
    }
  }
  next()
}

// Restringe por rol: requireRole('ADMIN')
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new HttpError(403, 'No tienes permisos para esta acción'))
    }
    next()
  }
