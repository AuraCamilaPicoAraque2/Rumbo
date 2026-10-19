import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')))

  // Si hay un token guardado, comprueba que siga siendo válido
  useEffect(() => {
    if (!localStorage.getItem('token')) return
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  async function register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password })
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
