'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  { icon: '🔍', label: 'Pattern Analyst detecting your loop...' },
  { icon: '🎯', label: 'Challenge Designer creating your mission...' },
  { icon: '🗺', label: 'Addis Navigator localizing to the city...' },
  { icon: '📋', label: 'Accountability Coach preparing check-ins...' },
]

export function LoadingSequence() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedSteps((prev) => [...prev, activeStep])
      setActiveStep((prev) => Math.min(prev + 1, STEPS.length - 1))
    }, 900)
    return () => clearInterval(interval)
  }, [activeStep])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col gap-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)' }}
            aria-hidden="true"
          >
            <span className="text-3xl">⚡</span>
          </div>
          <h2 className="text-xl font-bold text-white">Analyzing your pattern</h2>
          <p className="text-sm mt-1" style={{ color: '#A0A0A0' }}>
            Hold on — your breakthrough is being crafted
          </p>
        </div>

        {/* Steps */}
        <div className="flex flex-col gap-3">
          {STEPS.map((step, i) => {
            const isCompleted = completedSteps.includes(i)
            const isActive = activeStep === i && !isCompleted
            return (
              <div
                key={i}
                className="glass rounded-xl px-4 py-3.5 flex items-center gap-3 transition-all duration-500"
                style={{
                  opacity: i > activeStep ? 0.3 : 1,
                  transform: isActive ? 'scale(1.02)' : 'scale(1)',
                  borderColor: isActive
                    ? 'rgba(0,255,136,0.5)'
                    : isCompleted
                    ? 'rgba(0,255,136,0.2)'
                    : 'rgba(255,255,255,0.05)',
                }}
                aria-current={isActive ? 'step' : undefined}
              >
                <span className="text-xl" aria-hidden="true">{step.icon}</span>
                <span
                  className="text-sm font-medium flex-1"
                  style={{ color: isActive ? '#FFFFFF' : isCompleted ? '#A0A0A0' : '#A0A0A0' }}
                >
                  {step.label}
                </span>
                {isCompleted && (
                  <span style={{ color: '#00FF88' }} aria-label="complete">
                    ✓
                  </span>
                )}
                {isActive && (
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="w-1 h-1 rounded-full bg-[#00FF88] animate-loading-dot"
                        style={{ animationDelay: `${dot * 0.16}s` }}
                      />
                    ))}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.08)' }}
          role="progressbar"
          aria-valuenow={Math.round(((activeStep + 1) / STEPS.length) * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.round(((activeStep + 1) / STEPS.length) * 100)}%`,
              background: 'linear-gradient(90deg, #00FF88, #FFB800)',
            }}
          />
        </div>
      </div>
    </section>
  )
}
