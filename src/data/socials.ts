export type SocialId = 'linkedin' | 'github' | 'devpost' | 'instagram' | 'tiktok' | 'x'

export type Social = {
  id: SocialId
  name: string
  /** Leave empty to hide the link until it's filled in. */
  href: string
}

export const socials: Social[] = [
  { id: 'linkedin', name: 'LinkedIn', href: 'https://www.linkedin.com/in/evelynhwong' },
  { id: 'github', name: 'GitHub', href: 'https://github.com/defnotev' },
  { id: 'devpost', name: 'Devpost', href: 'https://devpost.com/evelynhzswong' },
  { id: 'instagram', name: 'Instagram', href: 'https://www.instagram.com/wong.zs' },
  { id: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@realevwong' },
  { id: 'x', name: 'X', href: 'https://x.com/evelynhannah_' },
]

/** The address the contact page's email button opens. */
export const contactEmail = 'wong552@purdue.edu'
