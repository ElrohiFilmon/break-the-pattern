'use client'

import { useRef } from 'react'
import type { PatternBreak } from '@/lib/types'

interface PatternBrokenCardProps {
  data: PatternBreak
  onClose: () => void
}

// Ethiopian cross/star geometric motif as SVG
function EthGeometric({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden="true" fill="none">
      {/* Star of Solomon / Seal of Solomon inspired pattern */}
      <polygon points="30,4 34,20 50,20 37,30 41,46 30,36 19,46 23,30 10,20 26,20" stroke="#00FF88" strokeWidth="1.5" fill="none" opacity="0.6" />
      <polygon points="30,12 33,22 43,22 35,28 38,38 30,32 22,38 25,28 17,22 27,22" stroke="#FFB800" strokeWidth="1" fill="none" opacity="0.4" />
      <circle cx="30" cy="30" r="4" fill="#FF2D78" opacity="0.5" />
    </svg>
  )
}

// Ethiopian geometric border pattern
function BorderPattern({ side }: { side: 'top' | 'bottom' }) {
  const units = 12
  return (
    <div className={`w-full flex ${side === 'bottom' ? 'flex-row-reverse' : 'flex-row'}`} aria-hidden="true">
      {Array.from({ length: units }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-3"
          style={{
            background: i % 3 === 0 ? '#00FF88' : i % 3 === 1 ? '#FFB800' : '#FF2D78',
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  )
}

export function PatternBrokenCard({ data, onClose }: PatternBrokenCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  const handleDownload = async () => {
    // Visual-only: notify user to screenshot
    alert('Screenshot this card to save it! Long-press on mobile to save the image.')
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Pattern Broken share card"
    >
      <div className="w-full max-w-xs flex flex-col gap-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="self-end text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: '#A0A0A0', background: 'rgba(255,255,255,0.08)' }}
          aria-label="Close card"
        >
          ✕ Close
        </button>

        {/* Card — 9:16 story ratio */}
        <div
          ref={cardRef}
          className="relative overflow-hidden rounded-3xl flex flex-col"
          style={{
            aspectRatio: '9 / 16',
            background: 'linear-gradient(160deg, #0F0F1A 0%, #12121F 50%, #0F0F1A 100%)',
            border: '2px solid rgba(0,255,136,0.3)',
          }}
        >
          {/* Top border pattern */}
          <div className="absolute top-0 left-0 right-0">
            <BorderPattern side="top" />
          </div>

          {/* Content */}
          <div className="flex flex-col flex-1 px-5 pt-8 pb-6 justify-between">
            {/* Top section */}
            <div className="flex flex-col gap-1">
              {/* Brand */}
              <p className="text-xs tracking-widest font-semibold uppercase" style={{ color: '#A0A0A0' }}>
                TOHI PatternBreaker
              </p>

              {/* Big title */}
              <h2
                className="text-4xl font-black tracking-tight leading-none mt-2"
                style={{ color: '#00FF88', textShadow: '0 0 30px rgba(0,255,136,0.5)' }}
              >
                PATTERN
              </h2>
              <h2
                className="text-4xl font-black tracking-tight leading-none"
                style={{ color: '#FFFFFF' }}
              >
                BROKEN
              </h2>

              {/* Geometric motif */}
              <div className="flex items-center gap-3 mt-2">
                <EthGeometric className="w-10 h-10" />
                <div
                  className="flex-1 h-px"
                  style={{ background: 'linear-gradient(90deg, rgba(0,255,136,0.5), transparent)' }}
                />
              </div>
            </div>

            {/* Middle section */}
            <div className="flex flex-col gap-4">
              {/* Pattern name */}
              <div
                className="rounded-2xl p-4"
                style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)' }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#FF2D78' }}>
                  Loop Broken
                </p>
                <p className="text-base font-bold text-white leading-snug">{data.patternName}</p>
              </div>

              {/* Challenge completed */}
              <div
                className="rounded-2xl p-4"
                style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.2)' }}
              >
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#00FF88' }}>
                  Challenge Accepted
                </p>
                <p className="text-sm text-white leading-snug line-clamp-3">{data.challenge}</p>
              </div>

              {/* Corner decorations */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'City', value: 'Addis Ababa' },
                  { label: 'Date', value: today },
                  { label: 'Hours', value: '24' },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="rounded-xl p-2 text-center"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                  >
                    <p className="text-xs" style={{ color: '#A0A0A0' }}>{label}</p>
                    <p className="text-xs font-bold text-white truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex flex-col gap-2">
              {/* Location & Amharic */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium" style={{ color: '#A0A0A0' }}>
                  📍 Addis Ababa, Ethiopia
                </span>
                <span className="text-xs font-medium" style={{ color: '#00FF88' }}>
                  አዲስ መንገድ ✦
                </span>
              </div>
              {/* Brand footer */}
              <div className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: '#00FF88' }}
                  aria-hidden="true"
                >
                  <span className="text-[8px] font-black text-[#0F0F1A]">T</span>
                </div>
                <span className="text-xs font-bold" style={{ color: '#A0A0A0' }}>
                  TOHI PatternBreaker Addis
                </span>
              </div>
            </div>
          </div>

          {/* Bottom border pattern */}
          <div className="absolute bottom-0 left-0 right-0">
            <BorderPattern side="bottom" />
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={handleDownload}
          className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300"
          style={{ background: '#00FF88', color: '#0F0F1A' }}
          aria-label="Download Pattern Broken card"
        >
          📥 Download Card
        </button>
        <div className="flex gap-3">
          <button
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-label="Share on Instagram (visual only)"
          >
            📸 Instagram
          </button>
          <button
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.1)' }}
            aria-label="Share on Telegram (visual only)"
          >
            ✈️ Telegram
          </button>
        </div>
      </div>
    </div>
  )
}
