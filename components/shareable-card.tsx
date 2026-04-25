'use client';

import { Challenge } from '@/lib/types';
import { AGENTS, AGENT_ORDER } from '@/lib/agents';

interface ShareableCardProps {
  challenge: Challenge;
}

export function ShareableCard({ challenge }: ShareableCardProps) {
  return (
    <div
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-black to-slate-950 p-6 sm:p-8 border border-white/10"
      style={{
        aspectRatio: '9/16',
        boxShadow: '0 25px 50px rgba(255, 45, 120, 0.15), 0 0 60px rgba(0, 212, 255, 0.1)',
      }}
    >
      {/* Background accents */}
      <div
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-20 -z-10"
        style={{
          background: 'radial-gradient(circle, #FF2D78, transparent)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl opacity-15 -z-10"
        style={{
          background: 'radial-gradient(circle, #00D4FF, transparent)',
        }}
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">PatternBreaker</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Challenge Response</p>
      </div>

      {/* Challenge text */}
      <div className="mb-6 pb-4 border-b border-white/10">
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{challenge.text}</p>
      </div>

      {/* Responses grid */}
      <div className="mb-12 space-y-3">
        {AGENT_ORDER.map((agentId) => {
          const response = challenge.responses.find((r) => r.agentId === agentId);
          if (!response) return null;

          const agent = AGENTS[agentId];
          return (
            <div key={agentId} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0"
                  style={{ backgroundColor: agent.color }}
                >
                  {agent.icon}
                </div>
                <span className="text-xs font-semibold text-white">{agent.name}</span>
              </div>
              <p className="text-xs leading-tight text-gray-400 ml-7 line-clamp-2">{response.text}</p>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 px-6 sm:px-8">
        <p className="text-center text-xs text-gray-600">
          Break patterns. Discover new paths.
        </p>
      </div>
    </div>
  );
}
