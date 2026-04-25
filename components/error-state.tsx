'use client'

interface ErrorStateProps {
  message: string
  onRetry: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm flex flex-col items-center gap-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)' }}
          aria-hidden="true"
        >
          ⚠️
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#A0A0A0' }}>
            {message}
          </p>
        </div>
        <button
          onClick={onRetry}
          className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300"
          style={{ background: '#00FF88', color: '#0F0F1A' }}
          aria-label="Try again"
        >
          Try Again →
        </button>
      </div>
    </section>
  )
}
