import { Agent, Response } from '@/lib/types';
import { AGENTS } from '@/lib/agents';

interface AgentCardProps {
  agentId: Agent['id'];
  response?: Response;
  isLoading?: boolean;
}

export function AgentCard({ agentId, response, isLoading }: AgentCardProps) {
  const agent = AGENTS[agentId];

  return (
    <div
      className="rounded-lg border border-white/10 p-4 backdrop-blur-sm"
      style={{ borderColor: agent.color + '20', backgroundColor: agent.color + '08' }}
    >
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full font-bold text-white text-lg"
          style={{ backgroundColor: agent.color }}
        >
          {agent.icon}
        </div>
        <h3 className="font-semibold text-white">{agent.name}</h3>
      </div>

      <div className="min-h-20">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-3 w-3/4 rounded bg-white/20 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-white/20 animate-pulse" />
          </div>
        ) : response ? (
          <p className="text-sm leading-relaxed text-gray-200">{response.text}</p>
        ) : (
          <p className="text-xs text-gray-400 italic">Waiting for your challenge...</p>
        )}
      </div>
    </div>
  );
}
