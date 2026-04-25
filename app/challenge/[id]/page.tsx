'use client';

import { useRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/lib/context';
import { AgentCard } from '@/components/agent-card';
import { ShareableCard } from '@/components/shareable-card';
import { Button } from '@/components/ui/button';
import { AGENT_ORDER } from '@/lib/agents';
import html2canvas from 'html2canvas';
import { shareCard, canShare } from '@/lib/share';
import { analytics } from '@/lib/analytics';

export const dynamic = 'force-dynamic';

export default function ChallengeDetailPage() {
  const params = useParams();
  const { history } = useAppContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const challenge = mounted ? history.find((c) => c.id === params.id) : null;

  if (!mounted) {
    return null;
  }

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Challenge Not Found</h1>
          <p className="text-gray-400 mb-6">This challenge doesn&apos;t exist or has been deleted.</p>
        </div>
      </div>
    );
  }

  const handleExportCard = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });

      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `pattern-breaker-${challenge.id}.png`;
      link.click();
      
      analytics.trackCardExported(challenge.id);
    } catch (error) {
      console.error('Failed to export card:', error);
    }
  };

  const handleShareCard = async () => {
    const result = await shareCard(challenge.text, window.location.href);
    if (result.success) {
      analytics.trackCardShared(challenge.id);
      if (result.fallback) {
        alert('Link copied to clipboard!');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-black via-slate-900 to-black">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
        {/* Challenge Header */}
        <div className="mb-10 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Challenge</h1>
          <p className="text-base sm:text-lg text-gray-300 leading-relaxed">{challenge.text}</p>
        </div>

        {/* Responses Grid */}
        <div className="mb-12 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">Four Perspectives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {AGENT_ORDER.map((agentId) => {
              const response = challenge.responses.find((r) => r.agentId === agentId);
              return <AgentCard key={agentId} agentId={agentId} response={response} />;
            })}
          </div>
        </div>

        {/* Shareable Card Section */}
        <div className="mb-12 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">Shareable Card</h2>
          <div
            ref={cardRef}
            className="flex justify-center mb-6 p-3 sm:p-4 rounded-lg bg-black/50 border border-white/10 overflow-hidden"
          >
            <div className="w-full max-w-xs sm:max-w-sm">
              <ShareableCard challenge={challenge} />
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              onClick={handleExportCard}
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Download Card
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {canShare() && (
            <Button 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10"
              onClick={handleShareCard}
            >
              Share Challenge
            </Button>
          )}
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Challenge link copied to clipboard!');
            }}
          >
            Copy Link
          </Button>
          <Button 
            variant="outline" 
            className="border-white/20 text-white hover:bg-white/10"
            onClick={() => {
              window.location.href = '/challenge';
            }}
          >
            New Challenge
          </Button>
        </div>
      </div>
    </div>
  );
}
