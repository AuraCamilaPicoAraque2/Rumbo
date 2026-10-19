import { useEffect, useState } from 'react'

// Ejecuta una petición y devuelve { data, status: 'loading' | 'ok' | 'error', error }
export default function useFetch(fn, deps = []) {
  const [state, setState] = useState({ data: null, status: 'loading', error: null })

  useEffect(() => {
    let active = true
    setState((s) => ({ ...s, status: 'loading' }))
    fn()
      .then((data) => active && setState({ data, status: 'ok', error: null }))
      .catch((error) => active && setState({ data: null, status: 'error', error }))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
