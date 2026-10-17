import type { Character } from '../data/characters.ts'
import { CardArtMedia } from './CardArtMedia.tsx'
import { OutfitDrawing, PHOTO } from './CharacterCutout.tsx'

// A Magic: The Gathering style card for a version's stats.
export function MtgCard({
  character,
  active,
  artDelay,
}: {
  character: Character
  active: boolean
  artDelay?: number
}) {
  const experience = `${character.years} ${character.years === 1 ? 'year' : 'years'} of experience`

  return (
    <div className="mtg">
      <div className="mtg__frame">
        <div className="mtg__bar mtg__title">
          <span className="mtg__name">{character.name}</span>
          <span className="mtg__cost" role="img" aria-label={experience} title={experience}>
            <span className="mtg__pip is-generic">{character.years}</span>
            <span className="mtg__pip is-color" />
          </span>
        </div>

        <div className="mtg__art" aria-hidden="true">
          {character.cardArt ? (
            <CardArtMedia art={character.cardArt} active={active} delay={artDelay} />
          ) : (
            <span className="portrait">
              <img className="portrait__photo" src={PHOTO} alt="" />
              <span className="doodle" data-outfit={character.id}>
                <OutfitDrawing character={character} />
              </span>
            </span>
          )}
        </div>

        <div className="mtg__bar mtg__type">
          <span>Legendary Creature — {character.role}</span>
          <span className="mtg__set" aria-hidden="true">
            {character.icon}
          </span>
        </div>

        <div className="mtg__rules">
          <p className="mtg__keyword">Strengths</p>
          <ul>
            {character.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mtg__keyword">Weaknesses</p>
          <ul>
            {character.weaknesses.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
