import api from '../services/api.js'

// Opciones de los menús desplegables [valor, texto]
const LEVEL = [['PROFESIONAL', 'Profesional'], ['TECNOLOGO', 'Tecnólogo'], ['TECNICO', 'Técnico'], ['AUXILIAR', 'Auxiliar'], ['OPERARIO', 'Operario'], ['PROFUNDIZACION', 'Profundización técnica']]
const KIND = [['UNIVERSIDAD', 'Universidad'], ['INSTITUCION_UNIVERSITARIA', 'Institución universitaria'], ['TECNOLOGICA_TECNICA', 'Institución técnica o tecnológica'], ['SENA', 'SENA']]
const FIN_TYPE = [['BECA', 'Beca'], ['CREDITO', 'Crédito'], ['GRATUIDAD', 'Gratuidad'], ['SUBSIDIO', 'Subsidio']]
const FIN_SCOPE = [['TODAS', 'Todas las instituciones'], ['PUBLICA', 'Solo públicas'], ['PRIVADA', 'Solo privadas']]
const RES_TYPE = [['ENLACE', 'Enlace'], ['GUIA', 'Guía'], ['HERRAMIENTA', 'Herramienta'], ['VIDEO', 'Video']]
const WB_CAT = [['SALUD', 'Salud y bienestar emocional'], ['APOYO_ECONOMICO', 'Apoyo económico'], ['ACADEMICO', 'Apoyo académico'], ['DEPORTE_CULTURA', 'Deporte y cultura'], ['INCLUSION', 'Inclusión']]
const TRACK = [['UNIVERSIDAD', 'Universidad'], ['SENA', 'SENA']]

