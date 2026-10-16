import { useEffect } from 'react'
import { characters, wrapIndex } from '../data/characters.ts'
import { Cabinet } from './Cabinet.tsx'
import { CharacterSheet } from './CharacterSheet.tsx'
import { PedestalFigure } from './PedestalFigure.tsx'
import { useRosterScroll } from './useRosterScroll.ts'

export function CharacterProfile({
  index,
  onIndex,
  onBack,
}: {
  index: number
  onIndex: (index: number) => void
  onBack: () => void
}) {
  const character = characters[index] ?? characters[0]
  const previous = characters[wrapIndex(index, -1)] ?? characters[0]
  const next = characters[wrapIndex(index, 1)] ?? characters[0]

  useRosterScroll(index, onIndex)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onBack()
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        onIndex(wrapIndex(index, 1))
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onIndex(wrapIndex(index, -1))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onBack, onIndex])

  return (
    <Cabinet character={character}>
      <header className="topbar">
        <p className="eyebrow">Character file</p>
      </header>

      <div className="profile">
        <div className="pedestal">
          <div className="pedestal__glow" aria-hidden="true" />
          <div className="pedestal__platform" aria-hidden="true" />
          <PedestalFigure character={character} index={index} />
        </div>
        <article className="profile__copy">
          <h1>{character.name}</h1>
          <CharacterSheet character={character} />
          <div className="profile__nav">
            <button
              type="button"
              className="nav-btn"
              onClick={() => onIndex(wrapIndex(index, -1))}
            >
              <span>Previous</span>
              <strong>{previous.short}</strong>
            </button>
            <button type="button" className="text-btn text-btn--solid" onClick={onBack}>
              Back to roster
            </button>
            <button
              type="button"
              className="nav-btn"
              onClick={() => onIndex(wrapIndex(index, 1))}
            >
              <span>Next</span>
              <strong>{next.short}</strong>
            </button>
          </div>
        </article>
      </div>

      <p className="hint">
        <kbd>←</kbd>
        <kbd>→</kbd>
        <span>Switch</span>
        <kbd>Esc</kbd>
        <span>Roster</span>
      </p>
    </Cabinet>
  )
}
