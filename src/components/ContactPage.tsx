import { track } from '@vercel/analytics'
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
          <a
            className="choose page__cta"
            href={`mailto:${contactEmail}`}
            onClick={() => track('Email click')}
          >
            <span>Email me</span>
          </a>
        ) : null}

        {links.length ? (
          <ul className="contact-links">
            {links.map((social) => (
              <li key={social.id}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => track('Social click', { network: social.name, from: 'contact' })}
                >
                  <SocialIcon id={social.id} />
                  <span>{social.name}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                className="contact-links__old-site"
                href="https://evelynwong.vercel.app"
                target="_blank"
                rel="noreferrer"
                onClick={() => track('Old site click')}
              >
                <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3c2.5 2.7 3.6 5.8 3.6 9s-1.1 6.3-3.6 9c-2.5-2.7-3.6-5.8-3.6-9S9.5 5.7 12 3Z" />
                </svg>
                <span>My old website (those who know)</span>
              </a>
            </li>
          </ul>
        ) : null}
      </section>
    </Cabinet>
  )
}
