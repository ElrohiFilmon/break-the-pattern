import { Challenge } from './types';

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

export interface JelesAnalysis {
  challenge: string;
  response: JelesResponse;
}

export interface JelesError {
  code: string;
  message: string;
  details?: string;
}

const JELES_API_BASE = process.env.NEXT_PUBLIC_JELES_API_URL || 'https://api.jeles.ai';
const JELES_API_KEY = process.env.JELES_API_KEY;

export class JelesClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = JELES_API_BASE;
    this.apiKey = JELES_API_KEY || '';
  }

  async analyzeChallenge(challengeText: string): Promise<JelesResponse> {
    if (!challengeText.trim()) {
      throw new Error('Challenge text cannot be empty');
    }

    try {
      const response = await fetch(`${this.baseUrl}/v1/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client': 'pattern-breaker-addis',
        },
        body: JSON.stringify({
          challenge: challengeText,
          context: 'pattern-breaking',
          includeActionItems: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json() as JelesError;
        throw new Error(error.message || 'Failed to analyze challenge with Jeles');
      }

      const data = await response.json() as JelesResponse;
      return {
        ...data,
        timestamp: Date.now(),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Jeles API error: ${error.message}`);
      }
      throw error;
    }
  }

  async getResponse(challengeId: string): Promise<JelesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/response/${challengeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client': 'pattern-breaker-addis',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve Jeles response');
      }

      return await response.json() as JelesResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Jeles API error: ${error.message}`);
      }
      throw error;
    }
  }

  async streamAnalysis(
    challengeText: string,
    onChunk: (chunk: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/v1/analyze/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client': 'pattern-breaker-addis',
        },
        body: JSON.stringify({
          challenge: challengeText,
          context: 'pattern-breaking',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to stream analysis');
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const chunk = line.slice(6);
            onChunk(chunk);
          }
        }
      }

      if (buffer.startsWith('data: ')) {
        onChunk(buffer.slice(6));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      onError(message);
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getMissingConfigMessage(): string {
    return 'Jeles API key not configured. Please set JELES_API_KEY environment variable.';
  }
}

export const jelesClient = new JelesClient();
