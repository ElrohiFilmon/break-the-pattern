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
      // gpt-5-mini is zero-config on the Vercel AI Gateway and supports the
      // long-context, instruction-heavy system prompt Jeles uses.
      // Note: the GPT-5 family ignores custom temperature, so we omit it.
      model: 'openai/gpt-5-mini',
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
