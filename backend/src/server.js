import app from './app.js'
import { config } from './config/env.js'

app.listen(config.port, () => {
  console.log(`🚀 API lista en http://localhost:${config.port}/api/health`)
})
