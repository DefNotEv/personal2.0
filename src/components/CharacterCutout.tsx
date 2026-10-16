import type { Character } from '../data/characters.ts'

const PHOTO = '/IMG_5740.PNG'

export function CharacterCutout({
  character,
  className,
}: {
  character: Character
  className?: string
}) {
  const classes = className ? `${className} portrait` : 'portrait'

  return (
    <span className={classes} data-outfit={character.id}>
      <img className="portrait__photo" src={PHOTO} alt="" />
      {character.overlay ? (
        <img className="portrait__overlay" src={character.overlay} alt="" />
      ) : null}
      {character.shades ? (
        <img className="portrait__shades" src={character.shades} alt="" />
      ) : null}
    </span>
  )
}
