import { Challenge, UserSession } from './types';

const STORAGE_KEY = 'pattern-breaker-session';

export function getSession(): UserSession {
  if (typeof window === 'undefined') {
    return { history: [] };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { history: [] };
  } catch {
    return { history: [] };
  }
}

export function saveSession(session: UserSession): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    console.error('Failed to save session');
  }
}

export function addChallenge(challenge: Challenge): void {
  const session = getSession();
  session.history.unshift(challenge);
  // Keep only last 50
  session.history = session.history.slice(0, 50);
  saveSession(session);
}

export function getChallengeById(id: string): Challenge | undefined {
  const session = getSession();
  return session.history.find((c) => c.id === id);
}

export function updateChallenge(id: string, updates: Partial<Challenge>): void {
  const session = getSession();
  const challenge = session.history.find((c) => c.id === id);
  if (challenge) {
    Object.assign(challenge, updates);
    saveSession(session);
  }
}

export function getHistory(): Challenge[] {
  return getSession().history;
}

export function clearHistory(): void {
  saveSession({ history: [] });
}
