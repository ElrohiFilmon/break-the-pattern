'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Break Your <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Patterns</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get intelligent AI analysis from Jeles to understand and overcome the patterns holding you back. Real insights, real solutions.
          </p>
        </div>

        <Link href="/challenge">
          <Button size="lg" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8 py-3 text-base sm:text-lg rounded-lg">
            Start Your Challenge
          </Button>
        </Link>
      </section>

      {/* About Jeles Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">Meet Jeles</h2>
        
        <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">
            <div className="flex-shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 text-white text-4xl">
                🧠
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-3">Advanced AI Analysis</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                Jeles is an intelligent AI advisor that analyzes your challenges with deep insight and nuance. Rather than offering surface-level advice, Jeles provides:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3 items-start">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span className="text-gray-300">Deep pattern recognition and analysis</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span className="text-gray-300">Actionable insights tailored to your situation</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span className="text-gray-300">Concrete steps you can take immediately</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span className="text-gray-300">Understanding of underlying causes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">How It Works</h2>
        
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">1</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Share Your Challenge</h3>
              <p className="text-gray-400">Describe a pattern you want to break, a habit you&apos;re struggling with, or a challenge you&apos;re facing. Be as specific and honest as possible.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">2</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Jeles Analyzes</h3>
              <p className="text-gray-400">Jeles AI processes your challenge, identifying root causes, underlying patterns, and key insights that can help you understand what&apos;s happening.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">3</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Actionable Insights</h3>
              <p className="text-gray-400">Receive specific, actionable steps you can take right now to break the pattern and move forward with confidence.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white font-bold">4</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Track Your Progress</h3>
              <p className="text-gray-400">Save and review all your challenges and analyses to track patterns over time and celebrate your growth.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
