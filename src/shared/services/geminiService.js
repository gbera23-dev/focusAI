import { generateContent } from '../api/geminiApi'
import { prompts } from '../../resources/prompts'

let activeMode = 'learn'
const SESSION_STORAGE_KEY = 'focusai.session-context.v1'
const DEFAULT_SCRATCHPAD = { code: '', language: 'c' }

const emptyContexts = () => ({ learn: [], work: [], scratchpad: { ...DEFAULT_SCRATCHPAD } })

const readStoredContexts = () => {
  if (typeof window === 'undefined') return emptyContexts()

  try {
    const storedContexts = JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY) ?? '{}')
    return {
      learn: Array.isArray(storedContexts.learn) ? storedContexts.learn : [],
      work: Array.isArray(storedContexts.work) ? storedContexts.work : [],
      scratchpad: {
        code: typeof storedContexts.scratchpad?.code === 'string' ? storedContexts.scratchpad.code : DEFAULT_SCRATCHPAD.code,
        language: typeof storedContexts.scratchpad?.language === 'string' ? storedContexts.scratchpad.language : DEFAULT_SCRATCHPAD.language,
      },
    }
  } catch {
    return emptyContexts()
  }
}

let sessionContexts = readStoredContexts()

const persistContexts = () => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionContexts))
  } catch {
    // Storage can be unavailable or full; the in-memory context remains usable.
  }
}

const getResponseText = (response) => {
  const parts = response?.candidates?.[0]?.content?.parts ?? []
  return parts
    .map((part) => part.text)
    .filter(Boolean)
    .join('\n')
    .trim()
}

const buildPrompt = (userPrompt) => {
  const conversation = sessionContexts[activeMode]
    .map(({ role, text }) => `${role.toUpperCase()}: ${text}`)
    .join('\n\n')

  return [
    prompts[activeMode],
    conversation && `CURRENT SESSION CONTEXT:\n${conversation}`,
    `USER:\n${userPrompt}`,
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function setActiveMode(mode) {
  if (!prompts[mode]) {
    throw new Error(`Unsupported Gemini mode: ${mode}`)
  }

  activeMode = mode
}

export function getActiveMode() {
  return activeMode
}

export function clearSession(mode = activeMode) {
  if (!prompts[mode]) {
    throw new Error(`Unsupported Gemini mode: ${mode}`)
  }

  sessionContexts = { ...sessionContexts, [mode]: [] }
  persistContexts()
}

export function getSessionContext(mode = activeMode) {
  if (!prompts[mode]) {
    throw new Error(`Unsupported Gemini mode: ${mode}`)
  }

  return [...sessionContexts[mode]]
}

export function getScratchpad() {
  return { ...sessionContexts.scratchpad }
}

export function saveScratchpad({ code, language }) {
  sessionContexts = {
    ...sessionContexts,
    scratchpad: { code, language },
  }
  persistContexts()
}

export function clearScratchpad() {
  sessionContexts = { ...sessionContexts, scratchpad: { ...DEFAULT_SCRATCHPAD } }
  persistContexts()
}

export async function sendMessage(userPrompt, { mode = activeMode, iterations = 1, signal } = {}) {
  const trimmedPrompt = userPrompt?.trim()

  if (!trimmedPrompt) {
    throw new TypeError('A non-empty prompt is required.')
  }

  setActiveMode(mode)

  let responseText = ''
  const iterationCount = Math.max(1, iterations)

  for (let iteration = 0; iteration < iterationCount; iteration += 1) {
    const prompt = iteration === 0
      ? buildPrompt(trimmedPrompt)
      : `${buildPrompt(trimmedPrompt)}\n\nReview your previous response for accuracy and provide only a corrected response if needed.`

    const response = signal
      ? await generateContent(prompt, { signal })
      : await generateContent(prompt)
    responseText = getResponseText(response)

    if (!responseText) {
      throw new Error('Gemini returned an empty response.')
    }
  }

  sessionContexts = {
    ...sessionContexts,
    [activeMode]: [
      ...sessionContexts[activeMode],
      { role: 'user', text: trimmedPrompt },
      { role: 'model', text: responseText },
    ],
  }
  persistContexts()

  return responseText
}
