import { NextRequest, NextResponse } from 'next/server'
import { analyzePattern } from '@/lib/pattern-engine'
import type { UserProfile } from '@/lib/user-profile'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userInput, profile } = body as { userInput: string; profile?: UserProfile }

  if (!userInput || userInput.trim().length < 10) {
    return NextResponse.json(
      { error: 'Please describe your pattern in more detail (at least 10 characters).' },
      { status: 400 }
    )
  }

  try {
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
