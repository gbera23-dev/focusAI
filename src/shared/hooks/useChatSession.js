import { useCallback, useRef, useState } from 'react'
import { clearSession as clearGeminiSession, getSessionContext, sendMessage as sendGeminiMessage, setActiveMode } from '../services/geminiService'

const createMessage = (role, content) => ({
  id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  role,
  content,
})

export function useChatSession({ initialMessage, modeLabel }) {
  const mode = modeLabel === 'Learn Mode' ? 'learn' : 'work'
  const [messages, setMessages] = useState(() => {
    const storedMessages = getSessionContext(mode).map(({ role, text }) => ({
      ...createMessage(role === 'model' ? 'assistant' : 'user', text),
      content: text,
    }))

    return storedMessages.length ? storedMessages : [createMessage('assistant', initialMessage)]
  })
  const [isThinking, setIsThinking] = useState(false)
  const requestControllerRef = useRef(null)
  const requestIdRef = useRef(0)

  const sendMessage = useCallback(
    async (content) => {
      const trimmedContent = content.trim()
      if (!trimmedContent || isThinking) return

      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage('user', trimmedContent),
      ])
      setIsThinking(true)
      const requestController = new AbortController()
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId
      requestControllerRef.current = requestController

      try {
        setActiveMode(mode)
        const response = await sendGeminiMessage(trimmedContent, {
          mode,
          signal: requestController.signal,
        })
        setMessages((currentMessages) => [
          ...currentMessages,
          createMessage('assistant', response),
        ])
      } catch (error) {
        if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
          setMessages((currentMessages) => [
            ...currentMessages,
            createMessage('assistant', `I could not complete that request. ${error.message}`),
          ])
        }
      } finally {
        if (requestIdRef.current === requestId) {
          requestControllerRef.current = null
          setIsThinking(false)
        }
      }
    },
    [isThinking, mode],
  )

  const clearSession = useCallback(() => {
    requestIdRef.current += 1
    requestControllerRef.current?.abort()
    requestControllerRef.current = null
    clearGeminiSession(mode)
    setMessages([createMessage('assistant', initialMessage)])
    setIsThinking(false)
  }, [initialMessage, mode])

  return { messages, isThinking, sendMessage, clearSession }
}
