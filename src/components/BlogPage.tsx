import type { Character } from '../data/characters.ts'
import { Cabinet } from './Cabinet.tsx'

export function BlogPage({ character }: { character: Character }) {
  return (
    <Cabinet character={character}>
      <header className="topbar">
        <p className="eyebrow">Blog</p>
      </header>
      <section className="page">
        <h1 className="page__title">Blog</h1>
        <p className="page__lede">Notes from the pit lane, the control room and everywhere in between.</p>
        <div className="page__empty">
          <p className="eyebrow">No posts yet</p>
          <p>Check back soon.</p>
        </div>
      </section>
    </Cabinet>
  )
}
