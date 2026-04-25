/**
 * TOHI Response Engine
 *
 * Detects intent from user input and routes to the right generator.
 * All responses are personalised with profile + conversation history.
 */

import type { UserProfile, ConversationMessage } from '@/app/context/ProfileContext'
import { analyzePattern } from '@/lib/pattern-engine'
import { generateCareerBlueprint, type CareerBlueprint } from '@/lib/career-path-engine'
import type { PatternBreakResult } from '@/lib/pattern-engine'
import type { QuickActionBlueprint } from '@/lib/quick-action-engine'

// ─── Response types ───────────────────────────────────────────────────────────

export type Intent = 'career_path' | 'pattern_break' | 'contextual_answer' | 'quick_action'

export interface QuickActionResponse {
  type: 'quick_action'
  intent: 'quick_action'
  blueprint: QuickActionBlueprint
  contextNote: string
}

export interface CareerBlueprintResponse {
  type: 'career_blueprint'
  intent: 'career_path'
  blueprint: CareerBlueprint
  contextNote: string
}

export interface PatternBreakResponse {
  type: 'pattern_break'
  intent: 'pattern_break'
  data: PatternBreakResult
  contextNote: string
}

export interface ContextualAnswerResponse {
  type: 'contextual_answer'
  intent: 'contextual_answer'
  answer: string
  followUpPrompts: string[]
}

export type AgentResponse =
  | CareerBlueprintResponse
  | PatternBreakResponse
  | ContextualAnswerResponse
  | QuickActionResponse

// ─── Intent detection ─────────────────────────────────────────────────────────

