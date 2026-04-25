'use client'

import { useState, useEffect, useRef } from 'react'
import { ParticleField } from './particle-field'
import { ProfileBadge } from './profile-badge'
import { NicheButtons, type Niche } from './niche-buttons'
import type { UserProfile } from '@/lib/user-profile'
import { getSituationPlaceholders } from '@/lib/user-profile'

interface HeroSectionProps {
  onSubmit: (input: string) => void
  onSelectNiche?: (niche: Niche) => void
  onOpenJeles?: () => void
  isLoading: boolean
  profile?: UserProfile | null
  onEditProfile?: () => void
}

export function HeroSection({ onSubmit, onSelectNiche, onOpenJeles, isLoading, profile, onEditProfile }: HeroSectionProps) {
  const [input, setInput] = useState('')
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [displayedPlaceholder, setDisplayedPlaceholder] = useState('')
  const [isTyping, setIsTyping] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const PLACEHOLDERS = getSituationPlaceholders(profile ?? null)

  // Cycling placeholder typewriter effect
  useEffect(() => {
    const target = PLACEHOLDERS[placeholderIndex]
    let charIndex = 0
    let timeout: NodeJS.Timeout

    if (isTyping) {
      const type = () => {
        if (charIndex <= target.length) {
          setDisplayedPlaceholder(target.slice(0, charIndex))
          charIndex++
          timeout = setTimeout(type, 40)
        } else {
          timeout = setTimeout(() => setIsTyping(false), 2500)
        }
      }
      type()
    } else {
      const erase = () => {
        if (charIndex >= 0) {
          setDisplayedPlaceholder(target.slice(0, charIndex))
          charIndex--
          timeout = setTimeout(erase, 20)
        } else {
          setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length)
          setIsTyping(true)
        }
      }
      charIndex = target.length
      erase()
    }

    return () => clearTimeout(timeout)
  }, [placeholderIndex, isTyping])

  const handleSubmit = () => {
    if (input.trim().length >= 10 && !isLoading) {
      onSubmit(input.trim())
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) handleSubmit()
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Particle background */}
      <ParticleField />

      {/* Radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,255,136,0.06) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center gap-6">
        {/* Eyebrow tag */}
        <div
          className="animate-fade-in-up"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: 'rgba(0,255,136,0.1)',
              border: '1px solid rgba(0,255,136,0.3)',
              color: '#00FF88',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#00FF88]"
              style={{ animation: 'pulse 2s ease-in-out infinite' }}
            />
            AI Life Coach · Addis Ababa
          </span>
        </div>

        {/* Headline */}
        <div
          className="text-center animate-fade-in-up delay-100"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white text-balance leading-tight">
            Break your loop.{' '}
            <span style={{ color: '#00FF88' }}>Start a new pattern.</span>
          </h1>
          <p
            className="mt-3 text-lg font-medium tracking-wide"
            style={{ color: '#00FF88', fontFamily: 'sans-serif' }}
          >
            አዲስ መንገድ ጀምር
          </p>
        </div>

        {/* Profile badge — shown only when profile exists */}
        {profile && onEditProfile && (
          <div className="w-full animate-fade-in-up delay-200" style={{ opacity: 0, animationFillMode: 'forwards' }}>
            <ProfileBadge profile={profile} onEdit={onEditProfile} />
          </div>
        )}

        {/* Textarea */}
        <div
          className="w-full animate-fade-in-up delay-200"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <div className="glass rounded-2xl p-1 animate-border-glow">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={displayedPlaceholder + (isTyping || displayedPlaceholder.length > 0 ? '|' : '')}
              rows={4}
              className="w-full resize-none rounded-xl bg-transparent px-4 py-4 text-white text-base leading-relaxed outline-none placeholder-[#A0A0A0] transition-all duration-300"
              style={{ caretColor: '#00FF88' }}
              aria-label="Describe your stuck pattern"
              disabled={isLoading}
            />
          </div>
          <p className="mt-2 text-xs text-center" style={{ color: '#A0A0A0' }}>
            Press{' '}
            <kbd className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(255,255,255,0.1)', color: '#A0A0A0' }}>
              ⌘ Enter
            </kbd>{' '}
            to submit · minimum 10 characters
          </p>
        </div>

        {/* CTA Button */}
        <div
          className="w-full animate-fade-in-up delay-300"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <button
            onClick={handleSubmit}
            disabled={input.trim().length < 10 || isLoading}
            className="w-full py-4 px-6 rounded-xl font-bold text-base tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed animate-pulse-glow"
            style={{
              background: input.trim().length >= 10 && !isLoading ? '#00FF88' : 'rgba(0,255,136,0.3)',
              color: '#0F0F1A',
            }}
            aria-label="Generate my pattern break"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingDots />
                Analyzing your pattern...
              </span>
            ) : (
              'Generate My Pattern Break →'
            )}
          </button>
        </div>

        {/* Talk to Jeles launcher */}
        {onOpenJeles && (
          <div
            className="w-full animate-fade-in-up delay-300"
            style={{ opacity: 0, animationFillMode: 'forwards' }}
          >
            <button
              onClick={onOpenJeles}
              className="w-full flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-all duration-300 hover:scale-[1.01]"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(0,255,136,0.25)',
              }}
              aria-label="Open chat with Jeles, the AI life coach"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="relative shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold"
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
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">
                    Talk to Jeles
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: '#A0A0A0' }}
                  >
                    Live coaching · habits, addictions, procrastination
                  </p>
                </div>
              </div>
              <span
                className="shrink-0 text-lg font-bold"
                style={{ color: '#00FF88' }}
                aria-hidden="true"
              >
                →
              </span>
            </button>
          </div>
        )}

        {/* Niche shortcuts — 2x2 grid */}
        {onSelectNiche && (
          <NicheButtons onSelect={onSelectNiche} />
        )}

        {/* Footer tag */}
        <p
          className="text-sm animate-fade-in-up delay-400"
          style={{ color: '#A0A0A0', opacity: 0, animationFillMode: 'forwards' }}
        >
          Built for Addis Ababa{' '}
          <span role="img" aria-label="Ethiopian flag">
            🇪🇹
          </span>
        </p>
      </div>
    </section>
  )
}

function LoadingDots() {
  return (
    <span className="flex gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[#0F0F1A] animate-loading-dot"
          style={{ animationDelay: `${i * 0.16}s` }}
        />
      ))}
    </span>
  )
}
