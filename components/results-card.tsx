'use client'

import { useState } from 'react'
import type { PatternBreak } from '@/lib/types'

interface ResultsCardProps {
  data: PatternBreak
  onShareCard: () => void
  onReset: () => void
}

export function ResultsCard({ data, onShareCard, onReset }: ResultsCardProps) {
  const [phone, setPhone] = useState('')
  const [reminded, setReminded] = useState(false)

  const handleRemind = () => {
    if (phone.trim()) setReminded(true)
  }

  return (
    <section className="min-h-screen px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-xl flex flex-col gap-5">
        {/* Back button */}
        <button
          onClick={onReset}
          className="self-start flex items-center gap-2 text-sm transition-colors duration-200"
          style={{ color: '#A0A0A0' }}
          aria-label="Go back and try again"
        >
          ← Try another pattern
        </button>

        {/* Header badge */}
        <div className="animate-fade-in-up" style={{ opacity: 0, animationFillMode: 'forwards' }}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: 'rgba(255,45,120,0.15)', border: '1px solid rgba(255,45,120,0.3)', color: '#FF2D78' }}
          >
            Pattern Detected
          </div>
        </div>

        {/* 1. Pattern Detected */}
        <div
          className="glass rounded-2xl p-5 animate-fade-in-up delay-100"
          style={{ opacity: 0, animationFillMode: 'forwards', borderColor: 'rgba(255,45,120,0.2)' }}
        >
          <div className="flex items-start gap-3">
            <span className="text-2xl" aria-hidden="true">🔄</span>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#FF2D78' }}>
                Pattern Detected
              </p>
              <h2 className="text-xl font-bold text-white text-balance">{data.patternName}</h2>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: '#A0A0A0' }}>
                {data.patternDescription}
              </p>
            </div>
          </div>
        </div>

        {/* 2. Why It Repeats */}
        <div
          className="glass rounded-2xl p-5 animate-fade-in-up delay-200"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: '#FFB800' }}>
            Why It Keeps Repeating
          </p>
          <p className="text-sm leading-relaxed" style={{ color: '#FFFFFF' }}>
            {data.whyItRepeats}
          </p>
        </div>

        {/* 3. 24-Hour Challenge */}
        <div
          className="rounded-2xl p-5 animate-fade-in-up delay-300"
          style={{
            opacity: 0,
            animationFillMode: 'forwards',
            background: 'rgba(0,255,136,0.06)',
            border: '1px solid rgba(0,255,136,0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg" aria-hidden="true">⚡</span>
            <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#00FF88' }}>
              Your 24-Hour Challenge
            </p>
          </div>
          <p className="text-base font-semibold leading-relaxed text-white">{data.challenge}</p>
          <div
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(0,255,136,0.15)', color: '#00FF88' }}
          >
            ⏱ Start now · 24 hours
          </div>
        </div>

        {/* 4. 3-Step Action Plan */}
        <div
          className="glass rounded-2xl p-5 animate-fade-in-up delay-400"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: '#FFB800' }}>
            3-Step Action Plan
          </p>
          <div className="flex flex-col gap-4">
            {data.actionPlan.map((step) => (
              <div key={step.step} className="flex gap-3">
                {/* Step badge */}
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: '#FFB800', color: '#0F0F1A' }}
                  aria-label={`Step ${step.step}`}
                >
                  {step.step}
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-sm font-semibold text-white leading-snug">{step.action}</p>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,184,0,0.1)', color: '#FFB800', border: '1px solid rgba(255,184,0,0.2)' }}
                    >
                      📍 {step.location}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      🚌 {step.transport}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      ⏱ {step.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Accountability Check-In */}
        <div
          className="glass rounded-2xl p-5 animate-fade-in-up delay-500"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#A0A0A0' }}>
            Accountability Check-In
          </p>
          <p className="text-sm text-white mb-3">
            {"We'll check in with you in 24 hours. Drop your number or Telegram handle."}
          </p>
          {reminded ? (
            <div
              className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium"
              style={{ background: 'rgba(0,255,136,0.1)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.2)' }}
              role="status"
            >
              ✓ {"You're on the list — we'll remind you in 24 hours!"}
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+251 9__ or @telegram"
                className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  caretColor: '#00FF88',
                }}
                aria-label="Phone or Telegram handle for reminder"
              />
              <button
                onClick={handleRemind}
                disabled={!phone.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40"
                style={{ background: '#00FF88', color: '#0F0F1A' }}
                aria-label="Set 24-hour reminder"
              >
                Remind Me
              </button>
            </div>
          )}
        </div>

        {/* 6. Share Your Break */}
        <div
          className="glass rounded-2xl p-5 animate-fade-in-up delay-600"
          style={{ opacity: 0, animationFillMode: 'forwards' }}
        >
          <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#A0A0A0' }}>
            Share Your Break
          </p>
          <p className="text-sm mb-4" style={{ color: '#FFFFFF' }}>
            Generate your shareable card and inspire others to break their patterns.
          </p>
          <button
            onClick={onShareCard}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300"
            style={{ background: 'rgba(255,45,120,0.15)', color: '#FF2D78', border: '1px solid rgba(255,45,120,0.3)' }}
            aria-label="Generate Pattern Broken share card"
          >
            Generate My Pattern Broken Card ✦
          </button>
          <div className="flex gap-3 mt-3">
            <button
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.08)' }}
              aria-label="Share on Instagram (visual only)"
            >
              📸 Instagram
            </button>
            <button
              className="flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.08)' }}
              aria-label="Share on Telegram (visual only)"
            >
              ✈️ Telegram
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
