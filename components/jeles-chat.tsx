'use client'

import { useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import type { StoredProfile } from '@/lib/user-profile'

interface JelesChatProps {
  profile: StoredProfile | null
  onClose: () => void
}

const QUICK_PROMPTS = [
  'I keep procrastinating and nothing I try works',
  'I want to quit doomscrolling but I always go back',
  'I think I have an unhealthy relationship with alcohol',
  'I feel stuck and I do not know where to start',
  'I want a challenge to break my current routine',
  'I keep making the same mistake in relationships',
]

function getTextFromParts(parts: unknown[]): string {
  if (!Array.isArray(parts)) return ''
  return parts
    .filter((p): p is { type: 'text'; text: string } => (p as { type: string }).type === 'text')
    .map((p) => p.text)
    .join('')
}

export function JelesChat({ profile, onClose }: JelesChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const { messages, sendMessage, input, setInput, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/jeles',
      prepareSendMessagesRequest: ({ id, messages: msgs }) => ({
        body: {
          id,
          messages: msgs,
          profile,
        },
      }),
    }),
  })

  const isStreaming = status === 'streaming' || status === 'submitted'

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isStreaming])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSend = () => {
    const text = input.trim()
    if (!text || isStreaming) return
    sendMessage({ text })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    if (isStreaming) return
    sendMessage({ text: prompt })
  }

  return (
    <div
      className="relative min-h-screen flex flex-col"
      style={{ background: '#0F0F1A' }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-4 py-4 shrink-0"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg relative shrink-0"
            style={{
              background: 'rgba(0,255,136,0.12)',
              border: '1px solid rgba(0,255,136,0.4)',
              color: '#00FF88',
            }}
            aria-hidden="true"
          >
            J
            <span
              className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
              style={{
                background: '#00FF88',
                border: '2px solid #0F0F1A',
              }}
            />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Jeles</p>
            <p className="text-xs" style={{ color: '#00FF88' }}>
              {isStreaming ? 'typing...' : 'online'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
          style={{
            background: 'rgba(255,255,255,0.06)',
            color: '#A0A0A0',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
          aria-label="Close Jeles"
        >
          Close
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5 max-w-2xl w-full mx-auto">

        {/* Welcome state */}
        {messages.length === 0 && (
          <div className="flex flex-col gap-6 animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <div className="text-center">
              <p className="text-white font-bold text-xl leading-tight text-balance">
                {profile?.situation
                  ? `Hey${profile.liveArea ? `, ${profile.liveArea}` : ''} — I am Jeles.`
                  : 'I am Jeles.'}
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: '#A0A0A0' }}>
                I am here to sit with you, help you understand your patterns, and push you toward real change — no judgement, no shortcuts.
              </p>
            </div>

            {/* Quick prompts */}
            <div>
              <p className="text-xs font-semibold mb-3 tracking-widest uppercase" style={{ color: '#A0A0A0' }}>
                Start with something
              </p>
              <div className="flex flex-col gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="text-left px-4 py-3 rounded-xl text-sm leading-relaxed transition-all duration-200 hover:scale-[1.01]"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#E0E0E0',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message thread */}
        {messages.map((msg) => {
          const isUser = msg.role === 'user'
          const text = getTextFromParts(msg.parts ?? [])
          if (!text) return null

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar — only for Jeles */}
              {!isUser && (
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-1"
                  style={{
                    background: 'rgba(0,255,136,0.12)',
                    border: '1px solid rgba(0,255,136,0.3)',
                    color: '#00FF88',
                  }}
                  aria-hidden="true"
                >
                  J
                </div>
              )}

              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'
                }`}
                style={
                  isUser
                    ? {
                        background: 'rgba(0,255,136,0.15)',
                        border: '1px solid rgba(0,255,136,0.25)',
                        color: '#FFFFFF',
                      }
                    : {
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: '#E8E8E8',
                      }
                }
              >
                {text.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < text.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {isStreaming && (
          <div className="flex gap-3 flex-row">
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mt-1"
              style={{
                background: 'rgba(0,255,136,0.12)',
                border: '1px solid rgba(0,255,136,0.3)',
                color: '#00FF88',
              }}
              aria-hidden="true"
            >
              J
            </div>
            <div
              className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              aria-label="Jeles is typing"
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
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div
        className="shrink-0 px-4 py-4 max-w-2xl w-full mx-auto"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div
          className="flex items-end gap-3 rounded-2xl px-4 py-3"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(0,255,136,0.2)',
          }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell Jeles what is going on..."
            rows={1}
            disabled={isStreaming}
            className="flex-1 resize-none bg-transparent text-white text-sm leading-relaxed outline-none placeholder-[#505050] min-h-[24px] max-h-[120px] overflow-y-auto disabled:opacity-50"
            style={{ caretColor: '#00FF88' }}
            aria-label="Message Jeles"
            onInput={(e) => {
              const el = e.currentTarget
              el.style.height = 'auto'
              el.style.height = Math.min(el.scrollHeight, 120) + 'px'
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isStreaming}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: input.trim() && !isStreaming ? '#00FF88' : 'rgba(0,255,136,0.2)',
            }}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: '#404040' }}>
          Enter to send &middot; Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14 8L2 2L5.5 8L2 14L14 8Z"
        fill="#0F0F1A"
        stroke="#0F0F1A"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}
