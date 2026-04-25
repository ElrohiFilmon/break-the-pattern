'use client'

import { useState } from 'react'
import type { CareerBlueprint, CareerPhase, AddisResource, PatternShift, Milestone } from '@/lib/career-path-engine'

interface CareerBlueprintProps {
  blueprint: CareerBlueprint
  onAskFollowUp?: (question: string) => void
}

// ─── Resource type label ──────────────────────────────────────────────────────

const RESOURCE_TYPE_STYLES: Record<AddisResource['type'], { label: string; color: string; bg: string }> = {
  location: { label: 'Location', color: '#FFB800', bg: 'rgba(255,184,0,0.1)' },
  community: { label: 'Community', color: '#00FF88', bg: 'rgba(0,255,136,0.1)' },
  event: { label: 'Event', color: '#FF2D78', bg: 'rgba(255,45,120,0.1)' },
  program: { label: 'Program', color: '#A78BFA', bg: 'rgba(167,139,250,0.1)' },
  platform: { label: 'Platform', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)' },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  return (
    <div
      className="flex gap-3 p-4 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div
        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
        style={{ background: '#FFB800', color: '#0F0F1A' }}
        aria-label={`Milestone ${index + 1}`}
      >
        {index + 1}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-white leading-snug">{milestone.title}</p>
        <p className="text-xs leading-relaxed" style={{ color: '#A0A0A0' }}>{milestone.description}</p>
        <p
          className="text-xs font-medium mt-1 px-2 py-1 rounded-md inline-block"
          style={{ background: 'rgba(0,255,136,0.08)', color: '#00FF88', border: '1px solid rgba(0,255,136,0.15)' }}
        >
          Proof: {milestone.proof}
        </p>
      </div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: AddisResource }) {
  const style = RESOURCE_TYPE_STYLES[resource.type]
  return (
    <div
      className="p-4 rounded-xl flex flex-col gap-2"
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-bold text-white leading-snug">{resource.name}</p>
        <span
          className="flex-shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ background: style.bg, color: style.color }}
        >
          {style.label}
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: '#A0A0A0' }}>{resource.description}</p>
      <p
        className="text-xs leading-relaxed"
        style={{ color: '#00FF88' }}
      >
        How to access: {resource.howToAccess}
      </p>
    </div>
  )
}