// Cada recurso define: ruta (key), API, cómo se muestra cada fila y los campos del formulario.
// Para agregar otro recurso: añade un objeto aquí (y su equivalente en backend/src/controllers/admin.config.js).
export const ADMIN_RESOURCES = [
  {
    key: 'articulos', title: 'Artículos', singular: 'artículo',
    api: '/articles', listUrl: '/articles', listParams: { drafts: true, limit: 50 }, pick: (d) => d.items,
    loadForEdit: (row) => api.get(`/articles/${row.slug}`).then((r) => r.data),
    label: (r) => r.title,
    sub: (r) => `${r.category?.name || ''} · ${r.published ? 'Publicado' : 'Borrador'}`,
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'excerpt', label: 'Resumen (10 a 300 caracteres)', type: 'textarea', rows: 2, required: true },
      { name: 'content', label: 'Contenido (separa los párrafos con una línea en blanco)', type: 'textarea', rows: 12, required: true },
      { name: 'categoryId', label: 'Categoría', type: 'select', number: true, required: true, optionsFrom: { url: '/categories', value: 'id', label: 'name' }, initial: (r) => r.category?.id },
      { name: 'coverUrl', label: 'Imagen de portada (enlace, opcional)', type: 'url' },
      { name: 'published', label: 'Publicado (visible para todos)', type: 'checkbox', default: false },
    ],
  },
  {
    key: 'categorias', title: 'Categorías del blog', singular: 'categoría', api: '/admin/categories',
    label: (r) => r.name, sub: (r) => `${r._count?.articles ?? 0} artículos`,
    fields: [{ name: 'name', label: 'Nombre', type: 'text', required: true }],
  },
  {
    key: 'carreras', title: 'Carreras y programas', singular: 'carrera', api: '/admin/careers', offerings: true,
    label: (r) => r.name, sub: (r) => `${r.area} · ${r.level} · ${r._count?.universities ?? 0} instituciones`,
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'area', label: 'Área (ej: Ciencias de la salud)', type: 'text', required: true },
      { name: 'level', label: 'Nivel de formación', type: 'select', options: LEVEL, default: 'PROFESIONAL', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', rows: 3, required: true },
      { name: 'outlook', label: '¿En qué se puede trabajar?', type: 'textarea', rows: 3 },
      { name: 'durationYears', label: 'Duración en años (número)', type: 'number', min: 1, required: true },
      { name: 'durationLabel', label: 'Duración en texto (ej: Aprox. 10 semestres)', type: 'text' },
      { name: 'riasecCode', label: 'Código RIASEC de 3 letras (R, I, A, S, E, C). Ej: IRC', type: 'text', required: true, hint: 'Se usa para recomendar la carrera en el test y en el orientador.' },
    ],
  },
  {
    key: 'instituciones', title: 'Instituciones', singular: 'institución', api: '/admin/universities',
    label: (r) => r.name, sub: (r) => `${r.city} · ${r.isPublic ? 'Pública' : 'Privada'} · ${r._count?.careers ?? 0} programas`,
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'city', label: 'Ciudad', type: 'text', required: true },
      { name: 'kind', label: 'Tipo', type: 'select', options: KIND, default: 'UNIVERSIDAD', required: true },
      { name: 'isPublic', label: 'Es pública', type: 'checkbox', default: true },
      { name: 'website', label: 'Sitio web (https://…)', type: 'url' },
      { name: 'description', label: 'Descripción', type: 'textarea', rows: 3 },
    ],
  },
  {
    key: 'financiacion', title: 'Financiación', singular: 'opción de financiación', api: '/admin/financing',
    label: (r) => r.name, sub: (r) => `${r.type} · ${r.entity}`,
    fields: [
      { name: 'name', label: 'Nombre', type: 'text', required: true },
      { name: 'entity', label: 'Entidad', type: 'text', required: true },
      { name: 'type', label: 'Tipo', type: 'select', options: FIN_TYPE, default: 'BECA', required: true },
      { name: 'scope', label: 'A quién aplica', type: 'select', options: FIN_SCOPE, default: 'TODAS', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', rows: 4, required: true },
      { name: 'requirements', label: 'Requisitos y fechas', type: 'textarea', rows: 3 },
      { name: 'url', label: 'Enlace oficial (https://…)', type: 'url' },
      { name: 'sortOrder', label: 'Orden (número menor aparece primero)', type: 'number', min: 0 },
    ],
  },
  {
    key: 'biblioteca', title: 'Biblioteca', singular: 'recurso', api: '/admin/resources',
    label: (r) => r.title, sub: (r) => `${r.type} · ${r.category}`,
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'type', label: 'Tipo', type: 'select', options: RES_TYPE, default: 'ENLACE', required: true },
      { name: 'category', label: 'Categoría (ej: Admisión)', type: 'text', required: true },
      { name: 'description', label: 'Descripción (puedes usar varias líneas)', type: 'textarea', rows: 5, required: true },
      { name: 'url', label: 'Enlace (opcional)', type: 'url' },
    ],
  },
  {
    key: 'bienestar', title: 'Bienestar', singular: 'servicio de bienestar', api: '/admin/wellbeing',
    label: (r) => r.title, sub: (r) => r.category,
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'category', label: 'Categoría', type: 'select', options: WB_CAT, default: 'SALUD', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', rows: 4, required: true },
      { name: 'url', label: 'Enlace (opcional)', type: 'url' },
    ],
  },
  {
    key: 'preguntas', title: 'Preguntas frecuentes', singular: 'pregunta', api: '/admin/faqs',
    label: (r) => r.question, sub: (r) => r.category,
    fields: [
      { name: 'question', label: 'Pregunta', type: 'text', required: true },
      { name: 'answer', label: 'Respuesta', type: 'textarea', rows: 5, required: true },
      { name: 'category', label: 'Categoría', type: 'text', required: true },
      { name: 'sortOrder', label: 'Orden (número menor aparece primero)', type: 'number', min: 0 },
    ],
  },
  {
    key: 'pasos', title: 'Pasos de admisión', singular: 'paso', api: '/admin/admission-steps',
    label: (r) => `${r.order}. ${r.title}`, sub: (r) => r.track,
    fields: [
      { name: 'track', label: 'Ruta', type: 'select', options: TRACK, default: 'UNIVERSIDAD', required: true },
      { name: 'order', label: 'Número de paso', type: 'number', min: 1, required: true },
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', rows: 3, required: true },
      { name: 'url', label: 'Enlace (opcional)', type: 'url' },
    ],
  },
  {
    key: 'fechas', title: 'Fechas importantes', singular: 'fecha', api: '/admin/important-dates',
    label: (r) => r.title, sub: (r) => r.whenLabel,
    fields: [
      { name: 'title', label: 'Título', type: 'text', required: true },
      { name: 'whenLabel', label: 'Cuándo (texto libre, ej: Finales de noviembre)', type: 'text', required: true },
      { name: 'description', label: 'Descripción', type: 'textarea', rows: 3, required: true },
      { name: 'url', label: 'Enlace (opcional)', type: 'url' },
      { name: 'sortOrder', label: 'Orden', type: 'number', min: 0 },
    ],
  },
]
