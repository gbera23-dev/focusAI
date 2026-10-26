import { useState } from 'react'
import { useChatSession } from '../hooks/useChatSession'
import CodeEditorModal from './CodeEditorModal'
import MessageContent from './MessageContent'
import './ChatWindow.css'

function ChatWindow({ modeLabel, initialMessage }) {
  const [draft, setDraft] = useState('')
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false)
  const { messages, isThinking, sendMessage, clearSession } = useChatSession({
    initialMessage,
    modeLabel,
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    sendMessage(draft)
    setDraft('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit(event)
    }
  }

  const handleAddCode = (code, language) => {
    const normalizedCode = code.replace(/\r\n/g, '\n').replace(/^\n+|\n+$/g, '')
    const codeBlock = `\`\u0060\u0060${language}\n${normalizedCode}\n\`\u0060\u0060`
    setDraft((currentDraft) => {
      const trimmedDraft = currentDraft.trimEnd()
      return `${trimmedDraft}${trimmedDraft ? '\n\n' : ''}${codeBlock}`
    })
  }

  return (
    <section className="chat-window" aria-label={`${modeLabel} chat`}>
      <div className="chat-window__toolbar">
        <div>
          <span className="chat-window__eyebrow">Current session</span>
          <h2>{modeLabel} workspace</h2>
        </div>
        <button className="chat-window__clear" type="button" onClick={clearSession}>
          Clear session
        </button>
      </div>

      <div className="chat-window__messages" aria-live="polite">
        {messages.map((message) => (
          <article className={`message message--${message.role}`} key={message.id}>
            <span className="message__role">{message.role === 'assistant' ? 'FocusAI' : 'You'}</span>
            <div className="message__body">
              <MessageContent content={message.content} />
            </div>
          </article>
        ))}
        {isThinking && <span className="chat-window__thinking">Thinking through your message<span>...</span></span>}
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-message">Message FocusAI</label>
        <textarea
          id="chat-message"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={modeLabel === 'Learn Mode' ? 'What are you working through?' : 'What needs solving?'}
          rows="1"
        />
        <button className="chat-composer__code" type="button" onClick={() => setIsCodeEditorOpen(true)} aria-label="Open code editor" title="Add code">
          <span aria-hidden="true">&gt;_</span>
        </button>
        <button type="submit" disabled={!draft.trim() || isThinking} aria-label="Send message">
          <span aria-hidden="true">↑</span>
        </button>
      </form>
      <p className="chat-window__hint">Enter sends · Shift + Enter adds a new line</p>
      {isCodeEditorOpen && <CodeEditorModal onAdd={handleAddCode} onClose={() => setIsCodeEditorOpen(false)} />}
    </section>
  )
}

export default ChatWindow
