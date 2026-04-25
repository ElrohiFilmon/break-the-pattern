export interface Agent {
  id: 'pink' | 'gold' | 'green' | 'cyan';
  name: string;
  color: string;
  bgColor: string;
  icon: string;
}

export interface Response {
  agentId: Agent['id'];
  text: string;
  timestamp: number;
}

export interface Challenge {
  id: string;
  text: string;
  category: string;
  timestamp: number;
  responses: Response[];
  cardExported: boolean;
}

export interface UserSession {
  history: Challenge[];
}
