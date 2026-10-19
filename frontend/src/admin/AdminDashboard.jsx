import { Link } from 'react-router-dom'
import api from '../services/api.js'
import useFetch from '../utils/useFetch.js'
import DataState from '../components/DataState.jsx'

const CARDS = [
  ['articles', 'Artículos publicados', '/admin/articulos'],
  ['drafts', 'Borradores', '/admin/articulos'],
  ['comments', 'Comentarios', null],
  ['careers', 'Carreras y programas', '/admin/carreras'],
  ['universities', 'Instituciones', '/admin/instituciones'],
  ['financing', 'Opciones de financiación', '/admin/financiacion'],
  ['resources', 'Recursos de biblioteca', '/admin/biblioteca'],
  ['users', 'Usuarios registrados', null],
  ['tests', 'Tests realizados', null],
]

export default function AdminDashboard() {
  const stats = useFetch(() => api.get('/admin/stats').then((r) => r.data), [])

  return (
    <>
      <h1 className="page-title">Resumen</h1>
      <p className="lead">Elige una sección del menú para crear, editar o eliminar contenido. Los cambios se ven al instante en el sitio.</p>
      <DataState status={stats.status}>
        {stats.data && (
          <div className="stats">
            {CARDS.map(([key, label, to], i) => {
              const body = (
                <>
                  <span className="stat__n">{stats.data[key]}</span>
                  <span className="muted">{label}</span>
                </>
              )
              return to ? (
                <Link key={key} to={to} className="stat" style={{ '--cat': `var(--p${(i % 6) + 1})` }}>{body}</Link>
              ) : (
                <div key={key} className="stat" style={{ '--cat': `var(--p${(i % 6) + 1})` }}>{body}</div>
              )
            })}
          </div>
        )}
      </DataState>
    </>
  )
}
