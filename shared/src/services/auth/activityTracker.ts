/**
 * Activity Tracker Service
 * Tracks user activity and manages session timeout
 */

export interface IActivityTracker {
  trackActivity(): void;
  resetInactivityTimer(): void;
  startTracking(): void;
  stopTracking(): void;
  onSessionExpired(callback: () => void): void;
  setTimeoutDuration(durationMs: number): void;
}

/**
 * Activity Tracker Implementation
 */
export class ActivityTracker implements IActivityTracker {
  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private lastActivity: number = Date.now();
  private sessionExpiredCallback: (() => void) | null = null;
  private timeoutDuration: number = 30 * 60 * 1000; // Default: 30 minutes
  private isTracking: boolean = false;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_DELAY = 1000; // 1 second

  /**
   * Track user activity (debounced to prevent excessive updates)
   */
  trackActivity(): void {
    if (!this.isTracking) return;

    // Debounce activity tracking
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    this.debounceTimer = setTimeout(() => {
      this.lastActivity = Date.now();
      this.resetInactivityTimer();
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Reset the inactivity timeout timer
   */
  resetInactivityTimer(): void {
    if (!this.isTracking) return;

    // Clear existing timer
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }

    // Set new timer
    this.inactivityTimer = setTimeout(() => {
      if (this.sessionExpiredCallback) {
        this.sessionExpiredCallback();
      }
    }, this.timeoutDuration);
  }

  /**
   * Start tracking user activity
   */
  startTracking(): void {
    if (this.isTracking) return;

    this.isTracking = true;
    this.lastActivity = Date.now();
    this.resetInactivityTimer();

    // Set up event listeners (web only)
    const globalWindow = globalThis as unknown as {
      window?: { addEventListener: (event: string, handler: () => void) => void };
    };
    if (typeof globalWindow.window !== 'undefined' && globalWindow.window.addEventListener) {
      globalWindow.window.addEventListener('mousemove', this.handleActivity);
      globalWindow.window.addEventListener('keydown', this.handleActivity);
      globalWindow.window.addEventListener('click', this.handleActivity);
      globalWindow.window.addEventListener('scroll', this.handleActivity);
      globalWindow.window.addEventListener('touchstart', this.handleActivity);
    }
  }

  /**
   * Stop tracking user activity
   */
  stopTracking(): void {
    if (!this.isTracking) return;

    this.isTracking = false;

    // Clear timers
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }

    // Remove event listeners (web only)
    const globalWindow = globalThis as unknown as {
      window?: { removeEventListener: (event: string, handler: () => void) => void };
    };
    if (typeof globalWindow.window !== 'undefined' && globalWindow.window.removeEventListener) {
      globalWindow.window.removeEventListener('mousemove', this.handleActivity);
      globalWindow.window.removeEventListener('keydown', this.handleActivity);
      globalWindow.window.removeEventListener('click', this.handleActivity);
      globalWindow.window.removeEventListener('scroll', this.handleActivity);
      globalWindow.window.removeEventListener('touchstart', this.handleActivity);
    }
  }

  /**
   * Register callback for session expiration
   */
  onSessionExpired(callback: () => void): void {
    this.sessionExpiredCallback = callback;
  }

  /**
   * Set inactivity timeout duration
   */
  setTimeoutDuration(durationMs: number): void {
    this.timeoutDuration = durationMs;
    if (this.isTracking) {
      this.resetInactivityTimer();
    }
  }

  /**
   * Get last activity timestamp
   */
  getLastActivity(): number {
    return this.lastActivity;
  }

  /**
   * Get time since last activity
   */
  getTimeSinceLastActivity(): number {
    return Date.now() - this.lastActivity;
  }

  /**
   * Bound activity handler for event listeners
   */
  private handleActivity = (): void => {
    this.trackActivity();
  };
}

// Export singleton instance
export const activityTracker = new ActivityTracker();
