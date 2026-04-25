import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { buildJelesSystemPrompt } from '@/lib/jeles-prompt'
import type { UserProfile } from '@/lib/user-profile'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const {
      messages,
      profile,
    }: { messages: UIMessage[]; profile?: UserProfile | null } = await req.json()

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Read the key fresh on every request so module-load caching can't strand
    // us with `apiKey: undefined`. Accept either GEMINI (user's chosen name)
    // or the SDK's default GOOGLE_GENERATIVE_AI_API_KEY.
    const apiKey =
      process.env.GEMINI ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      ''

    console.log('[v0] Jeles env check:', {
      hasGEMINI: Boolean(process.env.GEMINI),
      hasGoogleDefault: Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY),
      keyLength: apiKey.length,
    })

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            'Missing GEMINI environment variable. Add your Gemini API key in v0: top-right gear → Vars → GEMINI.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build the provider per-request with the fresh key.
    const google = createGoogleGenerativeAI({ apiKey })

    const system = buildJelesSystemPrompt(profile ?? null)
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system,
      messages: modelMessages,
    })

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error('[v0] Jeles stream error:', error)
        return error instanceof Error
          ? error.message
          : 'Jeles could not respond. Please try again.'
      },
    })
  } catch (err) {
    console.error('[v0] Jeles route error:', err)
    const message =
      err instanceof Error ? err.message : 'Unknown error reaching Jeles.'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
