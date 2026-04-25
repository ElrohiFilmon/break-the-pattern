import { streamText, convertToModelMessages, type UIMessage } from 'ai'
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

    const system = buildJelesSystemPrompt(profile ?? null)
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      // ──────────────────────────────────────────────────────────────────
      // PATH A — Vercel AI Gateway (default, no API key required)
      // Gemini is zero-config on the Gateway. Just pass a model string.
      // To switch models, change this string (e.g. 'google/gemini-3-flash').
      // ──────────────────────────────────────────────────────────────────
      model: 'google/gemini-3-flash',

      // ──────────────────────────────────────────────────────────────────
      // PATH B — Use your own Gemini API key (direct Google provider)
      // 1. In v0, click the top-right gear → "Vars" and add:
      //      GOOGLE_GENERATIVE_AI_API_KEY = <your Gemini key>
      // 2. Replace the `model:` line above with the two lines below
      //    (and add `import { google } from '@ai-sdk/google'` at the top):
      //
      //      import { google } from '@ai-sdk/google'
      //      ...
      //      model: google('gemini-2.5-flash'),
      //
      // The AI SDK auto-reads GOOGLE_GENERATIVE_AI_API_KEY from env.
      // ──────────────────────────────────────────────────────────────────
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
