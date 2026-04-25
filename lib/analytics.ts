export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private storageKey = 'pattern-breaker-analytics';

  trackEvent(name: string, properties?: Record<string, string | number | boolean>) {
    const event: AnalyticsEvent = {
      name,
      properties,
      timestamp: Date.now(),
    };
    
    this.events.push(event);
    this.saveToStorage();
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', name, properties);
    }
  }

  trackChallengeCreated(category: string) {
    this.trackEvent('challenge_created', { category });
  }

  trackChallengeViewed(challengeId: string) {
    this.trackEvent('challenge_viewed', { challengeId });
  }

  trackCardExported(challengeId: string) {
    this.trackEvent('card_exported', { challengeId });
  }

  trackCardShared(challengeId: string) {
    this.trackEvent('card_shared', { challengeId });
  }

  trackHistoryCleared() {
    this.trackEvent('history_cleared');
  }

  getEvents(): AnalyticsEvent[] {
    return this.events;
  }

  getEventCount(): number {
    return this.events.length;
  }

  private saveToStorage() {
    if (typeof window !== 'undefined') {
      try {
        // Keep only last 100 events
        const recentEvents = this.events.slice(-100);
        localStorage.setItem(this.storageKey, JSON.stringify(recentEvents));
      } catch (error) {
        console.error('Failed to save analytics:', error);
      }
    }
  }

  loadFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.events = JSON.parse(stored);
        }
      } catch (error) {
        console.error('Failed to load analytics:', error);
      }
    }
  }

  clearEvents() {
    this.events = [];
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.storageKey);
      } catch (error) {
        console.error('Failed to clear analytics:', error);
      }
    }
  }
}

export const analytics = new Analytics();
