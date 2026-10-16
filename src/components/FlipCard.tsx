import { useState } from 'react'
import { characters } from '../data/characters.ts'
import type { Character } from '../data/characters.ts'
import { CharacterSheet } from './CharacterSheet.tsx'
import { slideDirection } from './PedestalFigure.tsx'

type Faces = [Character, Character]

export function FlipCard({
  character,
  index,
}: {
  character: Character
  index: number
}) {
  const [card, setCard] = useState({
    id: character.id,
    index,
    turns: 0,
    faces: [character, character] as Faces,
  })

  if (card.id !== character.id) {
    const turns = card.turns + slideDirection(card.index, index, characters.length)
    const faces: Faces = [...card.faces]
    faces[Math.abs(turns) % 2] = character
    setCard({ id: character.id, index, turns, faces })
  }

  const front = Math.abs(card.turns) % 2

  return (
    <div className="flip-card">
      <div
        className="flip-card__inner"
        style={{ transform: `rotateY(${card.turns * -180}deg)` }}
      >
        {card.faces.map((face, faceIndex) => (
          <div
            key={faceIndex}
            className={faceIndex === 0 ? 'flip-card__face' : 'flip-card__face is-back'}
            aria-hidden={faceIndex !== front}
            inert={faceIndex !== front}
          >
            <CharacterSheet character={face} />
          </div>
        ))}
      </div>
    </div>
  )
}
