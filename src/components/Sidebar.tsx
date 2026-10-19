import { useEffect, useState } from 'react'
import { track } from '@vercel/analytics'
import type { CSSProperties } from 'react'
import { socials } from '../data/socials.ts'
import { SocialIcon } from './SocialIcon.tsx'

export type Page = 'characters' | 'blog' | 'contact'

const NAV: { page: Page; label: string; href: string }[] = [
  { page: 'characters', label: 'Character Select', href: '#/' },
  { page: 'blog', label: 'Blog', href: '#/blog' },
  { page: 'contact', label: 'Contact', href: '#/contact' },
]

export function Sidebar({
  page,
  accent,
  hidden,
}: {
  page: Page
  accent: string
  hidden: boolean
}) {
  const [open, setOpen] = useState(false)
  // Unfilled links show as faded placeholders locally, never on the live site.
  const links = socials.filter((social) => social.href || import.meta.env.DEV)

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  if (hidden) return null

  return (
    <div className="sidebar-shell" style={{ '--accent': accent } as CSSProperties}>
      <button
        type="button"
        className="menu-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="sidebar"
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
      </button>

      <nav id="sidebar" className={open ? 'sidebar is-open' : 'sidebar'} aria-label="Site">
        <a className="sidebar__brand" href="#/" onClick={() => setOpen(false)}>
          Evelyn
          <span>H.Z.S. Wong</span>
        </a>

        <ul className="sidebar__nav">
          {NAV.map((item) => (
            <li key={item.page}>
              <a
                href={item.href}
                aria-current={page === item.page ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {links.length ? (
          <ul className="sidebar__socials">
            {links.map((social) => (
              <li key={social.id}>
                {social.href ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    onClick={() => track('Social click', { network: social.name, from: 'sidebar' })}
                  >
                    <SocialIcon id={social.id} />
                  </a>
                ) : (
                  <span className="is-placeholder" title={`${social.name}: add a link`}>
                    <SocialIcon id={social.id} />
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </nav>

      {open ? <div className="sidebar__scrim" onClick={() => setOpen(false)} /> : null}
    </div>
  )
}
