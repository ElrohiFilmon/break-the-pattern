import { streamText, convertToModelMessages, type UIMessage } from 'ai'
import { buildJelesSystemPrompt } from '@/lib/jeles-prompt'
import type { UserProfile } from '@/lib/user-profile'

export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    profile,
  }: { messages: UIMessage[]; profile?: UserProfile | null } = await req.json()

  const system = buildJelesSystemPrompt(profile ?? null)

  const result = streamText({
    model: 'openai/gpt-5-mini',
    system,
    messages: await convertToModelMessages(messages),
    temperature: 0.7,
  })

  return result.toUIMessageStreamResponse()
}
