import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../context/AuthContext.jsx'
import { errorMessage } from '../services/api.js'

export default function Login() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(form.email, form.password)
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(errorMessage(err, t('auth.errorLogin')))
      setBusy(false)
    }
  }

  return (
    <div className="auth">
      <h1>{t('auth.loginTitle')}</h1>
      <form onSubmit={onSubmit} className="form">
        <label htmlFor="email">{t('auth.email')}</label>
        <input id="email" name="email" type="email" className="field" value={form.email} onChange={onChange} autoComplete="email" required />

        <label htmlFor="password">{t('auth.password')}</label>
        <input id="password" name="password" type="password" className="field" value={form.password} onChange={onChange} autoComplete="current-password" required />

        {error && <p className="alert" role="alert">{error}</p>}
        <button type="submit" className="btn btn--primary btn--lg" disabled={busy}>
          {busy ? t('auth.sending') : t('auth.submitLogin')}
        </button>
      </form>
      <p className="auth__alt">
        {t('auth.noAccount')} <Link to="/registro" className="link">{t('nav.register')}</Link>
      </p>
    </div>
  )
}
