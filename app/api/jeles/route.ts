import { NextRequest, NextResponse } from 'next/server'
import { groq } from '@ai-sdk/groq'
import { generateText } from 'ai'
import { toJelesProfile, type JelesProfile, type ConversationStage } from '@/lib/jeles-engine'
import type { UserProfile } from '@/app/context/ProfileContext'

// ─── Addis location data (mirrors jeles-engine for prompt injection) ──────────

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

function pickSpot(interests: string[], neighborhood: string): string {
  const interest = interests[0]?.toLowerCase() ?? 'social'
  const key = Object.keys(ADDIS_SPOTS).find((k) => interest.includes(k)) ?? 'social'
  const list = ADDIS_SPOTS[key]
  const venue = list[Math.floor(Math.random() * list.length)]
  return `${venue} (near ${neighborhood})`
}

// ─── System prompt builder ────────────────────────────────────────────────────

function buildSystemPrompt(profile: JelesProfile, stage: ConversationStage): string {
  const place = pickSpot(profile.interests, profile.neighborhood)

  const budgetNote =
    profile.budget === 'low'
      ? 'just show up, no spending needed. Presence alone breaks the pattern.'
      : profile.budget === 'mid'
      ? 'talk to one person about your goal. Coffee is on you — 60 birr, maximum.'
      : 'book a session or event before 8 PM tonight. You have the means — the only missing thing is the decision.'

  const microChallengeExample = `Go to ${place} and ${budgetNote}`

  return `You are Jeles, a direct, empathetic pattern-breaking friend for people in Addis Ababa, Ethiopia.

USER PROFILE:
- Name: ${profile.name || 'the user'}
- Neighborhood: ${profile.neighborhood}
- Budget level: ${profile.budget}
- Time available daily: ${profile.timeAvailable}
- Interests: ${profile.interests.join(', ')}
- Their stuck pattern: "${profile.stuckPattern}"

CURRENT CONVERSATION STAGE: ${stage}
Stage flow: greeting → diagnosis → challenge → checkin → pivot

YOUR PERSONALITY:
- Direct, warm, and culturally rooted in Addis Ababa
- Occasionally drop Amharic phrases naturally:
  - For praise: "Gobez!", "Yigermal!", "Tiru new!", "Betam alehu!"
  - As gentle nudges: "Ante yichalal.", "Anti yichayal.", "Lela gen ale."
- Never use generic motivational language — be specific to Addis, to this person, to this moment
- Call out avoidance and excuses with warmth but without sugarcoating
- The TOHI loop (Too Often Held In) is the enemy — the pattern of staying comfortable instead of acting

ADDIS ABABA CONTEXT:
- You know specific venues: Tomoca, Kaldi's, iceaddis, Gebeya, Zoma Museum, Netsa Art Village, Fendika, Jan Meda, Meskel Square
- Suggest micro-challenges tied to real Addis locations and this user's budget
- Micro-challenge example for this user: "${microChallengeExample}"

RESPONSE RULES:
1. Keep the main message concise — 2-4 sentences maximum
2. Micro-challenges must be specific: real place, real time, real budget amount in birr
3. Match the stage:
   - greeting: warm intro, name their stuck pattern, ask if they are ready
   - diagnosis: identify the root wall, give a micro-challenge
   - challenge: call them to act NOW, use an Amharic nudge phrase
   - checkin: ask what happened, no judgment at all
   - pivot: acknowledge the miss, offer a smaller door into the same goal
4. Detect user emotion in their message:
   - WIN words (did it, done, went, tried, completed, showed up): celebrate with Amharic praise then push deeper
   - DOUBT words (what's the point, doesn't work, waste, not for me, won't work): address the pattern protecting itself
   - EXCUSE words (busy, no time, no money, difficult, expensive): acknowledge constraint, give micro-challenge anyway
   - AVOIDANCE words (scared, stuck, tired, overwhelmed, afraid, nervous): name it as the TOHI loop

RESPONSE FORMAT:
Respond ONLY with valid JSON. No markdown, no extra text, just the JSON object:
{
  "text": "your main response here (2-4 sentences)",
  "microChallenge": "specific Addis micro-challenge string, or null if not applicable",
  "followUp": "next stage — exactly one of: greeting, diagnosis, challenge, checkin, pivot"
}`
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { userInput, profile, stage, messages } = body as {
    userInput: string
    profile: JelesProfile
    stage: ConversationStage
    messages?: Array<{ role: 'user' | 'assistant'; content: string }>
  }

  if (!profile) {
    return NextResponse.json({ error: 'Profile is required' }, { status: 400 })
  }

  try {
    const systemPrompt = buildSystemPrompt(profile, stage ?? 'greeting')

    // Build message array: prior history + current user message
    const priorMessages = messages ?? []
    const currentMessage = userInput?.trim()
      ? [{ role: 'user' as const, content: userInput.trim() }]
      : [{ role: 'user' as const, content: '[Start the conversation with a greeting based on the stage]' }]

    const allMessages = [...priorMessages, ...currentMessage]

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      messages: allMessages,
      maxTokens: 350,
      temperature: 0.75,
    })

    // Strip potential markdown code fences before parsing
    const cleaned = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    const parsed = JSON.parse(cleaned)

    return NextResponse.json({
      text: parsed.text ?? text,
      microChallenge: parsed.microChallenge ?? null,
      followUp: parsed.followUp ?? null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Jeles API] Groq error:', message)
    return NextResponse.json(
      { error: 'Jeles is temporarily unavailable. Please try again.' },
      { status: 500 }
    )
  }
}
