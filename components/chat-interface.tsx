'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useProfile } from '@/app/context/ProfileContext'
import { CareerBlueprintCard } from '@/components/career-blueprint'
import { ResultsCard } from '@/components/results-card'
import { QuickActionGrid } from '@/components/quick-action-grid'
import { QuickActionResult } from '@/components/quick-action-result'
import type { AgentResponse } from '@/lib/response-engine'
import type { QuickActionBlueprint } from '@/lib/quick-action-engine'

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl self-start" style={{ background: 'rgba(255,255,255,0.05)' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full animate-loading-dot"
          style={{ background: '#00FF88', animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </div>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function UserBubble({ content }: { content: string }) {
  return (
    <div className="self-end max-w-[80%]">
      <div
        className="px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed text-white"
        style={{ background: 'rgba(0,255,136,0.12)', border: '1px solid rgba(0,255,136,0.2)' }}
      >
        {content}
      </div>
    </div>
  )
}

// ─── Contextual answer bubble ─────────────────────────────────────────────────

function ContextualAnswerBubble({
  answer,
  followUpPrompts,
  onFollowUp,
}: {
  answer: string
  followUpPrompts: string[]
  onFollowUp: (q: string) => void
}) {
  return (
    <div className="self-start max-w-[90%] flex flex-col gap-3">
      <div
        className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed text-white"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
      >
        {answer}
      </div>
      {followUpPrompts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {followUpPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => onFollowUp(q)}
              className="text-xs px-3 py-1.5 rounded-full transition-all duration-200 text-left hover:opacity-80 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#A0A0A0' }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Agent response renderer ──────────────────────────────────────────────────

function AgentResponseRenderer({
  response,
  onFollowUp,
  onReset,
}: {
  response: AgentResponse
  onFollowUp: (q: string) => void
  onReset: () => void
}) {
  if (response.type === 'career_blueprint') {
    return (
      <div className="self-start w-full">
        {response.contextNote && (
          <p className="text-xs mb-3 px-1" style={{ color: '#A0A0A0' }}>
            Profile: {response.contextNote}
          </p>
        )}
        <CareerBlueprintCard blueprint={response.blueprint} onAskFollowUp={onFollowUp} />
      </div>
    )
  }

  if (response.type === 'pattern_break') {
    return (
      <div className="self-start w-full">
        {response.contextNote && (
          <p className="text-xs mb-3 px-1" style={{ color: '#A0A0A0' }}>
            Profile: {response.contextNote}
          </p>
        )}
        <ResultsCard data={response.data} onShareCard={() => {}} onReset={onReset} />
      </div>
    )
  }

  if (response.type === 'contextual_answer') {
    return (
      <ContextualAnswerBubble
        answer={response.answer}
        followUpPrompts={response.followUpPrompts}
        onFollowUp={onFollowUp}
      />
    )
  }

  if (response.type === 'quick_action') {
    return (
      <div className="self-start w-full">
        {response.contextNote && (
          <p className="text-xs mb-3 px-1" style={{ color: '#A0A0A0' }}>
            Profile: {response.contextNote}
          </p>
        )}
        <QuickActionResult blueprint={response.blueprint} onAskFollowUp={onFollowUp} />
      </div>
    )
  }

  return null
}

// ─── Stored chat turn ─────────────────────────────────────────────────────────

interface ChatTurn {
  id: string
  userInput: string
  response: AgentResponse | null
  isLoading: boolean
}

// ─── Starter prompts ──────────────────────────────────────────────────────────

const STARTER_PROMPTS = [
  'How do I become a software developer in Addis?',
  'I keep starting projects but never finish them.',
  'I want to become an entrepreneur — where do I start?',
  'How do I build a network when I barely know anyone?',
  'I keep procrastinating on the most important work.',
  'How do I use my limited time more effectively?',
]

// ─── Main component ───────────────────────────────────────────────────────────

interface ChatInterfaceProps {
  onEditProfile: () => void
  onReturnToHero: () => void
}

export function ChatInterface({ onEditProfile, onReturnToHero }: ChatInterfaceProps) {
  const { profile, conversationHistory, addMessage, clearHistory } = useProfile()
  const [turns, setTurns] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom whenever turns change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [turns])

  const handleSubmit = useCallback(
    async (userInput: string) => {
      if (!userInput.trim() || isSubmitting) return

      const trimmed = userInput.trim()
      setInput('')
      setIsSubmitting(true)

      // Add user message to context memory
      addMessage({
        id: Date.now().toString(),
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString(),
      })

      // Create a loading turn
      const turnId = Date.now().toString()
      setTurns((prev) => [
        ...prev,
        { id: turnId, userInput: trimmed, response: null, isLoading: true },
      ])

      try {
        const res = await fetch('/api/break-pattern', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userInput: trimmed,
            profile: profile ?? undefined,
            conversationHistory: conversationHistory.slice(-6),
            mode: 'chat',
          }),
        })

        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Unknown error')

        const response = json as AgentResponse

        // Persist assistant response to memory
        addMessage({
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.type === 'contextual_answer' ? response.answer : `[${response.type}] ${response.type === 'career_blueprint' ? response.blueprint.title : response.type === 'pattern_break' ? response.data.patternName : ''}`,
          type: response.intent === 'career_path' ? 'career_blueprint' : response.intent,
          timestamp: new Date().toISOString(),
        })

        // Update turn with response
        setTurns((prev) =>
          prev.map((t) =>
            t.id === turnId ? { ...t, response, isLoading: false } : t
          )
        )
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        setTurns((prev) =>
          prev.map((t) =>
            t.id === turnId
              ? {
                  ...t,
                  response: {
                    type: 'contextual_answer',
                    intent: 'contextual_answer',
                    answer: msg,
                    followUpPrompts: [],
                  },
                  isLoading: false,
                }
              : t
          )
        )
      } finally {
        setIsSubmitting(false)
        setTimeout(() => textareaRef.current?.focus(), 100)
      }
    },
    [isSubmitting, profile, conversationHistory, addMessage]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(input)
    }
  }

  const handleClearChat = () => {
    setTurns([])
    clearHistory()
  }

  const area = profile?.hangoutArea || profile?.liveArea || 'Addis'

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0F0F1A' }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: 'rgba(15,15,26,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onReturnToHero}
            className="text-sm transition-opacity hover:opacity-70"
            style={{ color: '#A0A0A0' }}
            aria-label="Back to home"
          >
            ← Back
          </button>
          <div
            className="w-px h-4"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            aria-hidden="true"
          />
          <div>
            <p className="text-sm font-bold text-white">TOHI Agent</p>
            {profile && (
              <p className="text-xs" style={{ color: '#A0A0A0' }}>
                {profile.situation ? `${profile.situation} · ` : ''}{area}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {turns.length > 0 && (
            <button
              onClick={handleClearChat}
              className="text-xs px-3 py-1.5 rounded-lg transition-opacity hover:opacity-70"
              style={{ color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Clear
            </button>
          )}
          <button
            onClick={onEditProfile}
            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-70"
            style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.2)' }}
          >
            {profile?.situation ? 'Edit Profile' : 'Set Profile'}
          </button>
        </div>
      </header>

      {/* Chat body */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          {/* Empty state — quick-action grid + starter prompts */}
          {turns.length === 0 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              {/* Profile greeting */}
              <div className="text-center flex flex-col gap-1 pt-2">
                <h1 className="text-2xl font-bold text-white text-balance">
                  What do you want to break into?
                </h1>
                {profile?.situation && (
                  <p className="text-sm" style={{ color: '#A0A0A0' }}>
                    Personalised for {profile.situation.toLowerCase()} in {area}
                  </p>
                )}
              </div>

              {/* Quick action grid — generates blueprint locally, no API call */}
              <QuickActionGrid
                showDivider
                onActionSelect={(blueprint) => {
                  const turnId = Date.now().toString()
                  const label =
                    blueprint.actionId === 'make_friends' ? 'Make New Friends'
                    : blueprint.actionId === 'learn_skill' ? 'Learn a Skill'
                    : blueprint.actionId === 'new_hobby' ? 'Pick Up a Hobby'
                    : 'Discover Something New'

                  addMessage({
                    id: turnId,
                    role: 'user',
                    content: label,
                    timestamp: new Date().toISOString(),
                  })

                  const response: AgentResponse = {
                    type: 'quick_action',
                    intent: 'quick_action',
                    blueprint,
                    contextNote: profile
                      ? [profile.situation, profile.liveArea, profile.freeTime ? profile.freeTime + ' free' : '']
                          .filter(Boolean)
                          .join(' · ')
                      : '',
                  }

                  addMessage({
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: `[quick_action] ${blueprint.title}`,
                    type: 'quick_action' as const,
                    timestamp: new Date().toISOString(),
                  })

                  setTurns([{ id: turnId, userInput: label, response, isLoading: false }])
                }}
              />

              {/* Fallback text prompts */}
              <div className="grid grid-cols-1 gap-2">
                {STARTER_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSubmit(prompt)}
                    className="text-left px-4 py-3 rounded-xl text-sm leading-relaxed transition-all duration-200 hover:opacity-80 active:scale-95"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat turns */}
          {turns.map((turn) => (
            <div key={turn.id} className="flex flex-col gap-4">
              <UserBubble content={turn.userInput} />
              {turn.isLoading ? (
                <TypingIndicator />
              ) : turn.response ? (
                <AgentResponseRenderer
                  response={turn.response}
                  onFollowUp={(q) => handleSubmit(q)}
                  onReset={() => {
                    setTurns([])
                    clearHistory()
                  }}
                />
              ) : null}
            </div>
          ))}

          <div ref={bottomRef} aria-hidden="true" />
        </div>
      </div>

      {/* Input bar */}
      <div
        className="sticky bottom-0 px-4 py-3"
        style={{ background: 'rgba(15,15,26,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="max-w-xl mx-auto">
          <div
            className="flex items-end gap-2 rounded-2xl p-2 transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                profile
                  ? `Ask TOHI anything — career, patterns, ${area} resources...`
                  : 'Ask me about career paths, stuck patterns, or anything...'
              }
              rows={1}
              className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none resize-none py-2 px-2 leading-relaxed"
              style={{ minHeight: '40px', maxHeight: '160px' }}
              disabled={isSubmitting}
              aria-label="Chat input"
            />
            <button
              onClick={() => handleSubmit(input)}
              disabled={!input.trim() || isSubmitting}
              className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-200 disabled:opacity-30 hover:opacity-80 active:scale-95"
              style={{ background: '#00FF88', color: '#0F0F1A' }}
              aria-label="Send message"
            >
              {isSubmitting ? (
                <span
                  className="w-3 h-3 rounded-full border-2 animate-spin"
                  style={{ borderColor: '#0F0F1A transparent #0F0F1A transparent' }}
                />
              ) : (
                '→'
              )}
            </button>
          </div>
          <p className="text-center text-xs mt-2" style={{ color: 'rgba(160,160,160,0.5)' }}>
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
