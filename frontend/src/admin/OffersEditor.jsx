import { useCallback, useEffect, useState } from 'react'
import api, { errorMessage } from '../services/api.js'
import { formatDate } from '../utils/format.js'

const STATUS = [['VIGENTE', 'Vigente'], ['POR_CONFIRMAR', 'Por confirmar'], ['NO_VIGENTE', 'No vigente']]
const MODALITY = [['PRESENCIAL', 'Presencial'], ['VIRTUAL', 'Virtual'], ['HIBRIDA', 'Híbrida']]

// Administra en qué instituciones se ofrece una carrera (y si la oferta está vigente)
export default function OffersEditor({ career }) {
  const [offerings, setOfferings] = useState([])
  const [unis, setUnis] = useState([])
  const [form, setForm] = useState({ universityId: '', modality: 'PRESENCIAL', offerStatus: 'VIGENTE', programUrl: '' })
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    const [c, u] = await Promise.all([api.get(`/careers/${career.slug}`), api.get('/admin/universities')])
    setOfferings(c.data.offerings)
    setUnis(u.data)
  }, [career.slug])

  useEffect(() => {
    load().catch(() => setError('No se pudieron cargar las ofertas'))
  }, [load])

  async function save(universityId, patch) {
    setError('')
    try {
      await api.post('/admin/offerings', { careerId: career.id, universityId, ...patch })
      await load()
    } catch (err) {
      setError(errorMessage(err, 'No se pudo guardar la oferta'))
    }
  }

  async function remove(universityId, name) {
    if (!window.confirm(`¿Quitar la oferta de ${name}?`)) return
    try {
      await api.delete(`/admin/offerings/${career.id}/${universityId}`)
      await load()
    } catch (err) {
      setError(errorMessage(err, 'No se pudo quitar'))
    }
  }

  const used = new Set(offerings.map((o) => o.university.id))
  const available = unis.filter((u) => !used.has(u.id))

  return (
    <section className="offers-editor">
      <h2>¿Dónde se estudia? (ofertas)</h2>
      <p className="muted">Cada cambio se guarda al instante. “Verificar hoy” registra la fecha de verificación.</p>
      {error && <p className="alert" role="alert">{error}</p>}

      <ul className="admin-list">
        {offerings.map((o) => (
          <li key={o.university.id} className="admin-item">
            <div className="admin-item__text">
              <strong>{o.university.name}</strong>
              <span className="muted">
                {o.verifiedAt ? `Verificado el ${formatDate(o.verifiedAt, 'es')}` : 'Sin fecha de verificación'}
              </span>
            </div>
            <div className="admin-item__actions">
              <select className="field field--inline" value={o.offerStatus} onChange={(e) => save(o.university.id, { offerStatus: e.target.value })} aria-label="Estado de la oferta">
                {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <select className="field field--inline" value={o.modality} onChange={(e) => save(o.university.id, { modality: e.target.value })} aria-label="Modalidad">
                {MODALITY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <button type="button" className="btn btn--ghost btn--sm" onClick={() => save(o.university.id, { verified: true })}>Verificar hoy</button>
              <button type="button" className="btn btn--ghost btn--sm btn--danger" onClick={() => remove(o.university.id, o.university.name)}>Quitar</button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="block">Agregar institución</h3>
      <div className="admin-item__actions admin-item__actions--wrap">
        <select className="field field--inline" value={form.universityId} onChange={(e) => setForm({ ...form, universityId: e.target.value })} aria-label="Institución">
          <option value="">Elige una institución</option>
          {available.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select className="field field--inline" value={form.offerStatus} onChange={(e) => setForm({ ...form, offerStatus: e.target.value })} aria-label="Estado">
          {STATUS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="field field--inline" value={form.modality} onChange={(e) => setForm({ ...form, modality: e.target.value })} aria-label="Modalidad">
          {MODALITY.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input className="field field--inline" type="url" placeholder="Enlace del programa (opcional)" value={form.programUrl} onChange={(e) => setForm({ ...form, programUrl: e.target.value })} />
        <button
          type="button"
          className="btn btn--primary btn--sm"
          disabled={!form.universityId}
          onClick={async () => {
            await save(Number(form.universityId), { modality: form.modality, offerStatus: form.offerStatus, programUrl: form.programUrl, verified: true })
            setForm({ ...form, universityId: '', programUrl: '' })
          }}
        >
          Agregar
        </button>
      </div>
    </section>
  )
}
