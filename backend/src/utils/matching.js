// Utilidades del modelo RIASEC (Holland) para el test y el orientador
export const LETTERS = ['R', 'I', 'A', 'S', 'E', 'C']

export const DIM_TO_LETTER = {
  REALISTA: 'R',
  INVESTIGADOR: 'I',
  ARTISTICO: 'A',
  SOCIAL: 'S',
  EMPRENDEDOR: 'E',
  CONVENCIONAL: 'C',
}

// weights: { R: número, I: número, ... } (la escala no importa, se normaliza)
// La primera letra del código de la carrera pesa 3, la segunda 2 y la tercera 1.
export function matchPercent(weights, code) {
  const max = Math.max(...LETTERS.map((l) => weights[l] || 0))
  if (max <= 0) return 0
  const factors = [3, 2, 1]
  const total = String(code)
    .split('')
    .slice(0, 3)
    .reduce((sum, letter, i) => sum + factors[i] * ((weights[letter] || 0) / max), 0)
  return Math.round((total / 6) * 100)
}

export function rankCareers(weights, careers, limit = 8) {
  return careers
    .map((c) => ({ ...c, match: matchPercent(weights, c.riasecCode) }))
    .filter((c) => c.match > 0)
    .sort((a, b) => b.match - a.match || a.name.localeCompare(b.name))
    .slice(0, limit)
}

// Quita tildes y pasa a minúsculas para comparar texto
export function normalize(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}
