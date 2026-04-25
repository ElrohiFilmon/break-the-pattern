import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { buildJelesSystemPrompt } from '@/lib/jeles-prompt'
import type { UserProfile } from '@/lib/user-profile'

export const maxDuration = 60

// Use the user's own Gemini API key, stored in the `GEMINI` env var.
// Configure it in v0: top-right gear → Vars → add key `GEMINI`.
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI,
})

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

    const system = buildJelesSystemPrompt(profile ?? null)
    const modelMessages = await convertToModelMessages(messages)

    if (!process.env.GEMINI) {
      return new Response(
        JSON.stringify({
          error:
            'Missing GEMINI environment variable. Add your Gemini API key in v0: top-right gear → Vars → GEMINI.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const result = streamText({
      // Direct Google Generative AI provider, authenticated with the user's
      // own Gemini key from the `GEMINI` env var (configured above).
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
