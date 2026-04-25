'use client'

import type { UserProfile } from '@/lib/user-profile'

interface ProfileBadgeProps {
  profile: UserProfile
  onEdit: () => void
}

export function ProfileBadge({ profile, onEdit }: ProfileBadgeProps) {
  const parts: string[] = []
  if (profile.situation) {
    parts.push(profile.situationDetail ? `${profile.situation} (${profile.situationDetail})` : profile.situation)
  }
  if (profile.liveArea) parts.push(profile.liveArea)
  if (profile.freeTime) parts.push(`${profile.freeTime} free`)
  if (profile.budget) parts.push(profile.budget)

  return (
    <div
      className="flex items-center justify-between gap-3 rounded-xl px-4 py-2.5 animate-fade-in-up"
      style={{
        background: 'rgba(0,255,136,0.06)',
        border: '1px solid rgba(0,255,136,0.15)',
        opacity: 0,
        animationFillMode: 'forwards',
      }}
    >
      <div className="flex items-start gap-2 min-w-0">
        <span
          className="flex-shrink-0 w-5 h-5 mt-0.5 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,255,136,0.2)' }}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="3.5" r="2" fill="#00FF88" />
            <path d="M1 9c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="#00FF88" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
        <p className="text-xs leading-snug truncate" style={{ color: '#A0A0A0' }}>
          <span className="font-semibold" style={{ color: '#00FF88' }}>Your profile: </span>
          {parts.join(' · ')}
        </p>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="flex-shrink-0 text-xs px-2.5 py-1 rounded-lg transition-colors duration-200"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#A0A0A0',
        }}
        aria-label="Edit your profile"
        title="We use this to personalise your challenges"
      >
        Edit profile
      </button>
    </div>
  )
}
