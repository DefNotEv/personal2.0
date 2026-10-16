import type { Character } from '../data/characters.ts'

export function ExperienceStars({
  years,
  size = 'md',
}: {
  years: number
  size?: 'sm' | 'md'
}) {
  const label = `${years} ${years === 1 ? 'year' : 'years'} of experience`

  return (
    <div className={size === 'sm' ? 'stars stars--sm' : 'stars'} role="img" aria-label={label}>
      {Array.from({ length: years }, (_, index) => (
        <svg key={index} className="star" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
          />
        </svg>
      ))}
    </div>
  )
}

export function CharacterSheet({ character }: { character: Character }) {
  return (
    <div className="sheet">
      <div className="sheet__block">
        <p className="eyebrow">Class</p>
        <p className="sheet__role">{character.role}</p>
      </div>
      <div className="sheet__block">
        <p className="eyebrow">Experience</p>
        <ExperienceStars years={character.years} />
      </div>
      <div className="sheet__block">
        <p className="eyebrow">Strengths</p>
        <ul className="sheet__list">
          {character.strengths.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="sheet__block">
        <p className="eyebrow">Weaknesses</p>
        <ul className="sheet__list">
          {character.weaknesses.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
