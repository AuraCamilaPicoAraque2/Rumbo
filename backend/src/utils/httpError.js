// Error con código HTTP para lanzarlo desde controladores
export class HttpError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}
