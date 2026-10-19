import { useCallback, useEffect, useState } from 'react'
import api, { errorMessage } from '../services/api.js'
import ResourceForm from './ResourceForm.jsx'
import OffersEditor from './OffersEditor.jsx'

export default function ResourceManager({ config }) {
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState('loading')
  const [editing, setEditing] = useState(null) // null = lista · 'new' = formulario vacío · objeto = editar
  const [notice, setNotice] = useState('')

  const load = useCallback(async () => {
    setStatus('loading')
    try {
      const { data } = await api.get(config.listUrl || config.api, { params: config.listParams })
      setRows(config.pick ? config.pick(data) : data)
      setStatus('ok')
    } catch {
      setStatus('error')
    }
  }, [config])

  useEffect(() => {
    load()
  }, [load])

  async function startEdit(row) {
    setNotice('')
    if (!config.loadForEdit) return setEditing(row)
    try {
      setEditing(await config.loadForEdit(row))
    } catch (err) {
      setNotice(errorMessage(err, 'No se pudo cargar el elemento'))
    }
  }

  async function remove(row) {
    if (!window.confirm(`¿Eliminar "${config.label(row)}"? Esta acción no se puede deshacer.`)) return
    try {
      await api.delete(`${config.api}/${row.id}`)
      setNotice('Eliminado.')
      load()
    } catch (err) {
      setNotice(errorMessage(err, 'No se pudo eliminar'))
    }
  }

  function saved() {
    setEditing(null)
    setNotice('Guardado.')
    load()
  }

  if (editing) {
    const isNew = editing === 'new'
    return (
      <>
        <h1 className="page-title">{isNew ? `Nuevo: ${config.singular}` : `Editar ${config.singular}`}</h1>
        <ResourceForm config={config} initial={isNew ? null : editing} onSaved={saved} onCancel={() => setEditing(null)} />
        {config.offerings && !isNew && <OffersEditor career={editing} />}
      </>
    )
  }

  return (
    <>
      <div className="admin__toolbar">
        <h1 className="page-title">{config.title}</h1>
        <button type="button" className="btn btn--primary" onClick={() => { setNotice(''); setEditing('new') }}>
          Nuevo
        </button>
      </div>

      {notice && <p className="notice" role="status">{notice}</p>}
      {status === 'loading' && <p className="state">Cargando…</p>}
      {status === 'error' && <p className="state state--error" role="alert">No se pudo cargar la lista. Revisa que el backend esté activo y que hayas iniciado sesión como administrador.</p>}

      {status === 'ok' && rows.length === 0 && <p className="state">Todavía no hay elementos. Pulsa “Nuevo” para crear el primero.</p>}
      {status === 'ok' && rows.length > 0 && (
        <ul className="admin-list">
          {rows.map((row) => (
            <li key={row.id} className="admin-item">
              <div className="admin-item__text">
                <strong>{config.label(row)}</strong>
                <span className="muted">{config.sub(row)}</span>
              </div>
              <div className="admin-item__actions">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => startEdit(row)}>Editar</button>
                <button type="button" className="btn btn--ghost btn--sm btn--danger" onClick={() => remove(row)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
