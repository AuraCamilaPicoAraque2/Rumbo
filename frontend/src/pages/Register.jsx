import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { errorMessage } from '../services/api.js'

export default function Register() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await register(form.name, form.email, form.password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(errorMessage(err, t('auth.errorRegister')))
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <h1>{t('auth.registerTitle')}</h1>
      <form onSubmit={onSubmit} className="form">
        <label htmlFor="name">{t('auth.name')}</label>
        <input id="name" name="name" type="text" className="field" value={form.name} onChange={onChange} autoComplete="name" required minLength={2} />

        <label htmlFor="email">{t('auth.email')}</label>
        <input id="email" name="email" type="email" className="field" value={form.email} onChange={onChange} autoComplete="email" required />

        <label htmlFor="password">{t('auth.password')}</label>
        <input id="password" name="password" type="password" className="field" value={form.password} onChange={onChange} autoComplete="new-password" required minLength={8} aria-describedby="pw-hint" />
        <small id="pw-hint" className="muted">{t('auth.passwordHint')}</small>

        {error && <p className="alert" role="alert">{error}</p>}
        <button type="submit" className="btn btn--primary btn--lg" disabled={busy}>
          {busy ? t('auth.sending') : t('auth.submitRegister')}
        </button>
      </form>
      <p className="auth__alt">
        {t('auth.haveAccount')} <Link to="/login" className="link">{t('nav.login')}</Link>
      </p>
    </div>
  )
}
