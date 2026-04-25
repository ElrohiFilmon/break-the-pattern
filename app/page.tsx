'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AGENTS, AGENT_ORDER } from '@/lib/agents';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Break Your <span className="bg-gradient-to-r from-pink-500 via-yellow-400 to-green-400 bg-clip-text text-transparent">Patterns</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Challenge yourself with insights from four unique perspectives. Get real answers to break patterns that hold you back.
          </p>
        </div>

        <Link href="/challenge">
          <Button size="lg" className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold px-8 py-3 text-base sm:text-lg rounded-lg">
            Start Your Challenge
          </Button>
        </Link>
      </section>

      {/* Team Section */}
      <section className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-12 text-center">Meet Your Advisors</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {AGENT_ORDER.map((agentId) => {
            const agent = AGENTS[agentId];
            return (
              <div
                key={agentId}
                className="rounded-lg border p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/40 hover:shadow-lg"
                style={{
                  borderColor: agent.color + '40',
                  backgroundColor: agent.color + '10',
                }}
              >
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-white text-2xl"
                    style={{ backgroundColor: agent.color }}
                  >
                    {agent.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{agent.name}</h3>
                </div>
                <p className="text-sm text-gray-300">
                  {agent.id === 'pink'
                    ? 'The disruptor. Questions everything and challenges you to be bold.'
                    : agent.id === 'gold'
                    ? 'The wisdom keeper. Reflects on patterns and their deeper meaning.'
                    : agent.id === 'green'
                    ? 'The nurturer. Supports growth with compassion and kindness.'
                    : 'The observer. Sees patterns others miss with data and insight.'}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-4xl px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">How It Works</h2>
        
        <div className="space-y-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-600 text-white font-bold">1</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Share Your Challenge</h3>
              <p className="text-gray-400">Describe a pattern you want to break or a challenge you're facing.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-600 text-white font-bold">2</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Get Four Perspectives</h3>
              <p className="text-gray-400">Rebel, Sage, Guide, and Echo each offer their unique take on your challenge.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-600 text-white font-bold">3</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Share & Reflect</h3>
              <p className="text-gray-400">Create a shareable card and track your patterns over time.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
