'use client'

import { useState, useEffect, useCallback } from 'react'
import type { UserProfile } from '@/lib/user-profile'
import { AREAS } from '@/lib/user-profile'
import { ParticleField } from './particle-field'

interface SurveyProps {
  onComplete: (profile: UserProfile) => void
  onSkip: () => void
  existingProfile?: UserProfile | null
}

const SITUATIONS = [
  'Student',
  'Employed',
  'Job seeking',
  'Freelancer/Side hustler',
  'Entrepreneur',
  'Other',
]

const ACCESS_POINTS = [
  'Tech hubs (iceaddis, Gebeya, BlueSpace)',
  'Cafes / coworking spaces',
  'University campuses',
  'Gym / fitness centers',
  'Cultural spaces (theaters, galleries)',
  'Markets (Merkato, Shola, Shiromeda)',
]

const FREE_TIME_OPTIONS = ['Less than 1 hour', '1–2 hours', '2–4 hours', '4+ hours']

const BUDGET_OPTIONS = ['Under 500 birr', '500–1,500 birr', '1,500–3,000 birr', '3,000+ birr']

const TRANSPORT_OPTIONS = [
  'Own vehicle',
  'Ride / Feres regularly',
  'Minibus only',
  'Prefer walking distance',
]

const NETWORK_SIZES = [
  { value: 'Very small', label: 'Very small', sub: 'mostly family' },
  { value: 'Small', label: 'Small', sub: 'few close friends' },
  { value: 'Medium', label: 'Medium', sub: 'active friend group' },
  { value: 'Large', label: 'Large', sub: 'many connections' },
]

const INTEREST_TAGS = [
  'Tech', 'Creative', 'Business', 'Fitness', 'Arts',
  'Social Impact', 'Music', 'Film', 'Writing', 'Design',
]

const MEETING_STYLES = [
  { value: 'One-on-one coffee chats', sub: 'intimate & focused' },
  { value: 'Small group activities (3–5 people)', sub: 'comfortable & social' },
  { value: 'Structured events / workshops', sub: 'organised & purposeful' },
  { value: 'Online first, then in-person', sub: 'gradual & safe' },
]

const TOTAL_STEPS = 4

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="w-full flex items-center gap-3">
      <div className="flex-1 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-1 rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%`, background: '#00FF88' }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums" style={{ color: '#00FF88' }}>
        {step}/{TOTAL_STEPS}
      </span>
    </div>
  )
}

function SelectButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: selected ? 'rgba(0,255,136,0.12)' : 'rgba(255,255,255,0.04)',
        border: selected ? '1px solid rgba(0,255,136,0.5)' : '1px solid rgba(255,255,255,0.08)',
        color: selected ? '#00FF88' : '#FFFFFF',
      }}
      aria-pressed={selected}
    >
      {children}
    </button>
  )
}

function CheckButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3"
      style={{
        background: selected ? 'rgba(0,255,136,0.08)' : 'rgba(255,255,255,0.04)',
        border: selected ? '1px solid rgba(0,255,136,0.4)' : '1px solid rgba(255,255,255,0.08)',
        color: selected ? '#00FF88' : '#A0A0A0',
      }}
      aria-pressed={selected}
    >
      <span
        className="flex-shrink-0 w-4 h-4 rounded flex items-center justify-center"
        style={{
          background: selected ? '#00FF88' : 'rgba(255,255,255,0.08)',
          border: selected ? 'none' : '1px solid rgba(255,255,255,0.2)',
        }}
        aria-hidden="true"
      >
        {selected && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L4 7L9 1" stroke="#0F0F1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children}
    </button>
  )
}

function ContextHint({ text }: { text: string }) {
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm leading-relaxed animate-fade-in"
      style={{ background: 'rgba(0,255,136,0.06)', border: '1px solid rgba(0,255,136,0.15)', color: '#A0A0A0' }}
    >
      <span style={{ color: '#00FF88' }}>Note: </span>
      {text}
    </div>
  )
}

