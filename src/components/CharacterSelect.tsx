import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  characters,
  moveRosterIndex,
  wrapIndex,
} from '../data/characters.ts'
import { Cabinet } from './Cabinet.tsx'
import { CharacterName } from './CharacterSheet.tsx'
import { FLIP_MS, FlipCard } from './FlipCard.tsx'
import { PedestalFigure } from './PedestalFigure.tsx'
import { useRosterScroll } from './useRosterScroll.ts'

// Matches the three columns of .roster in index.css.
const ROSTER_COLUMNS = 3
// Locked "?" tiles that square off the last roster row.
const MYSTERY_TILES = (ROSTER_COLUMNS - (characters.length % ROSTER_COLUMNS)) % ROSTER_COLUMNS

export function CharacterSelect({
  index,
  onIndex,
  onConfirm,
}: {
  index: number
  onIndex: (index: number) => void
  onConfirm: () => void
}) {
  const character = characters[index] ?? characters[0]
  const canChoose = character.choosable !== false
  const touchX = useRef<number | null>(null)
  const [paint, setPaint] = useState(character)
  const paintTimers = useRef<number[]>([])

  useRosterScroll(index, onIndex)

  // Repaint the page accent when the flip card is edge-on, not on input.
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setPaint(character), reduced ? 0 : FLIP_MS / 2)
    paintTimers.current.push(timer)
  }, [character])

  useEffect(() => {
    const timers = paintTimers.current
    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [])

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault()
        if (canChoose) onConfirm()
        return
      }

      const next = moveRosterIndex(index, event.key)
      if (next === index) return
      event.preventDefault()
      onIndex(next)
      document.getElementById(`character-${characters[next]?.id}`)?.focus()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [canChoose, index, onConfirm, onIndex])

  return (
    <Cabinet character={paint}>
      <div className="select">
        <div className="pedestal__heading">
          <p className="pedestal__kicker">choose your evelyn</p>
          <h2 className="stage__name pedestal__title" data-title={character.id}>
            <CharacterName character={character} />
          </h2>
        </div>
        <div className="roster" role="listbox" aria-label="Versions of Evelyn">
          {characters.map((entry, entryIndex) => {
            const selected = entryIndex === index
            return (
              <button
                key={entry.id}
                id={`character-${entry.id}`}
                type="button"
                role="option"
                aria-selected={selected}
                aria-label={entry.name}
                className={selected ? 'roster-card is-selected' : 'roster-card'}
                style={{ '--accent': entry.accent } as CSSProperties}
                onClick={() => {
                  if (!selected) onIndex(entryIndex)
                  else if (canChoose) onConfirm()
                }}
              >
                <span className="roster-card__box">
                  <span className="roster-card__icon" aria-hidden="true">
                    {entry.icon}
                  </span>
                </span>
                <span className="roster-card__label">{entry.label}</span>
              </button>
            )
          })}
          {Array.from({ length: MYSTERY_TILES }, (_, tileIndex) => (
            <span key={`mystery-${tileIndex}`} className="roster-card is-mystery" aria-hidden="true">
              <span className="roster-card__box">
                <span className="roster-card__icon">?</span>
              </span>
              <span className="roster-card__label">???</span>
            </span>
          ))}
        </div>

        <div
          className="pedestal"
          onTouchStart={(event) => {
            touchX.current = event.changedTouches[0]?.clientX ?? null
          }}
          onTouchEnd={(event) => {
            const start = touchX.current
            const end = event.changedTouches[0]?.clientX
            touchX.current = null
            if (start == null || end == null) return
            const delta = end - start
            if (Math.abs(delta) < 48) return
            onIndex((index + (delta < 0 ? 1 : -1) + characters.length) % characters.length)
          }}
        >
          <div className="pedestal__glow" aria-hidden="true" />
          <div className="pedestal__platform" aria-hidden="true" />
          <PedestalFigure character={character} index={index} />
          <button
            type="button"
            className="pedestal__arrow is-prev"
            aria-label="Previous character"
            onClick={() => onIndex(wrapIndex(index, -1))}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
          <button
            type="button"
            className="pedestal__arrow is-next"
            aria-label="Next character"
            onClick={() => onIndex(wrapIndex(index, 1))}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>

        <aside className="dossier">
          <FlipCard character={character} index={index} />
          {canChoose ? (
            <button
              type="button"
              className="choose"
              aria-label={`Choose ${character.name}`}
              onClick={onConfirm}
            >
              <span>Choose</span>
            </button>
          ) : (
            <p className="outfit-prompt">change my outfit --&gt;</p>
          )}
        </aside>
      </div>

      <p className="hint">
        <span className="hint__group">
          <span>Move</span>
          <span className="hint__keys">
            <kbd>←</kbd>
            <kbd>→</kbd>
          </span>
        </span>
        {canChoose ? (
          <span className="hint__group">
            <span>Choose</span>
            <kbd>Enter</kbd>
          </span>
        ) : null}
      </p>
    </Cabinet>
  )
}
