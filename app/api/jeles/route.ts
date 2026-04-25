import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { buildJelesSystem } from '@/lib/jeles-system'
import type { StoredProfile } from '@/lib/user-profile'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const messages: UIMessage[] = body.messages ?? []
    const profile: StoredProfile | null = body.profile ?? null

    if (!messages.length) {
      return new Response(JSON.stringify({ error: 'No messages provided.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = process.env.GEMINI
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error:
            'GEMINI API key is not set. Add it in v0: top-right gear → Vars → key name: GEMINI',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const google = createGoogleGenerativeAI({ apiKey })
    const system = buildJelesSystem(profile)
    const modelMessages = await convertToModelMessages(messages)

    const result = streamText({
      model: google('gemini-2.0-flash'),
      system,
      messages: modelMessages,
      maxOutputTokens: 1024,
    })

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error('[Jeles] stream error:', error)
        return 'Something went wrong. Please try again.'
      },
    })
  } catch (error) {
    console.error('[Jeles] unhandled error:', error)
    return new Response(
      JSON.stringify({ error: 'Unexpected server error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
