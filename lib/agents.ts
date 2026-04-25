import { Agent } from './types';

export const AGENTS: Record<Agent['id'], Agent> = {
  pink: {
    id: 'pink',
    name: 'Rebel',
    color: '#FF2D78',
    bgColor: 'bg-pink-600',
    icon: '⚡',
  },
  gold: {
    id: 'gold',
    name: 'Sage',
    color: '#FFB800',
    bgColor: 'bg-yellow-500',
    icon: '🔮',
  },
  green: {
    id: 'green',
    name: 'Guide',
    color: '#00FF88',
    bgColor: 'bg-green-500',
    icon: '🌿',
  },
  cyan: {
    id: 'cyan',
    name: 'Echo',
    color: '#00D4FF',
    bgColor: 'bg-cyan-500',
    icon: '🌊',
  },
};

export const AGENT_ORDER: Agent['id'][] = ['pink', 'gold', 'green', 'cyan'];
