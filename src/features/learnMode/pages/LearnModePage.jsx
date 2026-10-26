import ChatWindow from '../../../shared/components/ChatWindow'
import { useLearnMode } from '../hooks/useLearnMode'
import './LearnModePage.css'

function LearnModePage({ onToggle }) {
  const mode = useLearnMode()

  return (
    <main className="mode-page mode-page--learn">
      <section className="mode-intro">
        <div className="mode-intro__copy">
          <span className="mode-intro__eyebrow">{mode.eyebrow}</span>
          <h1>{mode.title}</h1>
          <p>{mode.description}</p>
        </div>
        <button className="mode-face" type="button" onClick={onToggle} aria-label="Switch to Work Mode">
          <span className="mode-face__hint">Switch mode</span>
        </button>
      </section>
      <ChatWindow modeLabel={mode.modeLabel} initialMessage={mode.initialMessage} />
    </main>
  )
}

export default LearnModePage
