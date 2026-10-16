import { useState } from 'react'
import type { CSSProperties } from 'react'
import { characters, slideDirection } from '../data/characters.ts'
import type { Character } from '../data/characters.ts'
import { CharacterSheet } from './CharacterSheet.tsx'

type Faces = [Character, Character]

export const FLIP_MS = 560

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
        style={{
          transform: `rotateY(${card.turns * -180}deg)`,
          transitionDuration: `${FLIP_MS}ms`,
        }}
      >
        {card.faces.map((face, faceIndex) => (
          <div
            key={faceIndex}
            className={faceIndex === 0 ? 'flip-card__face' : 'flip-card__face is-back'}
            aria-hidden={faceIndex !== front}
            inert={faceIndex !== front}
            style={
              {
                '--accent': face.accent,
                '--on-accent': face.onAccent,
              } as CSSProperties
            }
          >
            <CharacterSheet character={face} />
          </div>
        ))}
      </div>
    </div>
  )
}
