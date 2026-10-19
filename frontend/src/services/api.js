import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
})

// Adjunta el token (si existe) en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Mensaje de error que envía el backend, o uno por defecto
export function errorMessage(err, fallback) {
  return err?.response?.data?.message || fallback
}

export default api
