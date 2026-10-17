import { useEffect } from 'react'
import { characters } from '../data/characters.ts'
import { Cabinet } from './Cabinet.tsx'
import { CharacterName, CharacterSheet } from './CharacterSheet.tsx'
import { PhotoCarousel } from './PhotoCarousel.tsx'

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

        {character.sports?.length || character.photos?.length ? (
          <div className="athletics">
            {character.sports?.length ? (
              <section className="resume" aria-labelledby="sports-heading">
                <h2 id="sports-heading" className="eyebrow">
                  Sports
                </h2>
                <ul className="sports-list">
                  {character.sports.map((sport) => (
                    <li key={`${sport.name}-${sport.team}`} className="sport">
                      <div className="sport__head">
                        <h3 className="sport__name">{sport.name}</h3>
                        <p className="sport__years">{sport.years}</p>
                      </div>
                      <p className="sport__team">{sport.team}</p>
                      {sport.highlights?.length ? (
                        <ul className="sport__highlights">
                          {sport.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {character.photos?.length ? (
              <section className="resume" aria-labelledby="photos-heading">
                <h2 id="photos-heading" className="eyebrow">
                  Photos
                </h2>
                <PhotoCarousel photos={character.photos} label={`${character.name} photos`} />
              </section>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="hint">
        <kbd>Esc</kbd>
        <span>Roster</span>
      </p>
    </Cabinet>
  )
}
