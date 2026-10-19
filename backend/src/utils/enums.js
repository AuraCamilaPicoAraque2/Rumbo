// Valores permitidos (coinciden con los enums de schema.prisma)
export const ENUMS = {
  level: ['AUXILIAR', 'OPERARIO', 'TECNICO', 'TECNOLOGO', 'PROFUNDIZACION', 'PROFESIONAL'],
  modality: ['PRESENCIAL', 'VIRTUAL', 'HIBRIDA'],
  kind: ['UNIVERSIDAD', 'INSTITUCION_UNIVERSITARIA', 'TECNOLOGICA_TECNICA', 'SENA'],
  offerStatus: ['VIGENTE', 'POR_CONFIRMAR', 'NO_VIGENTE'],
  financingType: ['BECA', 'CREDITO', 'GRATUIDAD', 'SUBSIDIO'],
  financingScope: ['TODAS', 'PUBLICA', 'PRIVADA'],
  resourceType: ['GUIA', 'ENLACE', 'HERRAMIENTA', 'VIDEO'],
  wellbeingCategory: ['SALUD', 'APOYO_ECONOMICO', 'ACADEMICO', 'DEPORTE_CULTURA', 'INCLUSION'],
  track: ['UNIVERSIDAD', 'SENA'],
}
