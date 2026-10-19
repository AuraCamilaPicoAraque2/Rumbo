import { prisma } from '../config/prisma.js'

// Verifica que el servidor y la base de datos respondan
export async function getHealth(req, res, next) {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', database: 'conectada', time: new Date().toISOString() })
  } catch (error) {
    next(error)
  }
}
