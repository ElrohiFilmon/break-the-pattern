'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import type { StoredProfile } from '@/lib/user-profile'

interface JelesChatProps {
  profile: StoredProfile | null
  onClose: () => void
}

const QUICK_PROMPTS: { label: string; prompt: string }[] = [
  {
    label: 'I keep procrastinating',
    prompt:
      "I keep procrastinating on the things that actually matter to me. I default to my phone, then feel guilty at night. Help me see what's really going on and give me one challenge for this week.",
  },
  {
    label: 'Doomscrolling at night',
    prompt:
      "I scroll TikTok / Instagram for hours every night before sleep, even when I am tired. I want to break this loop without quitting social media completely.",
  },
  {
    label: 'Drinking too much',
    prompt:
      "I think I am drinking more than I should. It is becoming a pattern after work and on weekends. Help me look at this honestly.",
  },
  {
    label: 'Smoking / chewing chat',
    prompt:
      "I want to cut down on smoking (or chewing chat). I have tried before and relapsed. What would actually work this time?",
  },
  {
    label: "I can't focus on work",
    prompt:
      "I sit down to work and within 10 minutes I am on my phone, then on YouTube. I lose entire days like this. Help me build a real focus pattern.",
  },
  {
    label: 'I feel stuck',
    prompt:
      "I feel stuck in the same loop every week and I do not know what to change first. Help me find the one thing worth breaking.",
  },
]

