export type CharacterId =
  | 'motorsports'
  | 'events'
  | 'broadcast'
  | 'marketing'
  | 'childcare'
  | 'all-around'

export type Character = {
  id: CharacterId
  short: string
  name: string
  role: string
  strengths: readonly string[]
  weaknesses: readonly string[]
  years: number
  accent: string
  onAccent: string
  overlay?: string
  shades?: string
  icon: string
  label: string
}

export const characters: Character[] = [
  {
    id: 'all-around',
    short: 'All-Around',
    name: 'All-Around Evelyn',
    role: 'Just another human',
    strengths: ['Raptors ball knowledge', 'Arduino Unos', 'Finding cheap plane tickets'],
    years: 19,
    weaknesses: ['Doing absolutely nothing for a day'],
    accent: '#f4efe4',
    onAccent: '#1a100e',
    icon: '⭐',
    label: 'me!',
  },
  {
    id: 'motorsports',
    short: 'Motorsports',
    name: 'Motorsports Evelyn',
    role: 'Race Engineer',
    strengths: ['SOLIDWORKS', 'MATLAB', 'Quick decision-making'],
    weaknesses: ['Mansplainers', 'Arvid Lindblad'],
    years: 2,
    accent: '#ff3b30',
    onAccent: '#1a100e',
    overlay: '/racing.png',
    icon: '🏎️',
    label: 'motorsports',
  },
  {
    id: 'events',
    short: 'Event Management',
    name: 'Event Management Evelyn',
    role: 'Event Ops Intern',
    strengths: ['Crisis control', 'Spreadsheets', 'Patience'],
    weaknesses: ['People who ask for more free stuff'],
    years: 4,
    accent: '#e0b15a',
    onAccent: '#1a100e',
    overlay: '/events.png',
    icon: '🎫',
    label: 'events',
  },
  {
    id: 'broadcast',
    short: 'Broadcast Operations',
    name: 'Broadcast Operations Evelyn',
    role: 'Livestream Operator',
    strengths: ['Camera switching', 'Audio mixing', 'Staying calm on headset'],
    weaknesses: ["Murphy's Law", 'ProPresenter updates'],
    years: 6,
    accent: '#3ad7ff',
    onAccent: '#062028',
    overlay: '/broadcasting.png',
    icon: '🎧',
    label: 'broadcasting',
  },
  {
    id: 'marketing',
    short: 'Marketing',
    name: 'Marketing Evelyn',
    role: 'ABG CMO',
    strengths: ['Adobe Suite', 'Tapping into trends', 'SEO and optimization'],
    weaknesses: [
      '12-hour screen time on TikTok, Instagram, and LinkedIn. Individually.',
    ],
    years: 5,
    accent: '#ff6a3d',
    onAccent: '#1a100e',
    overlay: '/marketing-outfit.png',
    shades: '/marketing-shades.png',
    icon: '📱',
    label: 'marketing',
  },
  {
    id: 'childcare',
    short: 'Childcare',
    name: 'Childcare Evelyn',
    role: 'Guardian',
    strengths: ['First aid', 'Lullabies', 'Nerf gun sharpshooter'],
    weaknesses: ['Will talk about Minecraft for hours'],
    years: 9,
    accent: '#f0b429',
    onAccent: '#1a100e',
    overlay: '/childcare.png',
    icon: '🧸',
    label: 'childcare',
  },
]

export function padNumber(value: number): string {
  return String(value).padStart(2, '0')
}

export function wrapIndex(index: number, delta: number): number {
  return (index + delta + characters.length) % characters.length
}

export function moveRosterIndex(index: number, key: string): number {
  if (key === 'ArrowRight') return wrapIndex(index, 1)
  if (key === 'ArrowLeft') return wrapIndex(index, -1)
  return index
}
