'use client'

import { Briefcase, Users, BookOpen, Palette } from 'lucide-react'

export type Niche = 'job' | 'connect' | 'skill' | 'hobby'

interface NicheButtonsProps {
  onSelect: (niche: Niche) => void
}

const NICHES: Array<{
  id: Niche
  title: string
  subtitle: string
  Icon: typeof Briefcase
  accent: string
}> = [
  {
    id: 'job',
    title: 'Find a Job',
    subtitle: 'Map of hiring spots & openings',
    Icon: Briefcase,
    accent: '#00FF88',
  },
  {
    id: 'connect',
    title: 'Connect with People',
    subtitle: 'Match your character & traits',
    Icon: Users,
    accent: '#FF2D78',
  },
  {
    id: 'skill',
    title: 'Learn a New Skill',
    subtitle: 'Books, videos, communities',
    Icon: BookOpen,
    accent: '#FFB800',
  },
  {
    id: 'hobby',
    title: 'Start a Hobby',
    subtitle: 'Groups, gear & inspiration',
    Icon: Palette,
    accent: '#00B8FF',
  },
]

export function NicheButtons({ onSelect }: NicheButtonsProps) {
  return (
    <div
      className="w-full animate-fade-in-up delay-400"
      style={{ opacity: 0, animationFillMode: 'forwards' }}
    >
      <p
        className="text-xs font-semibold tracking-widest uppercase text-center mb-3"
        style={{ color: '#A0A0A0' }}
      >
        Or jump straight into a niche
      </p>
      <div className="grid grid-cols-2 gap-4">
        {NICHES.map(({ id, title, subtitle, Icon, accent }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="group flex flex-col items-start gap-2 rounded-2xl p-4 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${accent}33`,
            }}
            aria-label={`Start agent in ${title} niche`}
          >
            <span
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300"
              style={{ background: `${accent}1A`, border: `1px solid ${accent}40` }}
              aria-hidden="true"
            >
              <Icon size={20} color={accent} strokeWidth={2} />
            </span>
            <span className="text-sm font-bold text-white leading-tight">{title}</span>
            <span className="text-xs leading-snug" style={{ color: '#A0A0A0' }}>
              {subtitle}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
