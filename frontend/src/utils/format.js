// Fecha larga según el idioma: "17 de octubre de 2026" / "October 17, 2026"
export function formatDate(iso, lang) {
  if (!iso) return ''
  return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(iso)
  )
}

// Cada categoría usa uno de los 6 colores pastel según su id
export function pastelVar(id) {
  return `var(--p${(Number(id) % 6) + 1})`
}

// Cada área de estudio tiene un color estable según su nombre
export function areaColor(area = '') {
  let sum = 0
  for (const ch of area) sum += ch.charCodeAt(0)
  return `var(--p${(sum % 6) + 1})`
}

// Letras RIASEC en el orden del hexágono: R I A S E C -> colores 1 a 6
const RIASEC = ['R', 'I', 'A', 'S', 'E', 'C']
export function riasecColor(letter) {
  const index = RIASEC.indexOf(letter)
  return `var(--p${index === -1 ? 1 : index + 1})`
}
