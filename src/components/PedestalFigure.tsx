import { useEffect, useState } from 'react'
import { characters, slideDirection } from '../data/characters.ts'
import type { Character, Direction } from '../data/characters.ts'
import { OutfitDrawing, PHOTO } from './CharacterCutout.tsx'

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function PedestalFigure({
  character,
  index,
}: {
  character: Character
  index: number
}) {
  const [frame, setFrame] = useState({
    id: character.id,
    index,
    outgoing: null as Character | null,
    direction: 1 as Direction,
  })

  if (frame.id !== character.id) {
    const previous = characters[frame.index] ?? null
    setFrame({
      id: character.id,
      index,
      outgoing: prefersReducedMotion() ? null : previous,
      direction: slideDirection(frame.index, index, characters.length),
    })
  }

  useEffect(() => {
    if (!frame.outgoing) return
    const timer = window.setTimeout(() => {
      setFrame((current) =>
        current.outgoing ? { ...current, outgoing: null } : current,
      )
    }, 540)
    return () => window.clearTimeout(timer)
  }, [frame.id, frame.outgoing])

  const outgoing =
    frame.outgoing && frame.outgoing.id !== character.id ? frame.outgoing : null

  const showEnter = Boolean(character.overlay || character.shades)
  const showLeave = Boolean(outgoing && (outgoing.overlay || outgoing.shades))

  return (
    <div className="pedestal__stage">
      <div className="pedestal__figure">
        <span className="portrait">
          <img className="portrait__photo" src={PHOTO} alt="" />
          {showLeave && outgoing ? (
            <span
              className="doodle is-leave"
              data-direction={frame.direction}
              data-outfit={outgoing.id}
            >
              <OutfitDrawing character={outgoing} />
            </span>
          ) : null}
          {showEnter ? (
            <span
              className={outgoing ? 'doodle is-enter' : 'doodle'}
              data-direction={frame.direction}
              data-outfit={character.id}
              key={character.id}
            >
              <OutfitDrawing character={character} />
            </span>
          ) : null}
        </span>
      </div>
    </div>
  )
}
