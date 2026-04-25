import { Agent } from './types';

const responses: Record<Agent['id'], string[]> = {
  pink: [
    'Break it like a rebel. Stop waiting for permission.',
    'The pattern exists because you let it. Time to prove it wrong.',
    'Your comfort zone is a cage. Here&apos;s your key.',
    'Question everything. Why do you do this?',
    'Radical change starts with saying "no" to the old you.',
  ],
  gold: [
    'Consider the wisdom in this pattern. What does it protect?',
    'Every pattern served a purpose once. Is it still needed?',
    'Reflect: Has this pattern shaped who you&apos;ve become?',
    'The pattern repeats because you haven&apos;t yet understood its lesson.',
    'What would your wiser self tell you about this habit?',
  ],
  green: [
    'Small shifts compound. Begin with one tiny change today.',
    'Growth happens at the edge of your comfort zone.',
    'You have all the strength within you already. Trust it.',
    'Let go of judgment. Replace the pattern with kindness.',
    'Nurture yourself through this transition. You are worthy.',
  ],
  cyan: [
    'Pattern detected: You&apos;ve tried this change before. What was different?',
    'Insight: This pattern mirrors your belief about yourself.',
    'Data shows: The opposite outcome is more likely than you think.',
    'Reflection point: Who reinforces this pattern in your life?',
    'Notice: The pattern weakens each time you&apos;re aware of it.',
  ],
};

export function getMockResponse(agentId: Agent['id']): string {
  const agentResponses = responses[agentId];
  return agentResponses[Math.floor(Math.random() * agentResponses.length)];
}

export function getAllMockResponses(agentIds: Agent['id'][]): Record<Agent['id'], string> {
  const result: Record<Agent['id'], string> = {} as any;
  agentIds.forEach((id) => {
    result[id] = getMockResponse(id);
  });
  return result;
}
