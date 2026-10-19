import { createContext, useContext, useState } from 'react'
import i18n from '../i18n.js'
import { askAdvisor } from '../services/features.js'

const AdvisorContext = createContext(null)

export function AdvisorProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [busy, setBusy] = useState(false)

  // Envía una pregunta al orientador y abre el chat
  async function ask(text) {
    const message = text.trim()
    if (!message || busy) return
    setOpen(true)
    setMessages((m) => [...m, { from: 'user', text: message }])
    setBusy(true)
    try {
      const data = await askAdvisor(message)
      setMessages((m) => [...m, { from: 'bot', text: data.reply, careers: data.careers, links: data.links }])
    } catch {
      setMessages((m) => [...m, { from: 'bot', text: i18n.t('advisor.error') }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <AdvisorContext.Provider value={{ open, setOpen, messages, busy, ask }}>
      {children}
    </AdvisorContext.Provider>
  )
}

export const useAdvisor = () => useContext(AdvisorContext)
