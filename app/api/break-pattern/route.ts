import { NextRequest, NextResponse } from 'next/server'
import { createGroq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import { analyzePattern } from '@/lib/pattern-engine'
import type { UserProfile as LibUserProfile } from '@/lib/user-profile'
import type { ConversationMessage } from '@/app/context/ProfileContext'

const groq = createGroq({ apiKey: process.env.GROQ_API_KEY })

// ─── System prompt for TOHI main chat ────────────────────────────────────────

function buildChatSystemPrompt(profile: LibUserProfile | null): string {
  const area = profile?.hangoutArea || profile?.liveArea || 'Addis Ababa'
  const situation = profile?.situation || ''
  const situationDetail = profile?.situationDetail || ''
  const freeTime = profile?.freeTime || '2–4 hours'
  const budget = profile?.budget || '500–1,500 birr'
  const interests = profile?.interests?.join(', ') || 'general interests'
  const networkSize = profile?.networkSize || ''
  const meetingStyle = profile?.meetingStyle || ''

  return `You are TOHI, an intelligent personal development assistant for people in Addis Ababa, Ethiopia.
TOHI stands for "Too Often Held In" — you help users identify and break the patterns keeping them stuck.

USER CONTEXT:
- Location: ${area}, Addis Ababa
- Situation: ${situation}${situationDetail ? ` (${situationDetail})` : ''}
- Free time daily: ${freeTime}
- Monthly budget: ${budget}
- Interests: ${interests}
${networkSize ? `- Network size: ${networkSize}` : ''}
${meetingStyle ? `- Preferred meeting style: ${meetingStyle}` : ''}

YOUR ROLE:
- Provide sharp, personalised guidance rooted in the Addis Ababa context
- Reference real Addis venues when suggesting actions: Tomoca, Kaldi's, iceaddis, Gebeya, Zoma Museum, Netsa Art Village, Fendika Cultural Center, Jan Meda, Meskel Square, Alliance Ethio-Française
- Give concrete, actionable advice calibrated to this person's budget and available time
- If they describe a recurring loop or stuck pattern, name it clearly and give one specific micro-challenge to break it
- Keep responses focused — 3-5 sentences. Avoid generic advice.
- When relevant, suggest follow-up questions that are specific to their situation

RESPONSE FORMAT:
Respond ONLY with valid JSON. No markdown, no extra text outside the JSON:
{
  "answer": "your main response (3-5 focused sentences)",
  "followUpPrompts": ["short follow-up question 1", "short follow-up question 2", "short follow-up question 3"]
}`
}

// ─── Route handler ────────────────────────────────────────────────────────────

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
    // ── Chat / agent mode — powered by Groq ──────────────────────────────────
    if (mode === 'chat') {
      const systemPrompt = buildChatSystemPrompt(profile ?? null)

      // Include last 8 messages of history for context
      const priorMessages = (conversationHistory ?? [])
        .slice(-8)
        .map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }))

      const { text } = await generateText({
        model: groq('llama-3.3-70b-versatile'),
        system: systemPrompt,
        messages: [...priorMessages, { role: 'user', content: userInput.trim() }],
        maxTokens: 500,
        temperature: 0.7,
      })

      const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
      const parsed = JSON.parse(cleaned)

      return NextResponse.json({
        type: 'contextual_answer',
        intent: 'contextual_answer',
        answer: parsed.answer ?? text,
        followUpPrompts: parsed.followUpPrompts ?? [],
      })
    }

    // ── Legacy pattern-break mode — local analyzePattern ────────────────────
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
