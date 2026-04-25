'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context';
import { analytics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const { history: appHistory } = useAppContext();

  useEffect(() => {
    setMounted(true);
    setHistory(appHistory);
    analytics.loadFromStorage();
    setEvents(analytics.getEvents());
  }, [appHistory]);

  if (!mounted) {
    return null;
  }

  const totalChallenges = history.length;
  const analyzedChallenges = history.filter((c) => c.response).length;
  const averageConfidence =
    analyzedChallenges > 0
      ? Math.round(
          history
            .filter((c) => c.response)
            .reduce((sum, c) => sum + (c.response?.confidence || 0), 0) / analyzedChallenges * 100
        )
      : 0;

  const sentimentCounts = history
    .filter((c) => c.response)
    .reduce(
      (acc, c) => {
        acc[c.response?.sentiment] = (acc[c.response?.sentiment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

  const recentEvents = events.slice(-10).reverse();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Stats</h1>
          <p className="text-gray-400">Track your progress and insights from Jeles analyses.</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Total Challenges</p>
            <p className="text-4xl font-bold text-white">{totalChallenges}</p>
            <p className="text-xs text-gray-500 mt-2">{analyzedChallenges} analyzed</p>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Avg Confidence</p>
            <p className="text-4xl font-bold text-cyan-400">{averageConfidence}%</p>
            <p className="text-xs text-gray-500 mt-2">Jeles analysis confidence</p>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6">
            <p className="text-sm text-gray-400 uppercase tracking-wide mb-2">Events Tracked</p>
            <p className="text-4xl font-bold text-white">{events.length}</p>
            <p className="text-xs text-gray-500 mt-2">User interactions</p>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        {Object.keys(sentimentCounts).length > 0 && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-6 mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">Analysis Sentiment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(sentimentCounts).map(([sentiment, count]) => (
                <div key={sentiment} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-400 capitalize mb-1">{sentiment}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                  <div className="text-3xl">
                    {sentiment === 'positive'
                      ? '🟢'
                      : sentiment === 'neutral'
                        ? '🔵'
                        : '🟠'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        {recentEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-2">
              {recentEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">
                      {event.name.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleDateString()} at{' '}
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-2xl">
                    {event.name === 'challenge_created' && '🎯'}
                    {event.name === 'card_exported' && '📥'}
                    {event.name === 'card_shared' && '📤'}
                    {event.name === 'history_cleared' && '🗑️'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Challenges */}
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Challenges</h2>
          {history.length === 0 ? (
            <p className="text-gray-400">No challenges yet. Start by creating your first challenge.</p>
          ) : (
            <div className="space-y-3">
              {history
                .slice(-5)
                .reverse()
                .map((challenge) => (
                  <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
                    <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all cursor-pointer">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-sm text-white truncate">{challenge.text.substring(0, 60)}...</p>
                        {challenge.response && (
                          <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-300 whitespace-nowrap">
                            Analyzed
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {totalChallenges === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">No activity yet. Start your first challenge with Jeles!</p>
            <Link href="/challenge">
              <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold">
                Create First Challenge
              </Button>
            </Link>
          </div>
        )}

        {/* Navigation */}
        {totalChallenges > 0 && (
          <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row gap-4">
            <Link href="/challenge" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold">
                New Challenge
              </Button>
            </Link>
            <Link href="/history" className="flex-1">
              <Button
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                View All History
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
