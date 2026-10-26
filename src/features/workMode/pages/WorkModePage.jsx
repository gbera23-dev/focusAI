import ChatWindow from '../../../shared/components/ChatWindow'
import { useWorkMode } from '../hooks/useWorkMode'
import './WorkModePage.css'

function WorkModePage({ onToggle }) {
  const mode = useWorkMode()

  return (
    <main className="mode-page mode-page--work">
      <section className="mode-intro">
        <div className="mode-intro__copy">
          <span className="mode-intro__eyebrow">{mode.eyebrow}</span>
          <h1>{mode.title}</h1>
          <p>{mode.description}</p>
        </div>
        <button className="mode-face" type="button" onClick={onToggle} aria-label="Switch to Learn Mode">
          <span className="mode-face__hint">Switch mode</span>
        </button>
      </section>
      <ChatWindow modeLabel={mode.modeLabel} initialMessage={mode.initialMessage} />
    </main>
  )
}

export default WorkModePage
