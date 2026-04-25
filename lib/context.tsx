'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Challenge } from './types';
import { getSession, addChallenge as saveChallenge, updateChallenge as updateStoredChallenge } from './storage';

interface AppContextType {
  currentChallenge: Challenge | null;
  setCurrentChallenge: (challenge: Challenge | null) => void;
  history: Challenge[];
  refreshHistory: () => void;
  updateChallenge: (id: string, updates: Partial<Challenge>) => void;
  addChallenge: (challenge: Challenge) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [history, setHistory] = useState<Challenge[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const session = getSession();
    setHistory(session.history);
  }, []);

  const refreshHistory = () => {
    const session = getSession();
    setHistory(session.history);
  };

  const updateChallenge = (id: string, updates: Partial<Challenge>) => {
    updateStoredChallenge(id, updates);
    refreshHistory();
    if (currentChallenge?.id === id) {
      setCurrentChallenge({ ...currentChallenge, ...updates });
    }
  };

  const addNewChallenge = (challenge: Challenge) => {
    saveChallenge(challenge);
    refreshHistory();
    setCurrentChallenge(challenge);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <AppContext.Provider
      value={{
        currentChallenge,
        setCurrentChallenge,
        history,
        refreshHistory,
        updateChallenge,
        addChallenge: addNewChallenge,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    // Return a default context for SSR/build time
    if (typeof window === 'undefined') {
      return {
        currentChallenge: null,
        setCurrentChallenge: () => {},
        history: [],
        refreshHistory: () => {},
        updateChallenge: () => {},
        addChallenge: () => {},
      };
    }
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
