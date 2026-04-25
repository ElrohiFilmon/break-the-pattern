'use client'

import type { QuickActionBlueprint } from '@/lib/quick-action-engine'

const ACTION_COLORS: Record<string, { accent: string; dim: string }> = {
  make_friends: { accent: '#00FF88', dim: 'rgba(0,255,136,0.12)' },
  learn_skill:  { accent: '#FFB800', dim: 'rgba(255,184,0,0.12)'  },
  new_hobby:    { accent: '#FF2D78', dim: 'rgba(255,45,120,0.12)' },
  discover:     { accent: '#C77DFF', dim: 'rgba(199,125,255,0.12)' },
}

function fallbackColors() {
  return { accent: '#00FF88', dim: 'rgba(0,255,136,0.12)' }
}

interface QuickActionResultProps {
  blueprint: QuickActionBlueprint
  onAskFollowUp?: (question: string) => void
}

export function QuickActionResult({ blueprint, onAskFollowUp }: QuickActionResultProps) {
  const colors = ACTION_COLORS[blueprint.actionId] ?? fallbackColors()

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* Header */}
      <div
        className="rounded-2xl p-5"
        style={{ background: colors.dim, border: `1px solid ${colors.accent}25` }}
      >
        <h2 className="text-xl font-bold text-white mb-1 text-balance">{blueprint.title}</h2>
        <p className="text-xs mb-3" style={{ color: colors.accent }}>
          {blueprint.subtitle}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {blueprint.intro}
        </p>
      </div>

      {/* 24-hr Challenge */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-3"
          style={{ color: colors.accent }}
        >
          {blueprint.immediate24hrChallenge.title}
        </p>
        <p className="text-sm font-semibold text-white leading-snug mb-2">
          {blueprint.immediate24hrChallenge.challenge}
        </p>
        <p className="text-xs leading-relaxed mb-3" style={{ color: '#A0A0A0' }}>
          {blueprint.immediate24hrChallenge.why}
        </p>
        <div
          className="text-xs px-3 py-2 rounded-lg"
          style={{ background: 'rgba(255,255,255,0.05)', color: '#A0A0A0' }}
        >
          <span className="font-semibold text-white">Proof: </span>
          {blueprint.immediate24hrChallenge.proof}
        </div>
      </div>

      {/* Weekly actions */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: colors.accent }}
        >
          This Week
        </p>
        <div className="flex flex-col gap-4">
          {blueprint.weeklyActions.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                style={{ background: colors.dim, color: colors.accent }}
              >
                {i + 1}
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-xs font-semibold" style={{ color: colors.accent }}>
                  {step.day}
                </p>
                <p className="text-sm text-white leading-snug">{step.action}</p>
                <p className="text-xs" style={{ color: '#606060' }}>
                  {step.location} · {step.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly goal */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-2"
          style={{ color: colors.accent }}
        >
          {blueprint.monthlyGoal.title}
        </p>
        <p className="text-sm font-semibold text-white mb-3">{blueprint.monthlyGoal.target}</p>
        <ul className="flex flex-col gap-1.5">
          {blueprint.monthlyGoal.milestones.map((m, i) => (
            <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
              <span className="mt-0.5 flex-shrink-0" style={{ color: colors.accent }}>
                ›
              </span>
              {m}
            </li>
          ))}
        </ul>
      </div>

      {/* Addis resources */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: colors.accent }}
        >
          Addis Resources
        </p>
        <div className="flex flex-col gap-3">
          {blueprint.addisResources.map((r, i) => (
            <div
              key={i}
              className="rounded-xl p-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <p className="text-sm font-semibold text-white mb-0.5">{r.name}</p>
              <p className="text-xs mb-1" style={{ color: '#A0A0A0' }}>{r.type}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                <span className="text-xs" style={{ color: '#606060' }}>{r.access}</span>
                <span className="text-xs font-medium" style={{ color: colors.accent }}>{r.cost}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Best for: {r.bestFor}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern shifts */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-4"
          style={{ color: colors.accent }}
        >
          Pattern Shifts
        </p>
        <div className="flex flex-col gap-4">
          {blueprint.patternShifts.map((shift, i) => (
            <div key={i} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs">
                <span style={{ color: '#606060' }}>{shift.from}</span>
                <span style={{ color: colors.accent }}>→</span>
                <span className="font-semibold text-white">{shift.to}</span>
              </div>
              <p className="text-xs leading-relaxed pl-0" style={{ color: '#808080' }}>
                {shift.example}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Follow-up prompts */}
      {onAskFollowUp && (
        <div className="flex flex-wrap gap-2">
          {[
            'Give me more detail on the 24-hour challenge',
            'What if I have very limited time this week?',
            'How do I stay accountable?',
          ].map((q, i) => (
            <button
              key={i}
              onClick={() => onAskFollowUp(q)}
              className="text-xs px-3 py-1.5 rounded-full transition-opacity duration-200 hover:opacity-70 active:scale-95 text-left"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: '#A0A0A0',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
