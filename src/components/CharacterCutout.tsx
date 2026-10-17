import type { Character } from '../data/characters.ts'

export const PHOTO = '/IMG_5740.PNG'

export function OutfitDrawing({ character }: { character: Character }) {
  if (!character.overlay && !character.shades) return null

  return (
    <>
      {character.overlay ? (
        <img className="portrait__overlay" src={character.overlay} alt="" />
      ) : null}
      {character.notes?.map((src, index) => (
        <img
          key={src}
          className="portrait__overlay portrait__notes"
          data-note={index}
          src={src}
          alt=""
        />
      ))}
      {character.shades ? (
        <img className="portrait__shades" src={character.shades} alt="" />
      ) : null}
    </>
  )
}
