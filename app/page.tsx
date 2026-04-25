'use client'

import { useState, useCallback, useEffect } from 'react'
import { HeroSection } from '@/components/hero-section'
import { LoadingSequence } from '@/components/loading-sequence'
import { ResultsCard } from '@/components/results-card'
import { PatternBrokenCard } from '@/components/pattern-broken-card'
import { ErrorState } from '@/components/error-state'
import { Survey } from '@/components/survey'
import { ChatInterface } from '@/components/chat-interface'
import { QuickActionGrid } from '@/components/quick-action-grid'
import { useProfile } from '@/app/context/ProfileContext'
import type { PatternBreak } from '@/lib/types'
import type { UserProfile as LibUserProfile } from '@/lib/user-profile'
import { loadProfile, saveProfile } from '@/lib/user-profile'
import type { StoredProfile } from '@/lib/user-profile'
import type { UserProfile as ContextUserProfile } from '@/app/context/ProfileContext'

type AppState = 'hydrating' | 'survey' | 'idle' | 'loading' | 'results' | 'error' | 'chat'

// ─── Helper: convert StoredProfile -> ContextUserProfile ──────────────────────
function toContextProfile(stored: StoredProfile): ContextUserProfile {
  return {
    situation: stored.situation,
    situationDetail: stored.situationDetail,
    liveArea: stored.liveArea,
    hangoutArea: stored.hangoutArea,
    accessPoints: stored.accessPoints,
    freeTime: stored.freeTime,
    budget: stored.budget,
    transport: stored.transport,
    networkSize: stored.networkSize,
    interests: stored.interests,
    meetingStyle: stored.meetingStyle,
    completedSurvey: stored.completedSurvey,
  }
}

export default function Home() {
  const { setProfile: setContextProfile } = useProfile()

  const [appState, setAppState] = useState<AppState>('hydrating')
  const [results, setResults] = useState<PatternBreak | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showCard, setShowCard] = useState(false)
  const [profile, setLocalProfile] = useState<StoredProfile | null>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadProfile()
    if (stored?.completedSurvey) {
      setLocalProfile(stored)
      // Sync into ProfileContext so chat can read it
      setContextProfile(toContextProfile(stored))
      setAppState('idle')
    } else {
      setAppState('survey')
    }
  }, [setContextProfile])

  const handleSurveyComplete = useCallback(
    (answers: LibUserProfile) => {
      const stored = saveProfile(answers, profile)
      setLocalProfile(stored)
      setContextProfile(toContextProfile(stored))
      setAppState('idle')
    },
    [profile, setContextProfile]
  )

  const handleSurveySkip = useCallback(() => {
    const minimal: LibUserProfile = {
      situation: '', situationDetail: '',
      liveArea: '', hangoutArea: '', accessPoints: [],
      freeTime: '', budget: '', transport: [],
      networkSize: '', interests: [], meetingStyle: '',
    }
    const stored = saveProfile(minimal, null)
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('tohiUserProfile')
      if (raw) {
        const parsed = JSON.parse(raw)
        parsed.completedSurvey = true
        localStorage.setItem('tohiUserProfile', JSON.stringify(parsed))
      }
    }
    setLocalProfile(stored)
    setContextProfile(toContextProfile(stored))
    setAppState('idle')
  }, [setContextProfile])

  const handleEditProfile = useCallback(() => {
    setAppState('survey')
  }, [])

  const handleSubmit = useCallback(
    async (userInput: string) => {
      setAppState('loading')
      setErrorMessage('')

      const [data] = await Promise.all([
        fetch('/api/break-pattern', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userInput, profile: profile ?? undefined }),
        }).then(async (res) => {
          const json = await res.json()
          if (!res.ok) throw new Error(json.error ?? 'Unknown error')
          return json as PatternBreak
        }),
        new Promise<void>((resolve) => setTimeout(resolve, 3500)),
      ])

      setResults(data)
      setAppState('results')
    },
    [profile]
  )

  const handleError = useCallback((message: string) => {
    setErrorMessage(message)
    setAppState('error')
  }, [])

  const wrappedSubmit = useCallback(
    async (userInput: string) => {
      try {
        await handleSubmit(userInput)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        handleError(msg)
      }
    },
    [handleSubmit, handleError]
  )

  const handleReset = useCallback(() => {
    setAppState('idle')
    setResults(null)
    setShowCard(false)
    setErrorMessage('')
  }, [])

  if (appState === 'hydrating') return null

  // Full-screen chat mode — no surrounding layout needed
  if (appState === 'chat') {
    return (
      <ChatInterface
        onEditProfile={handleEditProfile}
        onReturnToHero={() => setAppState('idle')}
      />
    )
  }

  return (
    <main className="relative min-h-screen" style={{ background: '#0F0F1A' }}>
      {appState === 'survey' && (
        <div key="survey" className="animate-fade-in">
          <Survey
            onComplete={handleSurveyComplete}
            onSkip={handleSurveySkip}
            existingProfile={profile}
          />
        </div>
      )}

      {appState === 'idle' && (
        <div key="idle" className="animate-fade-in flex flex-col">
          {/* Quick-action grid — shown after survey, before the textarea */}
          <div className="px-6 pt-10 pb-2 max-w-4xl mx-auto w-full">
            <QuickActionGrid
              showDivider
              onActionSelect={() => setAppState('chat')}
            />
          </div>

          <HeroSection
            onSubmit={wrappedSubmit}
            isLoading={false}
            profile={profile}
            onEditProfile={handleEditProfile}
            onOpenChat={() => setAppState('chat')}
          />
        </div>
      )}

      {appState === 'loading' && (
        <div key="loading" className="animate-fade-in">
          <LoadingSequence />
        </div>
      )}

      {appState === 'results' && results && (
        <div key="results" className="animate-fade-in">
          <ResultsCard
            data={results}
            onShareCard={() => setShowCard(true)}
            onReset={handleReset}
          />
        </div>
      )}

      {appState === 'error' && (
        <div key="error" className="animate-fade-in">
          <ErrorState message={errorMessage} onRetry={handleReset} />
        </div>
      )}

      {showCard && results && (
        <PatternBrokenCard data={results} onClose={() => setShowCard(false)} />
      )}
    </main>
  )
}
