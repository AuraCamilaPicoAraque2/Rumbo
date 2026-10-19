import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import { config } from './config/env.js'
import { openapiSpec } from './docs/index.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middlewares/errorHandler.js'

const app = express()

// Documentación Swagger (antes de helmet para que no bloquee los scripts de Swagger UI)
app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(openapiSpec, { customSiteTitle: 'API Campus Virtual' })
)
app.get('/api/docs.json', (req, res) => res.json(openapiSpec))

app.use(helmet())
app.use(cors({ origin: config.clientUrl }))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
