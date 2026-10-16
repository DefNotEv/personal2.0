import type { CSSProperties, ReactNode } from 'react'
import type { Character } from '../data/characters.ts'

export function Cabinet({
  character,
  children,
}: {
  character: Character
  children: ReactNode
}) {
  const style = {
    '--accent': character.accent,
    '--on-accent': character.onAccent,
  } as CSSProperties

  return (
    <div className="cabinet" style={style}>
      <div className="cabinet__glow" aria-hidden="true" />
      <div className="bezel">
        <div className="bezel__inner">{children}</div>
      </div>
    </div>
  )
}
