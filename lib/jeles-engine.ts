// lib/jeles-engine.ts
// Jeles — self-contained pattern-breaking friend. Zero external APIs.

import type { UserProfile as ContextProfile } from '@/app/context/ProfileContext'

// ─── Jeles-internal UserProfile ──────────────────────────────────────────────
// Mapped from the app's ContextProfile at call-time.

export interface JelesProfile {
  name: string
  neighborhood: string
  budget: 'low' | 'mid' | 'high'
  timeAvailable: string
  interests: string[]
  stuckPattern: string
  completedChallenges: string[]
  lastBlueprintType: string
}

export interface JelesMessage {
  text: string
  microChallenge?: string
  followUp?: ConversationStage
}

export type ConversationStage = 'greeting' | 'diagnosis' | 'challenge' | 'checkin' | 'pivot'

// ─── Map ContextProfile → JelesProfile ───────────────────────────────────────

function budgetLevel(budget: string): 'low' | 'mid' | 'high' {
  if (!budget) return 'mid'
  const b = budget.toLowerCase()
  if (b.includes('under') || b.includes('500')) return 'low'
  if (b.includes('1,500') || b.includes('3,000') || b.includes('3000')) return 'mid'
  if (b.includes('5,000') || b.includes('5000') || b.includes('above') || b.includes('unlimited')) return 'high'
  return 'mid'
}

function deriveStuckPattern(profile: ContextProfile): string {
  const s = profile.situation?.toLowerCase() ?? ''
  if (s.includes('student')) return 'studying without applying anything'
  if (s.includes('job')) return 'updating CV but never reaching out to real people'
  if (s.includes('freelance') || s.includes('side')) return 'taking client work but never building your own brand'
  if (s.includes('entrepreneur')) return 'refining the plan instead of launching'
  if (s.includes('employ')) return 'staying comfortable in a role that is not growing you'
  return 'waiting for the right moment that never comes'
}

export function toJelesProfile(ctx: ContextProfile): JelesProfile {
  return {
    name: ctx.situationDetail?.split(' ')[0] ?? '',
    neighborhood: ctx.hangoutArea || ctx.liveArea || 'Addis',
    budget: budgetLevel(ctx.budget),
    timeAvailable: ctx.freeTime || '1–2 hours',
    interests: ctx.interests?.length ? ctx.interests : ['coffee', 'social'],
    stuckPattern: deriveStuckPattern(ctx),
    completedChallenges: [],
    lastBlueprintType: '',
  }
}

// ─── Keyword buckets ──────────────────────────────────────────────────────────

const AVOIDANCE_WORDS = ["can't", 'scared', "don't know", 'not sure', 'maybe later', 'tomorrow', 'stuck', 'lazy', 'tired', 'overwhelmed', 'afraid', 'nervous']
const EXCUSE_WORDS    = ['busy', 'no time', 'no money', 'difficult', 'hard', 'impossible', 'expensive', 'far', 'distance', 'transport']
const WIN_WORDS       = ['did it', 'done', 'finished', 'went', 'tried', 'completed', 'showed up', 'made it', 'actually did', 'i went']
const HELP_WORDS      = ['how', 'explain', 'what is', 'help', "don't understand", 'where do i', 'where should', 'what should', 'advice']
const DOUBT_WORDS     = ['point', "doesn't work", 'waste', 'useless', 'not for me', "won't work", 'doubt', 'realistic', 'impossible']

function detect(input: string, words: string[]): boolean {
  const lower = input.toLowerCase()
  return words.some((w) => lower.includes(w))
}

// ─── Amharic cultural flavor ──────────────────────────────────────────────────

const AMHARIC_PRAISE = ['Gobez!', 'Yigermal!', 'Tiru new!', 'Betam alehu!']
const AMHARIC_NUDGE  = ['Ante yichalal.', 'Anti yichayal.', 'Yihe new?', 'Lela gen ale.']

function praise(): string { return AMHARIC_PRAISE[Math.floor(Math.random() * AMHARIC_PRAISE.length)] }
function nudge(): string  { return AMHARIC_NUDGE[Math.floor(Math.random() * AMHARIC_NUDGE.length)] }

// ─── Addis location library ───────────────────────────────────────────────────

