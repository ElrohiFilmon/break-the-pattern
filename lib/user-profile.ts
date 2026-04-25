// ─── User Profile Types ───────────────────────────────────────────────────────

export interface UserProfile {
  // Q1 – situation
  situation: string
  situationDetail: string

  // Q2 – location & access
  liveArea: string
  hangoutArea: string
  accessPoints: string[]

  // Q3 – resources
  freeTime: string
  budget: string
  transport: string[]

  // Q4 – social
  networkSize: string
  interests: string[]
  meetingStyle: string
}

export interface StoredProfile extends UserProfile {
  createdAt: string
  lastUpdated: string
  completedSurvey: boolean
}

// ─── Addis neighbourhood list ─────────────────────────────────────────────────

export const AREAS = [
  'Bole',
  'Piassa',
  'CMC',
  'Kazanchis',
  'Megenagna',
  'Mexico',
  '22 Mazoria',
  'Gerji',
  'Arat Kilo',
  'Sidist Kilo',
  'Yeka',
  'Kirkos',
  'Other',
]

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = 'tohiUserProfile'

export function loadProfile(): StoredProfile | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as StoredProfile) : null
  } catch {
    return null
  }
}

export function saveProfile(profile: UserProfile, existing?: StoredProfile | null): StoredProfile {
  const now = new Date().toISOString()
  const stored: StoredProfile = {
    ...profile,
    createdAt: existing?.createdAt ?? now,
    lastUpdated: now,
    completedSurvey: true,
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  }
  return stored
}

export function clearProfile(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

// ─── Profile summary string for badge display ─────────────────────────────────

export function profileSummary(p: UserProfile): string {
  const parts: string[] = []
  if (p.situation) parts.push(p.situationDetail ? `${p.situation} (${p.situationDetail})` : p.situation)
  if (p.liveArea) parts.push(p.liveArea)
  if (p.freeTime) parts.push(`${p.freeTime} free`)
  if (p.budget) parts.push(p.budget)
  return parts.join(' · ')
}

// ─── Smart defaults / personalization helpers ─────────────────────────────────

export function getSituationPlaceholders(profile: UserProfile | null): string[] {
  if (!profile) {
    return [
      'I keep saying I will start my business idea but I end up watching YouTube every night...',
      'I want to meet more creative people but do not know where to start...',
      'I always spend weekends doing nothing productive...',
      'I feel stuck in the same social circle and cannot break out...',
    ]
  }

  const { situation } = profile

  if (situation === 'Student') {
    return [
      'I keep skipping classes and regretting it the night before exams...',
      'I study hard but never apply what I learn to real projects...',
      'I have a side idea but campus keeps me too busy to actually start it...',
      'I feel isolated at university and cannot connect with the right people...',
    ]
  }
  if (situation === 'Job seeking') {
    return [
      'I apply to jobs online but never follow up or network in person...',
      'I update my CV every week but nothing changes in my situation...',
      'I know people at good companies but feel too embarrassed to reach out...',
      'Every interview I get, I freeze and undersell myself...',
    ]
  }
  if (situation === 'Freelancer/Side hustler') {
    return [
      'I finish client work but never invest time in growing my own portfolio...',
      'I undercharge because I am afraid higher rates will scare clients away...',
      'I keep meaning to build a personal brand but never start...',
      'I have steady income but feel stuck and not growing...',
    ]
  }
  if (situation === 'Entrepreneur') {
    return [
      'My business plan is almost ready — it has been almost ready for 6 months...',
      'I keep refining the product instead of putting it in front of customers...',
      'I know I need to raise money but the thought of pitching terrifies me...',
      'My co-founder and I keep postponing our launch date...',
    ]
  }
  if (situation === 'Employed') {
    return [
      'I am stuck in the same role and too scared to ask for a promotion...',
      'I want to switch careers but do not know where to start rebuilding...',
      'I feel burnt out at work but keep pushing through instead of addressing it...',
      'I have a side project I never work on because I am always tired after work...',
    ]
  }

  return [
    'I keep saying I will change something but every week looks the same...',
    'I know what I should do but I keep finding reasons to wait...',
    'I feel like I am watching my city grow while I stay still...',
    'Every Sunday night I tell myself next week will be different...',
  ]
}
