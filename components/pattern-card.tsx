'use client';

import { Challenge } from '@/lib/types';
import { AGENTS, AGENT_ORDER } from '@/lib/agents';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface PatternCardProps {
  challenge: Challenge;
}

export function PatternCard({ challenge }: PatternCardProps) {
  const respondedAgents = AGENT_ORDER.filter((agentId) =>
    challenge.responses.some((r) => r.agentId === agentId)
  );

  return (
    <Link href={`/challenge/${challenge.id}`}>
      <div className="group cursor-pointer rounded-lg border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-4 transition-all hover:border-white/20 hover:bg-white/10">
        <p className="mb-3 line-clamp-2 text-sm text-gray-200">{challenge.text}</p>

        <div className="mb-3 flex flex-wrap gap-1">
          {respondedAgents.map((agentId) => (
            <div
              key={agentId}
              className="h-2 w-6 rounded-full"
              style={{ backgroundColor: AGENTS[agentId].color }}
              title={AGENTS[agentId].name}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(challenge.timestamp), { addSuffix: true })}
          </span>
          <Button
            variant="ghost"
            size="xs"
            className="opacity-0 transition-opacity group-hover:opacity-100"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            View
          </Button>
        </div>
      </div>
    </Link>
  );
}
