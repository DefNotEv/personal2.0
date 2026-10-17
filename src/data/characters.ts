export type CharacterId =
  | 'motorsports'
  | 'events'
  | 'broadcast'
  | 'marketing'
  | 'childcare'
  | 'sports'
  | 'all-around'

export type Experience = {
  title: string
  org: string
  location?: string
  dates?: string
  points?: readonly string[]
}

export type Sport = {
  name: string
  team: string
  years: string
  highlights?: readonly string[]
}

export type Photo = {
  src: string
  alt: string
}

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
  /** Extra drawing layers that animate on their own, over the overlay. */
  notes?: readonly string[]
  icon: string
  label: string
  /** False hides Choose; the version can be browsed but not opened. */
  choosable?: boolean
  experiences: readonly Experience[]
  sports?: readonly Sport[]
  /** Files under public/, shown in a carousel on the character file. */
  photos?: readonly Photo[]
}

export const characters: Character[] = [
  {
    id: 'all-around',
    short: 'All-Around',
    name: 'All-Around Evelyn',
    role: 'Human',
    strengths: ['Vibecoding', 'ESP32s', 'Making connections'],
    years: 19,
    weaknesses: [
      'Slay the Spire playtime',
      'Light mode (i refuse to code this in)',
      'Spends half her money on Magic: The Gathering',
    ],
    accent: '#ff5c9a',
    onAccent: '#1a100e',
    icon: '⭐',
    label: 'me!',
    choosable: false,
    experiences: [],
  },
  {
    id: 'motorsports',
    short: 'Motorsports',
    name: 'Motorsports Evelyn',
    role: 'Race Engineer',
    strengths: ['SOLIDWORKS', 'MATLAB', 'Quick decision-making'],
    weaknesses: [
      'Will lose temper at mansplainers',
      'Arvid Lindblad',
      "Can't name the F1 champions in chronological order",
    ],
    years: 2,
    accent: '#ff3b30',
    onAccent: '#1a100e',
    overlay: '/racing.png',
    icon: '🏎️',
    label: 'motorsports',
    experiences: [
      {
        title: 'B.S. Motorsports Engineering',
        org: 'Purdue University',
        location: 'Indianapolis, IN',
        dates: '2025 – 2029',
        points: ['Management minor'],
      },
      {
        title: 'Member',
        org: 'Hammer Down Racing @ Purdue',
        dates: '2026 – Present',
        points: [
          'Lemons endurance racing and Purdue Grand Prix',
          'Helps prep and maintain the team’s cars between race weekends',
        ],
      },
      {
        title: 'Secretary & Founder',
        org: 'Downtown Indy Rally Team (DIRT) @ Purdue',
        dates: '2025 – 2026',
        points: [
          'Co-founded the rally team',
          'Kept meeting records and handled member communications',
        ],
      },
      {
        title: 'Mechanical Member & Head of Business',
        org: 'FRC Team 7902 Markham Firebirds',
        location: 'Markham, ON',
        dates: '2022 – 2025',
        points: [
          'FIRST Robotics Competition',
          'Designed and built mechanisms for the competition robot',
          'Led sponsorship outreach and the team’s business plan',
        ],
      },
      {
        title: 'Mechanical Member & Head of Media',
        org: 'UHS Robotics (VEX)',
        location: 'Markham, ON',
        dates: '2021 – 2025',
        points: ['Built competition robots', 'Made viral videos'],
      },
      {
        title: 'Project Manager',
        org: 'Real World Design Challenge',
        dates: '2023',
        points: [
          "1st place nationally (Governor's Award)",
          'Managed the team’s design timeline and deliverables',
        ],
      },
    ],
  },
  {
    id: 'events',
    short: 'Events',
    name: 'Events Evelyn',
    role: 'Organizer',
    strengths: ['Crisis control', 'Spreadsheets', 'Running up 10 flights of stairs'],
    weaknesses: [
      'People who ask for more free stuff',
      '"We should add a poker event!"',
      'Wears jeans instead of dress pants',
    ],
    years: 4,
    accent: '#e0b15a',
    onAccent: '#1a100e',
    overlay: '/events.png',
    icon: '🎫',
    label: 'events',
    experiences: [
      {
        title: 'President & Founder',
        org: 'Asian Student Association @ Purdue Indianapolis',
        dates: 'Founding now',
        points: [
          'Recruited a faculty advisor and drafting the constitution',
          'Planning a 7-seat exec board',
          'Planning a member discount card with local Asian restaurants',
        ],
      },
      {
        title: 'Member',
        org: 'Purdue Engineering Student Council',
        dates: '2025',
        points: ['Helped plan events for engineering students'],
      },
      {
        title: 'Chief Operating & Marketing Officer',
        org: 'Hackathons North America',
        location: 'Toronto, ON',
        dates: '2024 – 2025',
        points: [
          'Ran day-to-day operations for the org’s hackathons',
          'Coordinated sponsors, venues and volunteers',
        ],
      },
      {
        title: 'Operations & Marketing Intern',
        org: 'National Event Management',
        location: 'Markham, ON',
        dates: '2024 – 2025',
        points: [
          'Supported on-site operations at large events',
          'Created marketing materials and social content',
        ],
      },
      {
        title: 'Events Director',
        org: 'Unionville High School Student Council',
        dates: '2024 – 2025',
        points: ['Elected by 500+ students', 'Planned and ran school-wide events'],
      },
      {
        title: 'Lead Organizer',
        org: 'Apocalypse (Hack Club)',
        dates: '2023 – 2024',
        points: ["Organized Canada's largest high school hackathon", 'Hosted at Shopify'],
      },
    ],
  },
  {
    id: 'broadcast',
    short: 'Broadcasting',
    name: 'Broadcasting Evelyn',
    role: 'Live Director',
    strengths: ['Camera switching', 'Audio mixing', 'Staying calm on headset'],
    weaknesses: ["Murphy's Law", 'ProPresenter updates', "The company forgetting to turn on their mics"],
    years: 6,
    accent: '#3ad7ff',
    onAccent: '#062028',
    overlay: '/broadcasting.png',
    icon: '🎧',
    label: 'broadcasting',
    experiences: [
      {
        title: 'Livestream Operator',
        org: 'Hope Bible Church Markham',
        dates: '2021 – 2025',
        points: ['Operates cameras, ProPresenter and TriCasters', 'Trains new members'],
      },
      {
        title: 'President & Founder',
        org: 'UHS A/V Club',
        dates: '2023 – 2024',
        points: ['Founded the club', 'Taught members camera, audio and livestream basics'],
      },
      {
        title: 'Co-Host',
        org: 'The Drive Team Podcast',
        dates: '2022 – 2023',
        points: ['Created a VEX robotics podcast', '6 episodes (4 published), 1,000+ listeners'],
      },
    ],
  },
  {
    id: 'marketing',
    short: 'Marketing',
    name: 'Marketing Evelyn',
    role: 'ABG CMO',
    strengths: ['Adobe Suite', 'Tapping into trends', 'SEO and optimization'],
    weaknesses: [
      '12-hour screen time on TikTok', '12-hour screen time on Instagram', '12-hour screen time on LinkedIn',
    ],
    years: 5,
    accent: '#a970ff',
    onAccent: '#140c22',
    overlay: '/marketing-outfit.png',
    shades: '/marketing-shades.png',
    icon: '📱',
    label: 'marketing',
    experiences: [
      {
        title: 'Content Creator',
        org: 'Hack49',
        dates: '2024 – Present',
        points: ["Grew the org's reach", 'Created short-form video and social posts'],
      },
      {
        title: 'Chief Operating & Marketing Officer',
        org: 'Hackathons North America',
        location: 'Toronto, ON',
        dates: '2024 – 2025',
        points: [
          'Led marketing and social media for the org’s events',
          'Designed graphics and promo content',
        ],
      },
      {
        title: 'Head of Media',
        org: 'UHS Robotics (VEX)',
        location: 'Markham, ON',
        dates: '2021 – 2025',
        points: ['Made viral videos', 'Ran the team’s social media'],
      },
    ],
  },
  {
    id: 'childcare',
    short: 'Childcare',
    name: 'Childcare Evelyn',
    role: 'Guardian',
    strengths: ['First aid', 'Lullabies', 'Nerf gun sharpshooter'],
    weaknesses: ['Will talk about Minecraft for hours', 'Watches paw patrol after the kids are done', 'Eats half the animal crackers'],
    years: 9,
    accent: '#f0b429',
    onAccent: '#1a100e',
    overlay: '/childcare-outfit.png',
    notes: ['/childcare-notes-left.png', '/childcare-notes-right.png'],
    icon: '🧸',
    label: 'childcare',
    experiences: [
      {
        title: 'Babysitter',
        org: 'On call',
        dates: '2021 – Present',
        points: ['Cares for kids of all ages, from meals to bedtime', 'Trusted by repeat families'],
      },
      {
        title: 'Summer Camp Counselor',
        org: 'Hope Bible Church Markham',
        dates: '2022 – 2025',
        points: ['Supervised children ages 0–13', 'Planned lessons and activities'],
      },
      {
        title: 'Summer Camp Counselor',
        org: 'Toronto City Mission',
        dates: '2022 – 2025',
        points: ['Supervised campers', 'Led games, crafts and activities'],
      },
      {
        title: 'First Aid + CPR C',
        org: 'Canadian Red Cross',
      },
    ],
  },
  {
    id: 'sports',
    short: 'Sports',
    name: 'Sports Evelyn',
    role: 'Athlete',
    strengths: ['Raptors ball knowledge', 'Snowboard racing', 'Third base'],
    weaknesses: ['Racket sports', 'Bad warmup music', 'The gym'],
    years: 7,
    accent: '#34d27b',
    onAccent: '#06180e',
    icon: '🏂',
    label: 'sports',
    experiences: [],
    sports: [
      {
        name: 'Rock Climbing',
        team: 'UHS Varsity',
        years: '2022 – 2025',
        highlights: ['3x regional champion'],
      },
      {
        name: 'Snowboarding',
        team: 'UHS Varsity',
        years: '2022 – 2025',
        highlights: ['Provincial qualifier', '49th in Ontario'],
      },
      {
        name: 'Softball & Slo-Pitch',
        team: 'UHS Varsity · CCSA Trinity Rep League',
        years: '2024 – 2025',
        highlights: ['MVP', 'Quarterfinalist'],
      },
      {
        name: 'Basketball',
        team: 'UHS Varsity',
        years: '2022 – 2023',
        highlights: ['Quarterfinalist'],
      },
      {
        name: 'Mountain Biking',
        team: 'UHS Varsity',
        years: '2022',
      },
      {
        name: 'Basketball',
        team: 'Above the 6ix Rep League',
        years: '2019 – 2021',
      },
    ],
    photos: [],
  },
]

export function padNumber(value: number): string {
  return String(value).padStart(2, '0')
}

export function wrapIndex(index: number, delta: number): number {
  return (index + delta + characters.length) % characters.length
}

export type Direction = 1 | -1

export function slideDirection(from: number, to: number, length: number): Direction {
  const delta = to - from
  if (Math.abs(delta) > length / 2) return delta > 0 ? -1 : 1
  return delta >= 0 ? 1 : -1
}

export function moveRosterIndex(index: number, key: string): number {
  if (key === 'ArrowRight') return wrapIndex(index, 1)
  if (key === 'ArrowLeft') return wrapIndex(index, -1)
  return index
}
