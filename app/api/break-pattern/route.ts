import { NextRequest, NextResponse } from 'next/server'
import { analyzePattern } from '@/lib/pattern-engine'
import { generateContextualResponse } from '@/lib/response-engine'
import type { UserProfile as LibUserProfile } from '@/lib/user-profile'
import type { UserProfile as ContextUserProfile, ConversationMessage } from '@/app/context/ProfileContext'

// ─── Helper: map lib UserProfile fields to ContextUserProfile ─────────────────
function toContextProfile(profile: LibUserProfile): ContextUserProfile {
  return {
    situation: profile.situation,
    situationDetail: profile.situationDetail,
    liveArea: profile.liveArea,
    hangoutArea: profile.hangoutArea,
    accessPoints: profile.accessPoints,
    freeTime: profile.freeTime,
    budget: profile.budget,
    transport: profile.transport,
    networkSize: profile.networkSize,
    interests: profile.interests,
    meetingStyle: profile.meetingStyle,
    completedSurvey: true,
  }
}

const EMPTY_CONTEXT_PROFILE: ContextUserProfile = {
  situation: '',
  situationDetail: '',
  liveArea: '',
  hangoutArea: '',
  accessPoints: [],
  freeTime: '',
  budget: '',
  transport: [],
  networkSize: '',
  interests: [],
  meetingStyle: '',
  completedSurvey: false,
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    userInput,
    profile,
    conversationHistory,
    mode,
  } = body as {
    userInput: string
    profile?: LibUserProfile
    conversationHistory?: ConversationMessage[]
    mode?: 'chat' | 'pattern_break'
  }

  if (!userInput || userInput.trim().length < 10) {
    return NextResponse.json(
      { error: 'Please describe your pattern in more detail (at least 10 characters).' },
      { status: 400 }
    )
  }

  try {
    // ── Chat / agent mode ── routes through the multi-intent response engine
    if (mode === 'chat') {
      const contextProfile: ContextUserProfile = profile ? toContextProfile(profile) : EMPTY_CONTEXT_PROFILE
      const history: ConversationMessage[] = conversationHistory ?? []

      const response = generateContextualResponse({
        userInput: userInput.trim(),
        profile: contextProfile,
        conversationHistory: history,
      })

      return NextResponse.json(response)
    }

    // ── Legacy pattern-break mode ── direct analyzePattern call
    const result = analyzePattern(userInput.trim(), profile ?? null)
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[PatternBreaker] engine error:', message)
    return NextResponse.json(
      { error: 'Could not analyze your pattern. Please try again.' },
      { status: 500 }
    )
  }
}
