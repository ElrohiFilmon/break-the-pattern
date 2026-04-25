'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserProfile {
  situation: string
  situationDetail?: string
  liveArea: string
  hangoutArea: string
  accessPoints: string[]
  freeTime: string
  budget: string
  transport: string[]
  networkSize: string
  interests: string[]
  meetingStyle: string
  completedSurvey: boolean
}

export interface ConversationMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  type?: 'pattern_break' | 'career_blueprint' | 'contextual_answer' | 'quick_action'
  timestamp: string
}

interface ProfileContextType {
  profile: UserProfile | null
  setProfile: (profile: UserProfile) => void
  clearProfile: () => void
  conversationHistory: ConversationMessage[]
  addMessage: (message: ConversationMessage) => void
  clearHistory: () => void
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const PROFILE_KEY = 'tohiUserProfile'
const HISTORY_KEY = 'tohiConversationHistory'
const MAX_HISTORY = 30

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile | null>(null)
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const rawProfile = localStorage.getItem(PROFILE_KEY)
      if (rawProfile) setProfileState(JSON.parse(rawProfile))

      const rawHistory = localStorage.getItem(HISTORY_KEY)
      if (rawHistory) setConversationHistory(JSON.parse(rawHistory))
    } catch {
      // Silently ignore parse errors
    }
  }, [])

  const setProfile = useCallback((newProfile: UserProfile) => {
    setProfileState(newProfile)
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile))
    } catch { /* storage full */ }
  }, [])

  const clearProfile = useCallback(() => {
    setProfileState(null)
    try {
      localStorage.removeItem(PROFILE_KEY)
    } catch { /* ignore */ }
  }, [])

  const addMessage = useCallback((message: ConversationMessage) => {
    setConversationHistory((prev) => {
      const updated = [...prev, message].slice(-MAX_HISTORY)
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated))
      } catch { /* storage full */ }
      return updated
    })
  }, [])

  const clearHistory = useCallback(() => {
    setConversationHistory([])
    try {
      localStorage.removeItem(HISTORY_KEY)
    } catch { /* ignore */ }
  }, [])

  return (
    <ProfileContext.Provider
      value={{ profile, setProfile, clearProfile, conversationHistory, addMessage, clearHistory }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile(): ProfileContextType {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}