export function JelesChat({ profile, onClose }: JelesChatProps) {
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/jeles',
        prepareSendMessagesRequest: ({ messages, id }) => ({
          body: { messages, id, profile },
        }),
      }),
    [profile]
  )

  const { messages, sendMessage, status, error, stop } = useChat({ transport })

  // Auto-scroll on new messages / streaming
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, status])

  const isStreaming = status === 'streaming' || status === 'submitted'

  const handleSend = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isStreaming) return
    sendMessage({ text: trimmed })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input)
    }
  }

  return (
    <section
      className="relative min-h-screen flex flex-col"
      style={{ background: '#0F0F1A' }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-20 border-b backdrop-blur-xl"
        style={{
          background: 'rgba(15,15,26,0.85)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            style={{ color: '#A0A0A0' }}
            aria-label="Close Jeles and return home"
          >
            <span aria-hidden="true">←</span> Back
          </button>

          <div className="flex items-center gap-3">
            <div
              className="relative w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: 'rgba(0,255,136,0.12)',
                border: '1px solid rgba(0,255,136,0.4)',
                color: '#00FF88',
              }}
              aria-hidden="true"
            >
              J
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  background: '#00FF88',
                  borderColor: '#0F0F1A',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">Jeles</p>
              <p className="text-xs" style={{ color: '#00FF88' }}>
                AI coach · habits & patterns
              </p>
            </div>
          </div>

          <div className="w-12" aria-hidden="true" />
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
          {messages.length === 0 && (
            <WelcomeState
              profile={profile}
              onPick={(p) => handleSend(p)}
              disabled={isStreaming}
            />
          )}

          {messages.map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

          {status === 'submitted' && <ThinkingIndicator />}

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm"
              style={{
                background: 'rgba(255,45,120,0.08)',
                border: '1px solid rgba(255,45,120,0.3)',
                color: '#FF2D78',
              }}
            >
              Something went wrong reaching Jeles. Try sending again.
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div
        className="sticky bottom-0 border-t backdrop-blur-xl"
        style={{
          background: 'rgba(15,15,26,0.92)',
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="glass rounded-2xl p-1">
            <div className="flex items-end gap-2 px-3 py-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tell Jeles what you're stuck on…"
                rows={1}
                className="flex-1 resize-none bg-transparent py-2 text-white text-base leading-relaxed outline-none placeholder-[#A0A0A0] max-h-40"
                style={{ caretColor: '#00FF88' }}
                aria-label="Message Jeles"
                disabled={isStreaming}
              />
              {isStreaming ? (
                <button
                  onClick={stop}
                  className="shrink-0 h-10 px-4 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: 'rgba(255,45,120,0.15)',
                    border: '1px solid rgba(255,45,120,0.4)',
                    color: '#FF2D78',
                  }}
                  aria-label="Stop Jeles"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => handleSend(input)}
                  disabled={!input.trim()}
                  className="shrink-0 h-10 px-4 rounded-xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: '#00FF88',
                    color: '#0F0F1A',
                  }}
                  aria-label="Send message to Jeles"
                >
                  Send
                </button>
              )}
            </div>
          </div>
          <p
            className="mt-2 text-[11px] text-center"
            style={{ color: '#A0A0A0' }}
          >
            Jeles is an AI coach, not a substitute for medical or psychiatric care.
          </p>
        </div>
      </div>
    </section>
  )
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function WelcomeState({
  profile,
  onPick,
  disabled,
}: {
  profile: StoredProfile | null
  onPick: (prompt: string) => void
  disabled: boolean
}) {
  const greeting = profile?.situation
    ? `Selam. I see you're ${labelForSituation(profile.situation)}${
        profile.liveArea ? ` around ${profile.liveArea}` : ''
      }.`
    : 'Selam. I’m Jeles.'

  return (
    <div className="flex flex-col items-center text-center gap-4 py-6">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
        style={{
          background: 'rgba(0,255,136,0.1)',
          border: '1px solid rgba(0,255,136,0.4)',
          color: '#00FF88',
        }}
        aria-hidden="true"
      >
        J
      </div>
      <div className="max-w-md">
        <h2 className="text-2xl font-bold text-white text-balance">
          {greeting}
        </h2>
        <p
          className="mt-2 text-sm leading-relaxed"
          style={{ color: '#A0A0A0' }}
        >
          I’m here to help you break unhealthy habits, addictions, and
          procrastination loops. Tell me what’s actually going on — or pick
          a starting point below.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q.label}
            onClick={() => onPick(q.prompt)}
            disabled={disabled}
            className="text-left rounded-xl px-4 py-3 text-sm font-medium transition-all hover:scale-[1.01] disabled:opacity-50"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#FFFFFF',
            }}
          >
            <span className="block" style={{ color: '#00FF88' }}>
              ›
            </span>
            {q.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = useMemo(() => extractText(message), [message])
  const isUser = message.role === 'user'

  if (!text && !isUser) return null

  return (
    <div
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-in-up`}
      style={{ animationDuration: '0.3s' }}
    >
      {!isUser && (
        <div
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{
            background: 'rgba(0,255,136,0.12)',
            border: '1px solid rgba(0,255,136,0.4)',
            color: '#00FF88',
          }}
          aria-hidden="true"
        >
          J
        </div>
      )}

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
          isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'
        }`}
        style={
          isUser
            ? {
                background: '#00FF88',
                color: '#0F0F1A',
                fontWeight: 500,
              }
            : {
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#FFFFFF',
              }
        }
      >
        {text}
      </div>
    </div>
  )
}

function ThinkingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
      <div
        className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
        style={{
          background: 'rgba(0,255,136,0.12)',
          border: '1px solid rgba(0,255,136,0.4)',
          color: '#00FF88',
        }}
        aria-hidden="true"
      >
        J
      </div>
      <div
        className="rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1.5"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
        aria-label="Jeles is thinking"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full animate-loading-dot"
            style={{
              background: '#00FF88',
              animationDelay: `${i * 0.16}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function extractText(message: UIMessage): string {
  if (!message.parts || !Array.isArray(message.parts)) return ''
  return message.parts
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')
}

function labelForSituation(s: string): string {
  switch (s) {
    case 'Student':
      return 'a student'
    case 'Job seeking':
      return 'job seeking'
    case 'Freelancer/Side hustler':
      return 'freelancing / side-hustling'
    case 'Entrepreneur':
      return 'building something'
    case 'Employed':
      return 'working full-time'
    default:
      return s.toLowerCase()
  }
}
