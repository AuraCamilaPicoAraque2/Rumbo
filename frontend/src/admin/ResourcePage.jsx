import { useParams } from 'react-router-dom'
import { ADMIN_RESOURCES } from './resources.js'
import ResourceManager from './ResourceManager.jsx'

export default function ResourcePage() {
  const { resource } = useParams()
  const config = ADMIN_RESOURCES.find((r) => r.key === resource)
  if (!config) return <p className="state">Esta sección no existe.</p>
  // key: reinicia el estado al cambiar de sección
  return <ResourceManager key={config.key} config={config} />
}
