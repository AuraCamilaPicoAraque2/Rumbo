import { useEffect, useState } from 'react'
import api, { errorMessage } from '../services/api.js'

// Valores iniciales del formulario (vacío para "nuevo", o los datos del elemento a editar)
function initialValues(fields, initial) {
  const values = {}
  for (const f of fields) {
    if (f.type === 'checkbox') {
      values[f.name] = initial ? Boolean(initial[f.name]) : Boolean(f.default)
      continue
    }
    let v = initial ? (f.initial ? f.initial(initial) : initial[f.name]) : f.default
    if (v === undefined || v === null) v = ''
    values[f.name] = typeof v === 'number' ? String(v) : v
  }
  return values
}

export default function ResourceForm({ config, initial, onSaved, onCancel }) {
  const [values, setValues] = useState(() => initialValues(config.fields, initial))
  const [remote, setRemote] = useState({}) // opciones cargadas desde la API
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  // Carga las opciones de los selects que dependen de la API (ej. categorías)
  useEffect(() => {
    config.fields
      .filter((f) => f.optionsFrom)
      .forEach((f) => {
        api
          .get(f.optionsFrom.url)
          .then((r) => setRemote((o) => ({ ...o, [f.name]: r.data.map((it) => [it[f.optionsFrom.value], it[f.optionsFrom.label]]) })))
          .catch(() => {})
      })
  }, [config])

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const body = {}
      for (const f of config.fields) {
        const v = values[f.name]
        body[f.name] = (f.type === 'number' || f.number) && v !== '' ? Number(v) : v
      }
      if (initial?.id) await api.put(`${config.api}/${initial.id}`, body)
      else await api.post(config.api, body)
      onSaved()
    } catch (err) {
      setError(errorMessage(err, 'No se pudo guardar'))
      setBusy(false)
    }
  }

  return (
    <form className="form-grid" onSubmit={onSubmit}>
      {config.fields.map((f) => {
        const id = `f-${f.name}`
        if (f.type === 'checkbox') {
          return (
            <label key={f.name} className="check">
              <input type="checkbox" checked={values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
              {f.label}
            </label>
          )
        }
        return (
          <div key={f.name} className="form-grid__field">
            <label htmlFor={id}>{f.label}{f.required ? ' *' : ''}</label>
            {f.type === 'textarea' && (
              <textarea id={id} className="field" rows={f.rows || 4} value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
            )}
            {f.type === 'select' && (
              <select id={id} className="field" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)}>
                {!f.required && <option value="">—</option>}
                {f.required && values[f.name] === '' && <option value="">Elige una opción</option>}
                {(f.options || remote[f.name] || []).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            )}
            {(f.type === 'text' || f.type === 'url' || f.type === 'number') && (
              <input
                id={id}
                className="field"
                type={f.type === 'number' ? 'number' : f.type === 'url' ? 'url' : 'text'}
                min={f.min}
                value={values[f.name]}
                onChange={(e) => set(f.name, e.target.value)}
              />
            )}
            {f.hint && <small className="muted">{f.hint}</small>}
          </div>
        )
      })}

      {error && <p className="alert" role="alert">{error}</p>}
      <div className="form-actions">
        <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}
