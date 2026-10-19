import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma.js'
import { config } from '../config/env.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { HttpError } from '../utils/httpError.js'
import { str } from '../utils/validators.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  })
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

// POST /api/auth/register  -> siempre crea un ESTUDIANTE
export const register = asyncHandler(async (req, res) => {
  const name = str(req.body.name, 'name', { min: 2, max: 80 })
  const email = str(req.body.email, 'email', { max: 120 }).toLowerCase()
  const password = str(req.body.password, 'password', { min: 8, max: 100 })

  if (!EMAIL_REGEX.test(email)) throw new HttpError(400, 'El correo no tiene un formato válido')

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) throw new HttpError(409, 'Ya existe una cuenta con ese correo')

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({ data: { name, email, passwordHash } })

  res.status(201).json({ user: publicUser(user), token: signToken(user) })
})

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const email = str(req.body.email, 'email').toLowerCase()
  const password = str(req.body.password, 'password')

  const user = await prisma.user.findUnique({ where: { email } })
  const valid = user && (await bcrypt.compare(password, user.passwordHash))
  // Mensaje genérico para no revelar si el correo existe
  if (!valid) throw new HttpError(401, 'Correo o contraseña incorrectos')

  res.json({ user: publicUser(user), token: signToken(user) })
})

// GET /api/auth/me
export const me = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } })
  if (!user) throw new HttpError(401, 'La cuenta ya no existe')
  res.json({ user: publicUser(user) })
})