export function Survey({ onComplete, onSkip, existingProfile }: SurveyProps) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState<'forward' | 'back'>('forward')
  const [visible, setVisible] = useState(true)

  // Q1
  const [situation, setSituation] = useState(existingProfile?.situation ?? '')
  const [situationDetail, setSituationDetail] = useState(existingProfile?.situationDetail ?? '')

  // Q2
  const [liveArea, setLiveArea] = useState(existingProfile?.liveArea ?? '')
  const [hangoutArea, setHangoutArea] = useState(existingProfile?.hangoutArea ?? '')
  const [accessPoints, setAccessPoints] = useState<string[]>(existingProfile?.accessPoints ?? [])

  // Q3
  const [freeTime, setFreeTime] = useState(existingProfile?.freeTime ?? '')
  const [budget, setBudget] = useState(existingProfile?.budget ?? '')
  const [transport, setTransport] = useState<string[]>(existingProfile?.transport ?? [])

  // Q4
  const [networkSize, setNetworkSize] = useState(existingProfile?.networkSize ?? '')
  const [interests, setInterests] = useState<string[]>(existingProfile?.interests ?? [])
  const [meetingStyle, setMeetingStyle] = useState(existingProfile?.meetingStyle ?? '')

  const toggleItem = useCallback((arr: string[], setArr: (a: string[]) => void, item: string) => {
    setArr(arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item])
  }, [])

  const canProceed = useCallback(() => {
    if (step === 1) return situation !== ''
    if (step === 2) return liveArea !== '' && hangoutArea !== ''
    if (step === 3) return freeTime !== '' && budget !== '' && transport.length > 0
    if (step === 4) return networkSize !== '' && interests.length > 0 && meetingStyle !== ''
    return false
  }, [step, situation, liveArea, hangoutArea, freeTime, budget, transport, networkSize, interests, meetingStyle])

  const animateTransition = useCallback((nextStep: number, dir: 'forward' | 'back') => {
    setVisible(false)
    setDirection(dir)
    setTimeout(() => {
      setStep(nextStep)
      setVisible(true)
    }, 200)
  }, [])

  const handleNext = useCallback(() => {
    if (!canProceed()) return
    if (step < TOTAL_STEPS) {
      animateTransition(step + 1, 'forward')
    } else {
      const profile: UserProfile = {
        situation, situationDetail,
        liveArea, hangoutArea, accessPoints,
        freeTime, budget, transport,
        networkSize, interests, meetingStyle,
      }
      onComplete(profile)
    }
  }, [canProceed, step, animateTransition, situation, situationDetail, liveArea, hangoutArea, accessPoints, freeTime, budget, transport, networkSize, interests, meetingStyle, onComplete])

  const handleBack = useCallback(() => {
    if (step > 1) animateTransition(step - 1, 'back')
  }, [step, animateTransition])

  // Keyboard shortcut: Enter = next
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext])

  const slideStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translateX(0)'
      : direction === 'forward'
      ? 'translateX(24px)'
      : 'translateX(-24px)',
    transition: 'opacity 0.2s ease, transform 0.2s ease',
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      <ParticleField />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0,255,136,0.05) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">{"First, let's understand your Addis"}</h1>
              <p className="text-sm mt-0.5" style={{ color: '#A0A0A0' }}>4 quick questions to personalise your pattern breaks</p>
            </div>
            <button
              onClick={onSkip}
              className="text-xs px-3 py-1.5 rounded-lg transition-colors duration-200"
              style={{ color: '#A0A0A0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              title="Challenges will be less personalised"
            >
              Skip
            </button>
          </div>
          <ProgressBar step={step} />
        </div>

        {/* Question card */}
        <div style={slideStyle}>
          {step === 1 && (
            <div className="glass rounded-2xl p-5 flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#00FF88' }}>
                  Question 1 of 4
                </p>
                <h2 className="text-lg font-bold text-white text-balance">What is your current situation?</h2>
              </div>
              <div className="flex flex-col gap-2">
                {SITUATIONS.map((s) => (
                  <SelectButton key={s} selected={situation === s} onClick={() => setSituation(s)}>
                    {s}
                  </SelectButton>
                ))}
              </div>
              {(situation === 'Student' || situation === 'Employed' || situation === 'Job seeking' || situation === 'Freelancer/Side hustler' || situation === 'Entrepreneur') && (
                <div>
                  <label className="text-xs mb-1.5 block" style={{ color: '#A0A0A0' }}>
                    {situation === 'Student' && 'At which university or college?'}
                    {situation === 'Employed' && 'In what field?'}
                    {situation === 'Job seeking' && 'How long have you been looking?'}
                    {situation === 'Freelancer/Side hustler' && 'What are you doing?'}
                    {situation === 'Entrepreneur' && 'What stage is your venture at?'}
                  </label>
                  <input
                    type="text"
                    value={situationDetail}
                    onChange={(e) => setSituationDetail(e.target.value)}
                    placeholder="Optional — type here"
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      caretColor: '#00FF88',
                    }}
                    aria-label="Situation detail"
                  />
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="glass rounded-2xl p-5 flex flex-col gap-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#00FF88' }}>
                  Question 2 of 4
                </p>
                <h2 className="text-lg font-bold text-white text-balance">Your Addis</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>I live in</label>
                <div className="grid grid-cols-2 gap-2">
                  {AREAS.map((a) => (
                    <SelectButton key={a} selected={liveArea === a} onClick={() => setLiveArea(a)}>
                      {a}
                    </SelectButton>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>I spend most time in</label>
                <div className="grid grid-cols-2 gap-2">
                  {AREAS.map((a) => (
                    <SelectButton key={a} selected={hangoutArea === a} onClick={() => setHangoutArea(a)}>
                      {a}
                    </SelectButton>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>I have easy access to</label>
                <div className="flex flex-col gap-2">
                  {ACCESS_POINTS.map((ap) => (
                    <CheckButton
                      key={ap}
                      selected={accessPoints.includes(ap)}
                      onClick={() => toggleItem(accessPoints, setAccessPoints, ap)}
                    >
                      {ap}
                    </CheckButton>
                  ))}
                </div>
              </div>

              {liveArea && (
                <ContextHint text={`We will focus on venues near ${liveArea} and ${hangoutArea || liveArea}.`} />
              )}
            </div>
          )}

          {step === 3 && (
            <div className="glass rounded-2xl p-5 flex flex-col gap-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#00FF88' }}>
                  Question 3 of 4
                </p>
                <h2 className="text-lg font-bold text-white text-balance">Your resources</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Daily free time</label>
                <div className="flex flex-col gap-2">
                  {FREE_TIME_OPTIONS.map((opt) => (
                    <SelectButton key={opt} selected={freeTime === opt} onClick={() => setFreeTime(opt)}>
                      {opt}
                    </SelectButton>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Monthly activity budget</label>
                <div className="flex flex-col gap-2">
                  {BUDGET_OPTIONS.map((opt) => (
                    <SelectButton key={opt} selected={budget === opt} onClick={() => setBudget(opt)}>
                      {opt}
                    </SelectButton>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>Transport access</label>
                <div className="flex flex-col gap-2">
                  {TRANSPORT_OPTIONS.map((opt) => (
                    <CheckButton
                      key={opt}
                      selected={transport.includes(opt)}
                      onClick={() => toggleItem(transport, setTransport, opt)}
                    >
                      {opt}
                    </CheckButton>
                  ))}
                </div>
              </div>

              {budget && (
                <ContextHint text={`Challenges will be kept under ${budget} wherever possible.`} />
              )}
            </div>
          )}

          {step === 4 && (
            <div className="glass rounded-2xl p-5 flex flex-col gap-5">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: '#00FF88' }}>
                  Question 4 of 4
                </p>
                <h2 className="text-lg font-bold text-white text-balance">Your social circle</h2>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>My network in Addis is</label>
                <div className="flex flex-col gap-2">
                  {NETWORK_SIZES.map(({ value, label, sub }) => (
                    <SelectButton key={value} selected={networkSize === value} onClick={() => setNetworkSize(value)}>
                      <span className="font-semibold">{label}</span>
                      <span className="ml-2 text-xs opacity-70">— {sub}</span>
                    </SelectButton>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                  I want to connect with people in
                </label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleItem(interests, setInterests, tag)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
                      style={{
                        background: interests.includes(tag) ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.05)',
                        border: interests.includes(tag) ? '1px solid rgba(0,255,136,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        color: interests.includes(tag) ? '#00FF88' : '#A0A0A0',
                      }}
                      aria-pressed={interests.includes(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" style={{ color: '#FFFFFF' }}>
                  I am most comfortable meeting new people
                </label>
                <div className="flex flex-col gap-2">
                  {MEETING_STYLES.map(({ value, sub }) => (
                    <SelectButton key={value} selected={meetingStyle === value} onClick={() => setMeetingStyle(value)}>
                      <span>{value}</span>
                      <span className="block text-xs opacity-60 mt-0.5">{sub}</span>
                    </SelectButton>
                  ))}
                </div>
              </div>

              {interests.length > 0 && (
                <ContextHint
                  text={`We will match you with ${interests.slice(0, 3).join(', ')}${interests.length > 3 ? ' and more' : ''} communities.`}
                />
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.06)', color: '#A0A0A0', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Back
            </button>
          )}
          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: canProceed() ? '#00FF88' : 'rgba(0,255,136,0.3)',
              color: '#0F0F1A',
            }}
          >
            {step === TOTAL_STEPS ? 'Start personalised experience →' : 'Continue →'}
          </button>
        </div>

        <p className="text-center text-xs" style={{ color: '#A0A0A0' }}>
          Saved locally — never shared with anyone
        </p>
      </div>
    </section>
  )
}
