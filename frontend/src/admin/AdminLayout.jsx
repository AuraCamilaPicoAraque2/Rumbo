import { NavLink, Outlet } from 'react-router-dom'
import { ADMIN_RESOURCES } from './resources.js'

export default function AdminLayout() {
  return (
    <div className="admin">
      <aside className="admin__side">
        <h2>Panel</h2>
        <nav aria-label="Secciones del panel">
          <NavLink to="/admin" end>Resumen</NavLink>
          {ADMIN_RESOURCES.map((r) => (
            <NavLink key={r.key} to={`/admin/${r.key}`}>{r.title}</NavLink>
          ))}
        </nav>
      </aside>
      <section className="admin__main">
        <Outlet />
      </section>
    </div>
  )
}
