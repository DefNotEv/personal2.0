import { useEffect } from 'react'
import { characters } from '../data/characters.ts'
import { Cabinet } from './Cabinet.tsx'
import { CharacterName, CharacterSheet } from './CharacterSheet.tsx'

export function CharacterProfile({
  index,
  onBack,
}: {
  index: number
  onBack: () => void
}) {
  const character = characters[index] ?? characters[0]

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onBack()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onBack])

  return (
    <Cabinet character={character}>
      <header className="topbar">
        <p className="eyebrow">Character file</p>
      </header>

      <div className="profile">
        <article className="profile__copy">
          <h1 data-title={character.id}>
            <CharacterName character={character} />
          </h1>
          <CharacterSheet character={character} />
          <div className="profile__nav">
            <button type="button" className="text-btn text-btn--solid" onClick={onBack}>
              Back to roster
            </button>
          </div>
        </article>

        {character.experiences.length > 0 ? (
          <section className="resume" aria-labelledby="resume-heading">
            <h2 id="resume-heading" className="eyebrow">
              Experience
            </h2>
            <ul className="resume__list">
              {character.experiences.map((entry, entryIndex) => (
                <li key={`${entry.org}-${entryIndex}`} className="exp-card">
                  <div className="exp-card__head">
                    <h3 className="exp-card__title">{entry.title}</h3>
                    {entry.dates ? <p className="exp-card__dates">{entry.dates}</p> : null}
                  </div>
                  <p className="exp-card__org">
                    {entry.org}
                    {entry.location ? (
                      <span className="exp-card__location"> · {entry.location}</span>
                    ) : null}
                  </p>
                  {entry.points?.length ? (
                    <ul className="exp-card__points">
                      {entry.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <p className="hint">
        <kbd>Esc</kbd>
        <span>Roster</span>
      </p>
    </Cabinet>
  )
}
