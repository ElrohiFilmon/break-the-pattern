'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context';
import { Button } from '@/components/ui/button';
import { clearHistory as clearStoredHistory } from '@/lib/storage';
import { analytics } from '@/lib/analytics';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export const dynamic = 'force-dynamic';

export default function HistoryPage() {
  const { history, refreshHistory } = useAppContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all your challenge history? This cannot be undone.')) {
      clearStoredHistory();
      analytics.trackHistoryCleared();
      refreshHistory();
    }
  };

  if (!mounted) {
    return null;
  }

  if (history.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black via-slate-900 to-black">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-12">Your History</h1>
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-5xl mb-4">📋</p>
            <h2 className="text-2xl font-bold text-white mb-2">No challenges yet</h2>
            <p className="text-gray-400 mb-8 text-center">Start by creating your first challenge to break a pattern.</p>
            <Button
              onClick={() => (window.location.href = '/challenge')}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold"
            >
              Create First Challenge
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Your History</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="border-red-600/50 text-red-400 hover:bg-red-600/10"
          >
            Clear All
          </Button>
        </div>

        <div className="space-y-4">
          {history.map((challenge) => (
            <Link key={challenge.id} href={`/challenge/${challenge.id}`}>
              <div className="rounded-lg border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-500/10 cursor-pointer group">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400 mb-2">
                      {formatDistanceToNow(new Date(challenge.timestamp), { addSuffix: true })}
                    </p>
                    <p className="text-lg text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                      {challenge.text}
                    </p>
                    {challenge.response && (
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-sm text-cyan-300 font-semibold mb-1">
                          {challenge.response.title}
                        </p>
                        <p className="text-xs text-gray-400 line-clamp-1">
                          {challenge.response.description}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-2">
                    {challenge.response && (
                      <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30 text-xs text-green-300 font-medium">
                        Analyzed
                      </span>
                    )}
                    {challenge.isLoading && (
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs text-blue-300 font-medium">
                        Analyzing...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>{history.length} challenge{history.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>
    </div>
  );
}
