import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateContent } from '../../../shared/api/geminiApi'
import {
  clearSession,
  getActiveMode,
  getSessionContext,
  sendMessage,
  setActiveMode,
} from '../../../shared/services/geminiService'

vi.mock('../../../shared/api/geminiApi', () => ({
  generateContent: vi.fn(),
}))

describe('geminiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    clearSession()
    setActiveMode('learn')
    generateContent.mockResolvedValue({
      candidates: [{ content: { parts: [{ text: 'A real Gemini response.' }] } }],
    })
  })

  it('prefixes the active mode and stores the session context', async () => {
    const response = await sendMessage('Help me reason about this.', { mode: 'learn' })

    expect(response).toBe('A real Gemini response.')
    expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('Learn mode'))
    expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('Help me reason about this.'))
    expect(getSessionContext()).toEqual([
      { role: 'user', text: 'Help me reason about this.' },
      { role: 'model', text: 'A real Gemini response.' },
    ])
  })

  it('switches active mode and can clear the current context', async () => {
    await sendMessage('Keep this learning context.', { mode: 'learn' })
    await sendMessage('Find the production issue.', { mode: 'work' })

    expect(getActiveMode()).toBe('work')
    expect(generateContent).toHaveBeenCalledWith(expect.stringContaining('Work mode'))
    expect(getSessionContext('learn')).toHaveLength(2)
    expect(getSessionContext('work')).toHaveLength(2)

    clearSession('work')
    expect(getSessionContext('work')).toEqual([])
    expect(getSessionContext('learn')).toHaveLength(2)
  })

  it('supports a bounded follow-up iteration', async () => {
    generateContent
      .mockResolvedValueOnce({ candidates: [{ content: { parts: [{ text: 'First response.' }] } }] })
      .mockResolvedValueOnce({ candidates: [{ content: { parts: [{ text: 'Corrected response.' }] } }] })

    const response = await sendMessage('Check this twice.', { iterations: 2 })

    expect(response).toBe('Corrected response.')
    expect(generateContent).toHaveBeenCalledTimes(2)
    expect(generateContent.mock.calls[1][0]).toContain('Review your previous response')
  })
})
