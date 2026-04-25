'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/context';
import { analytics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

interface StatItem {
  label: string;
  value: number | string;
  icon: string;
}

export default function StatsPage() {
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    // Load history from storage manually since we need to avoid context issues
    try {
      const session = JSON.parse(localStorage.getItem('pattern-breaker-session') || '{"history":[]}');
      setHistory(session.history);
    } catch {
      setHistory([]);
    }
    
    analytics.loadFromStorage();
    setEvents(analytics.getEvents());
  }, []);

  if (!mounted) {
    return null;
  }

  const totalChallenges = history.length;
  const completedChallenges = history.filter((c) => c.responses.length > 0).length;
  const exportedCards = events.filter((e) => e.name === 'card_exported').length;
  const sharedCards = events.filter((e) => e.name === 'card_shared').length;

  const stats: StatItem[] = [
    {
      label: 'Total Challenges',
      value: totalChallenges,
      icon: '📋',
    },
    {
      label: 'Completed',
      value: completedChallenges,
      icon: '✅',
    },
    {
      label: 'Cards Exported',
      value: exportedCards,
      icon: '📥',
    },
    {
      label: 'Times Shared',
      value: sharedCards,
      icon: '📤',
    },
  ];

  const recentEvents = events.slice(-10).reverse();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Stats</h1>
          <p className="text-gray-400">Track your pattern-breaking journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:border-white/20 transition-colors"
            >
              <p className="text-3xl mb-2">{stat.icon}</p>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Activity Log */}
        {recentEvents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
            <div className="space-y-2">
              {recentEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/10 bg-white/5 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white capitalize">
                      {event.name.replace('_', ' ')}
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

        {/* Empty State */}
        {totalChallenges === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">No activity yet. Start your first challenge!</p>
            <Link href="/challenge">
              <Button className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold">
                Create Challenge
              </Button>
            </Link>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-12 pt-6 border-t border-white/10 flex justify-center">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
