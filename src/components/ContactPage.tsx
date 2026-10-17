import type { Character } from '../data/characters.ts'
import { contactEmail, socials } from '../data/socials.ts'
import { Cabinet } from './Cabinet.tsx'
import { SocialIcon } from './SocialIcon.tsx'

export function ContactPage({ character }: { character: Character }) {
  const links = socials.filter((social) => social.href)

  return (
    <Cabinet character={character}>
      <header className="topbar">
        <p className="eyebrow">Contact</p>
      </header>
      <section className="page">
        <h1 className="page__title">Contact</h1>
        <p className="page__lede">Want to work together, or just say hi? My inbox is open.</p>

        {contactEmail ? (
          <a className="choose page__cta" href={`mailto:${contactEmail}`}>
            <span>Email me</span>
          </a>
        ) : null}

        {links.length ? (
          <ul className="contact-links">
            {links.map((social) => (
              <li key={social.id}>
                <a href={social.href} target="_blank" rel="noreferrer">
                  <SocialIcon id={social.id} />
                  <span>{social.name}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </Cabinet>
  )
}