export function detectIntent(input: string): Intent {
  const lower = input.toLowerCase()

  // Career path — must be checked before pattern_break to avoid false positives
  if (
    /\b(become a|how do i become|career|get into|want to be|path to|i want to work as|transition to)\b/.test(lower) ||
    /\b(developer|designer|entrepreneur|manager|engineer|artist|writer|marketer|analyst|creator|accountant|banker|coder|programmer)\b/.test(lower) ||
    /how (do i|can i|should i) (get|start|become|enter|break into|learn)\b/.test(lower)
  ) {
    return 'career_path'
  }

  // Pattern break — stuck loops, repeating behaviour
  if (
    /\b(stuck|loop|keep (doing|saying|failing|procrastinating|delaying)|pattern|break|can't stop|always end up|every week|every night|never (finish|start|follow through))\b/.test(lower) ||
    /i (always|never|keep|can't seem to)\b/.test(lower)
  ) {
    return 'pattern_break'
  }

  return 'contextual_answer'
}

// ─── Context-aware prompt builder ─────────────────────────────────────────────

function buildContextSentence(profile: UserProfile, history: ConversationMessage[]): string {
  const parts: string[] = []

  if (profile.situation) parts.push(`You are ${profile.situation.toLowerCase()}`)
  if (profile.liveArea) parts.push(`based in ${profile.liveArea}`)
  if (profile.freeTime) parts.push(`with ${profile.freeTime} free daily`)
  if (profile.budget) parts.push(`and a ${profile.budget} monthly budget`)

  const base = parts.length > 0 ? `${parts.join(', ')}.` : ''

  if (history.length > 0) {
    const recentTopic = history
      .filter((m) => m.role === 'user')
      .slice(-1)[0]?.content
      ?.split(' ')
      .slice(0, 8)
      .join(' ')
    if (recentTopic) return `${base} Based on your recent question about "${recentTopic}..." here is a personalised response.`
  }

  return base
}

// ─── Contextual answer generator ─────────────────────────────────────────────

function generateContextualAnswer(
  input: string,
  profile: UserProfile,
  history: ConversationMessage[]
): ContextualAnswerResponse {
  const lower = input.toLowerCase()
  const area = profile.hangoutArea || profile.liveArea || 'Addis'
  const freeTime = profile.freeTime || '2–4 hours'
  const budget = profile.budget || '500–1,500 birr'
  const situation = profile.situation || ''
  const recentMessages = history.slice(-4)

  let answer = ''
  let followUpPrompts: string[] = []

  // Time / schedule questions
  if (/\b(time|schedule|plan|daily|routine|hour|morning|evening)\b/.test(lower)) {
    answer = `With ${freeTime} free daily as ${situation ? 'a ' + situation.toLowerCase() : 'someone'} in ${area}, the most effective structure is: use the first 20 minutes to identify the single most important action, spend 80% of your time on that one thing, and save the last 20 minutes to plan tomorrow. Most people in ${area} lose their limited hours to low-priority tasks because they never commit to one clear priority before they start.`
    followUpPrompts = [
      'What is my biggest time waster right now?',
      'How do I build a morning routine that sticks?',
      'How do I make progress when I only have 30 minutes?',
    ]
  }

  // Networking / connections questions
  else if (/\b(network|connect|meet|people|community|friends|contacts)\b/.test(lower)) {
    answer = `In ${area}, the most reliable way to build a genuine network is through recurring, low-pressure environments — not one-off events. Identify one weekly event (a community, class, or meetup) in or near ${area} that is relevant to your interests (${profile.interests?.join(', ') || 'your field'}) and commit to attending for 4 consecutive weeks. Showing up consistently is what converts strangers into contacts. ${profile.meetingStyle?.includes('One-on-one') ? 'Since you prefer one-on-one conversations, focus on getting coffee with one person you meet at each event rather than trying to work the whole room.' : ''}`
    followUpPrompts = [
      'What events or communities exist in ' + area + ' for my field?',
      'How do I follow up after meeting someone?',
      'How do I network when I am introverted?',
    ]
  }

  // Motivation / energy questions
  else if (/\b(motivation|energy|tired|burnout|lazy|procrastinat|discipline|focus|distract)\b/.test(lower)) {
    answer = `Motivation is unreliable — it follows action, not the other way around. The most effective thing for someone in your situation (${situation || 'navigating this stage'} in ${area}) is to reduce the activation energy for the first step to almost zero. Instead of "I will work on my goal for 2 hours", commit to "I will open my laptop and do one thing for 5 minutes". The brain almost always continues past 5 minutes once it starts. The pattern you are experiencing is likely tied to the gap between the size of your goal and the size of your daily action.`
    followUpPrompts = [
      'How do I stop procrastinating on important work?',
      'What is the pattern behind my lack of discipline?',
      'How do I build momentum when I feel stuck?',
    ]
  }

  // Money / budget questions
  else if (/\b(money|budget|afford|pay|cost|birr|income|salary|earn)\b/.test(lower)) {
    answer = `With ${budget} monthly to invest in your development, prioritise in this order: community access first (most Telegram groups, iceaddis events, and Gebeya programs are free or under 100 birr), tools second (Figma, Google Analytics, and GitHub are free), and paid courses last. The most expensive mistake in ${area} is paying for courses before you have validated whether the direction is right. Use free resources until you have spent 60+ hours exploring the field — then invest.`
    followUpPrompts = [
      'What free resources exist for my goal in Addis?',
      'How do I invest my budget effectively?',
      'What is the cheapest path to ' + (recentMessages.find(m => m.role === 'user')?.content?.split(' ').slice(0, 5).join(' ') || 'my goal') + '?',
    ]
  }

  // Default contextual answer
  else {
    const contextSentence = buildContextSentence(profile, history)
    answer = `${contextSentence} Based on what you are describing and your situation as ${situation || 'someone'} in ${area}: the most important thing right now is to act on the smallest possible version of what you are trying to do — not the full plan, not after more preparation, but one concrete step in the next 24 hours. What would that look like for you?`
    followUpPrompts = [
      'What is the smallest action I can take today?',
      'How do I break this into a step-by-step plan?',
      'What is holding me back from starting?',
    ]
  }

  return {
    type: 'contextual_answer',
    intent: 'contextual_answer',
    answer,
    followUpPrompts,
  }
}

// ─── Profile context note ─────────────────────────────────────────────────────

function contextNote(profile: UserProfile): string {
  const parts: string[] = []
  if (profile.situation) parts.push(profile.situationDetail ? `${profile.situation} (${profile.situationDetail})` : profile.situation)
  if (profile.liveArea) parts.push(profile.liveArea)
  if (profile.freeTime) parts.push(profile.freeTime + ' free')
  if (profile.budget) parts.push(profile.budget)
  return parts.join(' · ')
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface ResponseContext {
  userInput: string
  profile: UserProfile
  conversationHistory: ConversationMessage[]
}

export function generateContextualResponse(ctx: ResponseContext): AgentResponse {
  const { userInput, profile, conversationHistory } = ctx
  const intent = detectIntent(userInput)
  const note = contextNote(profile)

  switch (intent) {
    case 'career_path': {
      const blueprint = generateCareerBlueprint(userInput, profile)
      return {
        type: 'career_blueprint',
        intent: 'career_path',
        blueprint,
        contextNote: note,
      }
    }

    case 'pattern_break': {
      const data = analyzePattern(userInput, profile)
      return {
        type: 'pattern_break',
        intent: 'pattern_break',
        data,
        contextNote: note,
      }
    }

    default: {
      return generateContextualAnswer(userInput, profile, conversationHistory)
    }
  }
}
