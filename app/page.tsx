'use client'

import { useState, useCallback, useEffect } from 'react'
import { HeroSection } from '@/components/hero-section'
import { LoadingSequence } from '@/components/loading-sequence'
import { ResultsCard } from '@/components/results-card'
import { PatternBrokenCard } from '@/components/pattern-broken-card'
import { ErrorState } from '@/components/error-state'
import { Survey } from '@/components/survey'
import type { PatternBreak } from '@/lib/types'
import type { StoredProfile } from '@/lib/user-profile'
import { loadProfile, saveProfile } from '@/lib/user-profile'
import type { UserProfile } from '@/lib/user-profile'

type AppState = 'hydrating' | 'survey' | 'idle' | 'loading' | 'results' | 'error'

export default function Home() {
  const [appState, setAppState] = useState<AppState>('hydrating')
  const [results, setResults] = useState<PatternBreak | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [showCard, setShowCard] = useState(false)
  const [profile, setProfile] = useState<StoredProfile | null>(null)

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = loadProfile()
    if (stored?.completedSurvey) {
      setProfile(stored)
      setAppState('idle')
    } else {
      setAppState('survey')
    }
  }, [])

  const handleSurveyComplete = useCallback((answers: UserProfile) => {
    const stored = saveProfile(answers, profile)
    setProfile(stored)
    setAppState('idle')
  }, [profile])

  const handleSurveySkip = useCallback(() => {
    // Save a minimal profile so we don't re-show the survey every session
    const minimal: UserProfile = {
      situation: '', situationDetail: '',
      liveArea: '', hangoutArea: '', accessPoints: [],
      freeTime: '', budget: '', transport: [],
      networkSize: '', interests: [], meetingStyle: '',
    }
    const stored = saveProfile(minimal, null)
    // Mark as "skipped" — still avoids re-prompting
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('tohiUserProfile')
      if (raw) {
        const parsed = JSON.parse(raw)
        parsed.completedSurvey = true
        localStorage.setItem('tohiUserProfile', JSON.stringify(parsed))
      }
    }
    setProfile(stored)
    setAppState('idle')
  }, [])

  const handleEditProfile = useCallback(() => {
    setAppState('survey')
  }, [])

  const handleSubmit = useCallback(async (userInput: string) => {
    setAppState('loading')
    setErrorMessage('')

    const [data] = await Promise.all([
      fetch('/api/break-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput,
          profile: profile ?? undefined,
        }),
      }).then(async (res) => {
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Unknown error')
        return json as PatternBreak
      }),
      new Promise((resolve) => setTimeout(resolve, 3500)),
    ])

    setResults(data)
    setAppState('results')
  }, [profile])

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

  // Avoid flash of survey before hydration completes
  if (appState === 'hydrating') return null

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
        <div key="idle" className="animate-fade-in">
          <HeroSection
            onSubmit={wrappedSubmit}
            isLoading={false}
            profile={profile}
            onEditProfile={handleEditProfile}
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
