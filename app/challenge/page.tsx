'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAppContext } from '@/lib/context';
import { AGENT_ORDER } from '@/lib/agents';
import { getAllMockResponses } from '@/lib/mock-responses';
import { Challenge, Response } from '@/lib/types';
import { analytics } from '@/lib/analytics';

export default function ChallengePage() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addChallenge } = useAppContext();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !mounted) return;

    setIsLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate responses from all agents
    const mockResponses = getAllMockResponses(AGENT_ORDER);
    const responses: Response[] = AGENT_ORDER.map((agentId) => ({
      agentId,
      text: mockResponses[agentId],
      timestamp: Date.now(),
    }));

    const challenge: Challenge = {
      id: Date.now().toString(),
      text,
      category: 'personal', // Default category
      timestamp: Date.now(),
      responses,
      cardExported: false,
    };

    addChallenge(challenge);
    analytics.trackChallengeCreated('personal');
    
    if (mounted) {
      router.push(`/challenge/${challenge.id}`);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
        <div className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">What&apos;s Your Pattern?</h1>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            Describe a pattern you want to break, a habit you're struggling with, or a challenge you're facing. Be specific and honest.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="challenge" className="block text-sm font-semibold text-white mb-3">
              Your Challenge
            </label>
            <Textarea
              id="challenge"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="E.g., I keep procrastinating on important projects and I'm not sure why. I know I need to break this habit but every time I start, something distracts me..."
              className="min-h-32 resize-none rounded-lg border border-white/10 bg-white/5 p-4 text-white placeholder:text-gray-500 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/10"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={!text.trim() || isLoading}
            className="w-full bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-6"
          >
            {isLoading ? 'Getting Responses...' : 'Get Responses'}
          </Button>

          {isLoading && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-sm text-gray-400">
                Our advisors are thinking about your challenge...
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
