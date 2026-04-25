'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { toJelesProfile, type ConversationStage, type JelesProfile } from '@/lib/jeles-engine'
import { useProfile } from '@/app/context/ProfileContext'

type Msg = { from: 'jeles' | 'user'; text: string; extra?: string }
type ApiMsg = { role: 'user' | 'assistant'; content: string }
type JelesApiResponse = { text: string; microChallenge?: string | null; followUp?: ConversationStage | null }

export function JelesChat() {
  const { profile } = useProfile()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [apiMsgs, setApiMsgs] = useState<ApiMsg[]>([])
  const [input, setInput] = useState('')
  const [stage, setStage] = useState<ConversationStage>('greeting')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasGreeted = useRef(false)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  // Focus input when panel opens
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const callJeles = useCallback(
    async (userInput: string, jelesProfile: JelesProfile, currentStage: ConversationStage, history: ApiMsg[]) => {
      setTyping(true)
      try {
        const res = await fetch('/api/jeles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInput,
            profile: jelesProfile,
            stage: currentStage,
            messages: history,
          }),
        })

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }

        const data: JelesApiResponse = await res.json()

        const extra = data.microChallenge
          ? `Micro-challenge: ${data.microChallenge}`
          : undefined

        setMsgs((prev) => [...prev, { from: 'jeles', text: data.text, extra }])
        setApiMsgs((prev) => [...prev, { role: 'assistant', content: data.text }])

        if (data.followUp) setStage(data.followUp)
      } catch {
        setMsgs((prev) => [
          ...prev,
          { from: 'jeles', text: 'Something went wrong. Give it a moment and try again.' },
        ])
      } finally {
        setTyping(false)
      }
    },
    []
  )

  // Opening greeting — fires once when panel opens and profile exists
  useEffect(() => {
    if (open && !hasGreeted.current && profile) {
      hasGreeted.current = true
      const jelesProfile = toJelesProfile(profile)
      callJeles('', jelesProfile, 'greeting', [])
    }
  }, [open, profile, callJeles])

  function send() {
    if (!input.trim() || !profile || typing) return
    const text = input.trim()
    setMsgs((prev) => [...prev, { from: 'user', text }])
    const newApiMsgs: ApiMsg[] = [...apiMsgs, { role: 'user', content: text }]
    setApiMsgs(newApiMsgs)
    setInput('')
    const jelesProfile = toJelesProfile(profile)
    callJeles(text, jelesProfile, stage, newApiMsgs)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  function toggleOpen() {
    setOpen((prev) => !prev)
  }

  // Don't render if no profile yet — Jeles needs context to personalise
  if (!profile?.completedSurvey) return null

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={toggleOpen}
        aria-label={open ? 'Close Jeles chat' : 'Open Jeles, your pattern-breaking friend'}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full font-bold text-base shadow-lg transition-transform hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          background: '#00FF88',
          color: '#0F0F1A',
          boxShadow: '0 0 24px rgba(0,255,136,0.35)',
        }}
      >
        J
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="Jeles — your pattern-breaking friend"
          className="fixed bottom-24 right-4 z-50 flex flex-col rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: 'min(92vw, 380px)',
            height: '70vh',
            background: 'rgba(15,15,26,0.97)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: '#00FF88', color: '#0F0F1A' }}
            >
              J
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm leading-tight">Jeles</p>
              <p className="text-xs leading-tight" style={{ color: '#00FF88' }}>
                Your Pattern-Breaking Friend
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-sm flex-shrink-0 transition-opacity hover:opacity-60 focus-visible:outline-none"
              style={{ color: '#A0A0A0' }}
            >
              x
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[82%] rounded-2xl px-4 py-3 text-sm space-y-2 leading-relaxed"
                  style={
                    m.from === 'user'
                      ? {
                          background: 'rgba(0,255,136,0.12)',
                          color: '#FFFFFF',
                          borderBottomRightRadius: 4,
                        }
                      : {
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#E0E0E0',
                          borderBottomLeftRadius: 4,
                        }
                  }
                >
                  <p>{m.text}</p>
                  {m.extra && (
                    <p
                      className="text-xs font-medium pt-2 leading-relaxed"
                      style={{
                        color: '#FFB800',
                        borderTop: '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      {m.extra}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start">
                <div
                  className="flex gap-1 px-4 py-3 rounded-2xl items-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderBottomLeftRadius: 4,
                  }}
                  aria-label="Jeles is typing"
                >
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        background: '#00FF88',
                        animationDelay: `${i * 0.15}s`,
                        display: 'block',
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
            className="px-3 py-3 flex gap-2 flex-shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Talk to Jeles..."
              className="flex-1 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-500 outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
              aria-label="Message Jeles"
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="px-4 py-2 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
              style={{ background: '#00FF88', color: '#0F0F1A' }}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
