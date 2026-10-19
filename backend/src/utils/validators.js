import { HttpError } from './httpError.js'

// Valida que un valor sea texto con longitud mínima y máxima; devuelve el texto limpio
export function str(value, field, { min = 1, max = 5000 } = {}) {
  if (typeof value !== 'string' || value.trim().length < min) {
    throw new HttpError(400, `El campo "${field}" es obligatorio (mínimo ${min} caracteres)`)
  }
  if (value.trim().length > max) {
    throw new HttpError(400, `El campo "${field}" no puede superar ${max} caracteres`)
  }
  return value.trim()
}

// Valida que un valor sea un entero positivo (IDs)
export function positiveInt(value, field) {
  const n = Number(value)
  if (!Number.isInteger(n) || n < 1) {
    throw new HttpError(400, `El campo "${field}" debe ser un número entero válido`)
  }
  return n
}
