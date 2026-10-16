import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import {
  characters,
  moveRosterIndex,
  padNumber,
} from '../data/characters.ts'
import { Cabinet } from './Cabinet.tsx'
import { CharacterCutout } from './CharacterCutout.tsx'
import { CharacterSheet } from './CharacterSheet.tsx'
import { useRosterScroll } from './useRosterScroll.ts'

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
  const touchX = useRef<number | null>(null)

  useRosterScroll(index, onIndex)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault()
        onConfirm()
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
  }, [index, onConfirm, onIndex])

  useEffect(() => {
    const card = document.getElementById(`character-${character.id}`)
    const roster = card?.closest('.roster')
    if (!card || !(roster instanceof HTMLElement)) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cardLeft = card.getBoundingClientRect().left - roster.getBoundingClientRect().left
    const target = roster.scrollLeft + cardLeft - (roster.clientWidth - card.clientWidth) / 2
    roster.scrollTo({
      left: Math.max(0, target),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }, [character.id])

  return (
    <Cabinet character={character}>
      <header className="topbar">
        <h1>Hi, I'm Evelyn. Choose your character.</h1>
        <p className="count">
          {padNumber(index + 1)} / {padNumber(characters.length)}
        </p>
      </header>

      <div className="select">
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
                  if (selected) onConfirm()
                  else onIndex(entryIndex)
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
          <div className="pedestal__figure" key={character.id}>
            <CharacterCutout character={character} className="cutout" />
          </div>
        </div>

        <aside className="dossier">
          <div>
            <p className="eyebrow">Version {padNumber(index + 1)}</p>
            <h2 className="stage__name">{character.name}</h2>
          </div>
          <CharacterSheet character={character} />
          <button
            type="button"
            className="choose"
            aria-label={`Choose ${character.name}`}
            onClick={onConfirm}
          >
            Choose
          </button>
        </aside>
      </div>

      <p className="hint">
        <kbd>←</kbd>
        <kbd>→</kbd>
        <span>Move</span>
        <kbd>Enter</kbd>
        <span>Choose</span>
      </p>
    </Cabinet>
  )
}