function PatternShiftCard({ shift, onAskFollowUp }: { shift: PatternShift; onAskFollowUp?: (q: string) => void }) {
  return (
    <div
      className="p-4 rounded-xl flex flex-col gap-3"
      style={{
        background: 'linear-gradient(135deg, rgba(255,45,120,0.06) 0%, rgba(0,255,136,0.06) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-xs">
          <span
            className="px-2 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(255,45,120,0.12)', color: '#FF2D78' }}
          >
            From
          </span>
          <span style={{ color: '#A0A0A0' }}>{shift.from}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className="px-2.5 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(0,255,136,0.12)', color: '#00FF88' }}
          >
            To
          </span>
          <span className="text-white">{shift.to}</span>
        </div>
      </div>
      <div
        className="p-3 rounded-lg"
        style={{ background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.15)' }}
      >
        <p className="text-xs font-bold mb-1" style={{ color: '#FFB800' }}>24-Hour Challenge</p>
        <p className="text-sm text-white leading-relaxed">{shift.firstChallenge}</p>
      </div>
      {onAskFollowUp && (
        <button
          onClick={() => onAskFollowUp(`Tell me more about how to: ${shift.to}`)}
          className="self-start text-xs font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: '#00FF88' }}
        >
          Ask for help with this shift
        </button>
      )}
    </div>
  )
}

function PhaseAccordion({
  phase,
  index,
  isOpen,
  onToggle,
  onAskFollowUp,
}: {
  phase: CareerPhase
  index: number
  isOpen: boolean
  onToggle: () => void
  onAskFollowUp?: (q: string) => void
}) {
  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-300"
      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 transition-colors duration-200 text-left"
        style={{ background: isOpen ? 'rgba(0,255,136,0.06)' : 'rgba(255,255,255,0.03)' }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: isOpen ? '#00FF88' : 'rgba(255,255,255,0.1)',
              color: isOpen ? '#0F0F1A' : '#A0A0A0',
            }}
          >
            {index + 1}
          </div>
          <div>
            <p className="text-sm font-bold text-white">{phase.phase}</p>
            <p className="text-xs" style={{ color: '#A0A0A0' }}>{phase.duration}</p>
          </div>
        </div>
        <span
          className="flex-shrink-0 text-lg font-light transition-transform duration-300"
          style={{ color: '#00FF88', transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
        >
          +
        </span>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="flex flex-col gap-5 p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Milestones */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#FFB800' }}>
              Milestones
            </p>
            <div className="flex flex-col gap-2">
              {phase.milestones.map((m, i) => (
                <MilestoneCard key={i} milestone={m} index={i} />
              ))}
            </div>
          </div>

          {/* Addis Resources */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#00FF88' }}>
              Addis Resources
            </p>
            <div className="flex flex-col gap-2">
              {phase.addisResources.map((r, i) => (
                <ResourceCard key={i} resource={r} />
              ))}
            </div>
          </div>

          {/* Pattern Shifts */}
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#FF2D78' }}>
              Pattern Shifts
            </p>
            <div className="flex flex-col gap-2">
              {phase.patternShifts.map((p, i) => (
                <PatternShiftCard key={i} shift={p} onAskFollowUp={onAskFollowUp} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CareerBlueprintCard({ blueprint, onAskFollowUp }: CareerBlueprintProps) {
  const [openPhase, setOpenPhase] = useState(0)

  const toggle = (i: number) => setOpenPhase((prev) => (prev === i ? -1 : i))

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase self-start"
          style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.25)', color: '#00FF88' }}
        >
          Career Blueprint
        </div>
        <h2 className="text-2xl font-bold text-white text-balance leading-snug">{blueprint.title}</h2>
        <p className="text-base font-medium" style={{ color: '#00FF88' }}>{blueprint.subtitle}</p>
        <p className="text-xs" style={{ color: '#A0A0A0' }}>Estimated timeline: {blueprint.timeline}</p>
      </div>

      {/* Personal note */}
      <div
        className="p-4 rounded-xl text-sm leading-relaxed"
        style={{ background: 'rgba(255,184,0,0.06)', border: '1px solid rgba(255,184,0,0.15)', color: '#FFB800' }}
      >
        {blueprint.personalNote}
      </div>

      {/* Timeline bar */}
      <div className="flex gap-1.5" aria-label="Phase progress">
        {blueprint.phases.map((_, i) => (
          <button
            key={i}
            onClick={() => setOpenPhase(i)}
            className="flex-1 h-1.5 rounded-full transition-all duration-300"
            style={{ background: i <= openPhase ? '#00FF88' : 'rgba(255,255,255,0.1)' }}
            aria-label={`Phase ${i + 1}`}
          />
        ))}
      </div>

      {/* Phases */}
      <div className="flex flex-col gap-3">
        {blueprint.phases.map((phase, i) => (
          <PhaseAccordion
            key={i}
            phase={phase}
            index={i}
            isOpen={openPhase === i}
            onToggle={() => toggle(i)}
            onAskFollowUp={onAskFollowUp}
          />
        ))}
      </div>

      {/* Start CTA */}
      {openPhase >= 0 && blueprint.phases[openPhase] && (
        <button
          onClick={() => onAskFollowUp?.(`How do I start Phase ${openPhase + 1}: ${blueprint.phases[openPhase].phase}?`)}
          className="w-full py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(90deg, #00FF88, #FFB800)', color: '#0F0F1A' }}
        >
          Get help starting Phase {openPhase + 1} now
        </button>
      )}
    </div>
  )
}
