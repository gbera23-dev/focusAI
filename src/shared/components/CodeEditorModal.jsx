import { useState } from 'react'
import EditorModule from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import './CodeEditorModal.css'

const Editor = EditorModule.default ?? EditorModule

const DEFAULT_LANGUAGE = 'c';

const languages = [
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
]

function CodeEditorModal({ onAdd, onClose }) {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)

  const highlight = (value) => {
    const grammar = Prism.languages[language] ?? Prism.languages.plain
    return Prism.highlight(value, grammar, language)
  }

  const handleAdd = () => {
    if (!code.trim()) return
    onAdd(code, language)
    onClose()
  }

  const handleEditorKeyDown = (event) => {
    const openingPairs = { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' }
    const closingCharacters = new Set(Object.values(openingPairs))
    const input = event.currentTarget
    const { selectionStart, selectionEnd, value } = input

    if (closingCharacters.has(event.key) && selectionStart === selectionEnd && value[selectionStart] === event.key) {
      event.preventDefault()
      requestAnimationFrame(() => input.setSelectionRange(selectionStart + 1, selectionStart + 1))
      return
    }

    const closingCharacter = openingPairs[event.key]
    if (!closingCharacter) return

    event.preventDefault()
    const selectedText = value.slice(selectionStart, selectionEnd)
    const nextValue = `${value.slice(0, selectionStart)}${event.key}${selectedText}${closingCharacter}${value.slice(selectionEnd)}`
    const cursorPosition = selectionStart + 1 + selectedText.length

    setCode(nextValue)
    requestAnimationFrame(() => {
      input.focus()
      input.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  return (
    <div className="code-editor-backdrop" role="presentation">
      <section className="code-editor-modal" role="dialog" aria-modal="true" aria-labelledby="code-editor-title">
        <header className="code-editor-modal__header">
          <div>
            <span className="code-editor-modal__eyebrow">Code scratchpad</span>
            <h2 id="code-editor-title">Add code to your message</h2>
          </div>
          <button className="code-editor-modal__close" type="button" onClick={onClose} aria-label="Close code editor">×</button>
        </header>

        <div className="code-editor-modal__controls">
          <label htmlFor="code-language">Language</label>
          <select id="code-language" value={language} onChange={(event) => setLanguage(event.target.value)}>
            {languages.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
          </select>
        </div>

        <div className="code-editor" aria-label={`${language} code editor`}>
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlight}
            onKeyDown={handleEditorKeyDown}
            padding={18}
            textareaId="code-editor-input"
            placeholder="Write or paste code here..."
            style={{ minHeight: '280px', fontFamily: 'var(--mono)', fontSize: 14, lineHeight: 1.6 }}
          />
        </div>

        <footer className="code-editor-modal__footer">
          <button className="code-editor-modal__add" type="button" onClick={handleAdd} disabled={!code.trim()}>Add</button>
        </footer>
      </section>
    </div>
  )
}

export default CodeEditorModal
