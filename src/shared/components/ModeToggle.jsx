import './ModeToggle.css'

function ModeToggle({ mode, onToggle }) {
  const isLearnMode = mode === 'learn'
  const nextLabel = isLearnMode ? 'Switch to Work Mode' : 'Switch to Learn Mode'

  return (
    <button className="mode-toggle" type="button" onClick={onToggle} aria-label={nextLabel}>
      <span className="mode-toggle__dot" />
      <span>{isLearnMode ? 'Learn Mode' : 'Work Mode'}</span>
      <span className="mode-toggle__arrow" aria-hidden="true">↗</span>
    </button>
  )
}

export default ModeToggle
