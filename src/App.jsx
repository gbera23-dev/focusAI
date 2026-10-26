import { useState } from 'react'
import LearnModePage from './features/learnMode/pages/LearnModePage'
import WorkModePage from './features/workMode/pages/WorkModePage'
import ModeToggle from './shared/components/ModeToggle'
import './App.css'

function App() {
  const [mode, setMode] = useState('learn')
  const isLearnMode = mode === 'learn'

  return (
    <div className={`app-shell app-shell--${mode}`}>
      <header className="app-header">
        <a className="brand" href="/" aria-label="FocusAI home">
          <span className="brand__mark">f</span>
          <span>focus<span>AI</span></span>
        </a>
        <div className="app-header__meta">
          <span className="session-status"><span /> Session ready</span>
          <ModeToggle mode={mode} onToggle={() => setMode(isLearnMode ? 'work' : 'learn')} />
        </div>
      </header>

      <div className="app-content">
        <div className="mode-transition" key={mode}>
          {isLearnMode ? (
            <LearnModePage onToggle={() => setMode('work')} />
          ) : (
            <WorkModePage onToggle={() => setMode('learn')} />
          )}
        </div>
      </div>

      <footer className="app-footer">
        <span>focusAI</span>
        <span>{isLearnMode ? 'Make space for understanding.' : 'Make the next move count.'}</span>
      </footer>
    </div>
  )
}

export default App
