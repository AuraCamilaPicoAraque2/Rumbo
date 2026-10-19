// Cambia la contraseña del administrador.
// Uso (dentro de la carpeta backend):  node scripts/set-admin-password.js "MiNuevaClave123"
import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const password = process.argv[2]
if (!password || password.length < 8) {
  console.error('Escribe una contraseña de al menos 8 caracteres entre comillas.')
  process.exit(1)
}

const prisma = new PrismaClient()
try {
  const passwordHash = await bcrypt.hash(password, 10)
  const result = await prisma.user.updateMany({ where: { role: 'ADMIN' }, data: { passwordHash } })
  console.log(`✅ Contraseña actualizada para ${result.count} administrador(es).`)
} finally {
  await prisma.$disconnect()
}
