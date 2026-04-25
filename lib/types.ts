export interface JelesResponse {
  id: string;
  title: string;
  description: string;
  insights: string[];
  actionItems: string[];
  sentiment: 'positive' | 'neutral' | 'challenging';
  confidence: number;
  timestamp: number;
}

export interface Challenge {
  id: string;
  text: string;
  category: string;
  timestamp: number;
  response: JelesResponse | null;
  isLoading?: boolean;
  error?: string;
  cardExported: boolean;
}

export interface UserSession {
  history: Challenge[];
}
