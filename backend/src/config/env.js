import 'dotenv/config'

export const config = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
}

if (!config.jwtSecret) {
  console.warn('⚠️  Falta JWT_SECRET en el archivo .env')
}