const ADDIS_SPOTS: Record<string, string[]> = {
  coffee:   ['Tomoca on Churchill', "Kaldi's in Bole", 'Mokarar in Kazanchis'],
  creative: ['Zoma Museum', 'Asni Gallery', 'Alliance Ethio-Française'],
  tech:     ['iceaddis', 'Gebeya', 'BlueMoon coworking'],
  fitness:  ['Jan Meda', 'Friendship Park', 'Stadium running track'],
  social:   ['Shiro Meda market', 'Piassa square', 'Meskel Square'],
  business: ['Gabon Business Center', 'AABIC office', 'WeWork Bole'],
  art:      ['Netsa Art Village', 'Zoma Museum', 'Asni Gallery'],
  music:    ['Fendika Cultural Center', 'Jazzamba Lounge', 'Alliance Ethio-Française'],
}

function spot(interests: string[], neighborhood: string): string {
  const interest = interests[0]?.toLowerCase() ?? 'social'
  const key = Object.keys(ADDIS_SPOTS).find((k) => interest.includes(k)) ?? 'social'
  const list = ADDIS_SPOTS[key]
  const venue = list[Math.floor(Math.random() * list.length)]
  return `${venue} (near ${neighborhood})`
}

// ─── Budget-aware micro-challenge ─────────────────────────────────────────────

function microChallenge(profile: JelesProfile): string {
  const place = spot(profile.interests, profile.neighborhood)
  if (profile.budget === 'low')
    return `Go to ${place} today — just show up, no spending needed. Presence alone breaks the pattern.`
  if (profile.budget === 'mid')
    return `Go to ${place} and talk to one person about your goal. Coffee is on you — 60 birr, maximum.`
  return `Book a session or event at ${place} before 8 PM tonight. You have the means — the only missing thing is the decision.`
}

// ─── Main response engine ─────────────────────────────────────────────────────

export function getJelesResponse(
  userInput: string,
  profile: JelesProfile,
  stage: ConversationStage
): JelesMessage {
  const name = profile.name || 'you'

  // WIN detection — celebrate first, then push deeper
  if (detect(userInput, WIN_WORDS)) {
    return {
      text: `${praise()} ${name}, you actually did it. That is not small — most people do not even start. What felt hardest about it?`,
      followUp: 'challenge',
    }
  }

  // DOUBT — address the "what's the point" spiral
  if (detect(userInput, DOUBT_WORDS)) {
    return {
      text: `That doubt is the pattern protecting itself. "${profile.stuckPattern}" — your brain has convinced you it is safer to stay here. It is not. One small proof to yourself is worth more than 10 plans. ${nudge()}`,
      microChallenge: microChallenge(profile),
      followUp: 'pivot',
    }
  }

  // HELP / EXPLANATION
  if (detect(userInput, HELP_WORDS)) {
    return {
      text: `Sure. Your pattern — "${profile.stuckPattern}" — usually means you are waiting for the perfect moment. There is no perfect moment in Addis. There is only now. Want me to break down your next step concretely?`,
      followUp: 'diagnosis',
    }
  }

  // EXCUSES
  if (detect(userInput, EXCUSE_WORDS)) {
    return {
      text: `${nudge()} I hear you — "${userInput.slice(0, 60)}" is a real constraint. But ${profile.timeAvailable} is enough for a micro-step. You do not need a full plan today.`,
      microChallenge: microChallenge(profile),
      followUp: 'pivot',
    }
  }

  // AVOIDANCE
  if (detect(userInput, AVOIDANCE_WORDS)) {
    return {
      text: `That feeling? That is the TOHI loop talking, not you. You have been here before and you moved. What is the smallest possible action you could take in the next hour?`,
      microChallenge: microChallenge(profile),
      followUp: 'challenge',
    }
  }

  // STAGE-BASED FALLBACKS
  const stageResponses: Record<ConversationStage, JelesMessage> = {
    greeting: {
      text: `Selam ${name}! I am Jeles — your pattern-breaking friend. I see your loop: "${profile.stuckPattern}". You are not alone in this. Ready to break it today?`,
      followUp: 'diagnosis',
    },
    diagnosis: {
      text: `Here is what I see: you keep hitting the same wall because the goal feels too big. So let us make it tiny. One action, one place in ${profile.neighborhood}, today.`,
      microChallenge: microChallenge(profile),
      followUp: 'challenge',
    },
    challenge: {
      text: `Your move, ${name}. The 24hr clock is running. ${nudge()} What is stopping you right now — for real?`,
      followUp: 'checkin',
    },
    checkin: {
      text: `It is check-in time. Did you take the step? No judgment — just tell me what happened and we will go from there.`,
      followUp: 'pivot',
    },
    pivot: {
      text: `The big challenge did not happen. That is fine — most first attempts do not. Here is a smaller door into the same room:`,
      microChallenge: microChallenge(profile),
      followUp: 'challenge',
    },
  }

  return stageResponses[stage]
}
