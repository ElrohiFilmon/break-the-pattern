'use client'

import { useProfile } from '@/app/context/ProfileContext'
import { generateQuickActionBlueprint, type QuickActionId, type QuickActionBlueprint } from '@/lib/quick-action-engine'

// ─── Action definitions ───────────────────────────────────────────────────────

const QUICK_ACTIONS: {
  id: QuickActionId
  label: string
  emoji: string
  gradientFrom: string
  gradientTo: string
  description: string
}[] = [
  {
    id: 'make_friends',
    label: 'Make New Friends',
    emoji: '👥',
    gradientFrom: '#00FF88',
    gradientTo: '#00D4FF',
    description: 'Build your social circle in Addis',
  },
  {
    id: 'learn_skill',
    label: 'Learn a Skill',
    emoji: '🎯',
    gradientFrom: '#FFB800',
    gradientTo: '#FF8800',
    description: 'Master something valuable',
  },
  {
    id: 'new_hobby',
    label: 'Pick Up a Hobby',
    emoji: '🎨',
    gradientFrom: '#FF2D78',
    gradientTo: '#FF6B9D',
    description: 'Find your creative outlet',
  },
  {
    id: 'discover',
    label: 'Discover Something New',
    emoji: '✨',
    gradientFrom: '#9D4EDD',
    gradientTo: '#C77DFF',
    description: 'Explore the unexpected',
  },
]

// ─── Single button ────────────────────────────────────────────────────────────

function QuickActionButton({
  action,
  onClick,
}: {
  action: (typeof QUICK_ACTIONS)[number]
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group relative p-5 rounded-2xl overflow-hidden text-left transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      style={{
        background: `linear-gradient(135deg, ${action.gradientFrom}18, ${action.gradientTo}10)`,
        border: `1px solid ${action.gradientFrom}30`,
      }}
      aria-label={action.label}
    >
      {/* Glassmorphic overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-200 group-hover:opacity-0"
        style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        aria-hidden="true"
      />

      {/* Shine sweep on hover */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 opacity-10"
        style={{ background: 'linear-gradient(90deg, transparent, #ffffff, transparent)' }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-2">
        <span
          className="text-4xl leading-none transition-transform duration-200 group-hover:scale-110"
          role="img"
          aria-hidden="true"
        >
          {action.emoji}
        </span>
        <h3 className="text-sm font-bold text-white leading-tight">{action.label}</h3>
        <p className="text-xs leading-snug" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {action.description}
        </p>
      </div>
    </button>
  )
}

// ─── Grid ─────────────────────────────────────────────────────────────────────

interface QuickActionGridProps {
  onActionSelect: (blueprint: QuickActionBlueprint) => void
  /** Show the "or describe your own" divider below the grid */
  showDivider?: boolean
}

export function QuickActionGrid({ onActionSelect, showDivider = true }: QuickActionGridProps) {
  const { profile } = useProfile()

  function handleClick(actionId: QuickActionId) {
    const blueprint = generateQuickActionBlueprint(actionId, profile)
    onActionSelect(blueprint)
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white text-balance mb-1">
          What do you want to break into?
        </h2>
        <p className="text-sm" style={{ color: '#A0A0A0' }}>
          Choose a path — we will build you a personalised blueprint for Addis
        </p>
      </div>

      {/* 2x2 on mobile, 1x4 on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <QuickActionButton
            key={action.id}
            action={action}
            onClick={() => handleClick(action.id)}
          />
        ))}
      </div>

      {/* Divider */}
      {showDivider && (
        <div className="flex items-center gap-4 mt-8">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <span className="text-xs shrink-0" style={{ color: '#606060' }}>
            or describe your own pattern below
          </span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        </div>
      )}
    </div>
  )
}
