'use client';

import { useEffect, useState } from 'react';
import { useAppContext } from '@/lib/context';
import { PatternCard } from '@/components/pattern-card';
import { Button } from '@/components/ui/button';
import { Empty } from '@/components/ui/empty';
import { clearHistory as clearStoredHistory } from '@/lib/storage';
import { analytics } from '@/lib/analytics';

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
              onClick={() => window.location.href = '/challenge'}
              className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 text-white font-semibold"
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

        <div className="space-y-3">
          {history.map((challenge) => (
            <PatternCard key={challenge.id} challenge={challenge} />
          ))}
        </div>

        <div className="mt-10 text-center text-sm text-gray-500">
          <p>{history.length} challenge{history.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>
    </div>
  );
}
