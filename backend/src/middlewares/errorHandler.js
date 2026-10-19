export function notFound(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` })
}

export function errorHandler(err, req, res, next) {
  // JSON mal formado en el cuerpo de la petición
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'El cuerpo de la petición no es un JSON válido' })
  }
  // Errores conocidos de Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({ message: 'Ya existe un registro con ese valor único' })
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Registro no encontrado' })
  }
  if (err.code === 'P2003') {
    return res.status(400).json({ message: 'Referencia inválida: verifica los IDs enviados' })
  }

  const status = err.status || 500
  if (status === 500) console.error(err)
  res.status(status).json({ message: status === 500 ? 'Error interno del servidor' : err.message })
}
