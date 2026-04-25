'use client';

import { JelesResponse } from '@/lib/jeles-client';
import { Spinner } from '@/components/ui/spinner';

interface JelesResponseCardProps {
  response: JelesResponse | null;
  isLoading?: boolean;
  error?: string;
}

export function JelesResponseCard({ response, isLoading, error }: JelesResponseCardProps) {
  if (isLoading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 flex flex-col items-center justify-center min-h-96">
        <Spinner className="h-12 w-12 mb-4" />
        <p className="text-gray-300">Analyzing your challenge with Jeles AI...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-8">
        <h3 className="text-lg font-semibold text-red-400 mb-2">Error Processing Challenge</h3>
        <p className="text-red-300">{error}</p>
        <p className="text-sm text-red-400 mt-4">Please try again or contact support if the issue persists.</p>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-gray-400">Submit a challenge to get Jeles&apos; analysis</p>
      </div>
    );
  }

  const sentimentColor = {
    positive: 'text-green-400',
    neutral: 'text-blue-400',
    challenging: 'text-orange-400',
  }[response.sentiment];

  const sentimentBg = {
    positive: 'bg-green-500/10',
    neutral: 'bg-blue-500/10',
    challenging: 'bg-orange-500/10',
  }[response.sentiment];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">{response.title}</h2>
        <p className="text-lg text-gray-300">{response.description}</p>
      </div>

      {/* Sentiment and Confidence */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`rounded-lg ${sentimentBg} border border-white/10 p-4`}>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Sentiment</p>
          <p className={`text-lg font-semibold capitalize ${sentimentColor}`}>
            {response.sentiment}
          </p>
        </div>
        <div className="rounded-lg bg-white/5 border border-white/10 p-4">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Confidence</p>
          <p className="text-lg font-semibold text-white">
            {Math.round(response.confidence * 100)}%
          </p>
        </div>
      </div>

      {/* Insights */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Key Insights</h3>
        <ul className="space-y-3">
          {response.insights.map((insight, idx) => (
            <li key={idx} className="flex gap-3">
              <span className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                {idx + 1}
              </span>
              <p className="text-gray-300 pt-0.5">{insight}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Items */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Recommended Actions</h3>
        <ul className="space-y-2">
          {response.actionItems.map((action, idx) => (
            <li key={idx} className="flex gap-3 items-start">
              <span className="text-green-400 text-xl leading-none">✓</span>
              <p className="text-gray-300 pt-0.5">{action}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-white/10">
        <p className="text-xs text-gray-500">
          Analysis provided by Jeles AI on {new Date(response.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
