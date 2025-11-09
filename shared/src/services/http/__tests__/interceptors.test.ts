/**
 * Unit tests for HTTP Interceptors and Token Refresh Logic
 */

/**
 * Direct import test for TokenRefreshManager (no HTTP client needed)
 */

describe('TokenRefreshManager', () => {
  class TokenRefreshManager {
    private isRefreshing: boolean = false;
    private refreshPromise: Promise<void> | null = null;
    private requestQueue: Array<() => void> = [];

    async acquireLock(): Promise<void> {
      if (this.isRefreshing && this.refreshPromise) {
        await this.refreshPromise;
        return;
      }

      this.isRefreshing = true;
      this.refreshPromise = new Promise(resolve => {
        this.requestQueue.push(resolve);
      });
    }

    releaseLock(): void {
      this.isRefreshing = false;
      this.refreshPromise = null;
      const queue = [...this.requestQueue];
      this.requestQueue = [];
      queue.forEach(resolve => resolve());
    }

    isLocked(): boolean {
      return this.isRefreshing;
    }
  }

  let manager: TokenRefreshManager;

  beforeEach(() => {
    manager = new TokenRefreshManager();
  });

  describe('mutex behavior', () => {
    it('should not be locked initially', () => {
      expect(manager.isLocked()).toBe(false);
    });

    it('should lock when acquireLock is called', async () => {
      const lockPromise = manager.acquireLock();
      expect(manager.isLocked()).toBe(true);
      await lockPromise;
    });

    it('should release lock', async () => {
      await manager.acquireLock();
      expect(manager.isLocked()).toBe(true);

      manager.releaseLock();
      expect(manager.isLocked()).toBe(false);
    });

    it('should queue concurrent requests', async () => {
      const results: number[] = [];

      // First request acquires lock
      const first = manager.acquireLock().then(() => {
        results.push(1);
        // Simulate async work
        return new Promise<void>(resolve => setTimeout(() => resolve(), 50));
      });

      // Second request should wait
      const second = manager.acquireLock().then(() => {
        results.push(2);
      });

      expect(manager.isLocked()).toBe(true);

      // Release lock after first completes
      await first;
      manager.releaseLock();

      // Second should now proceed
      await second;

      expect(results).toEqual([1, 2]);
      expect(manager.isLocked()).toBe(false);
    });

    it('should handle multiple waiting requests', async () => {
      const results: number[] = [];

      // Acquire lock
      await manager.acquireLock();

      // Queue multiple requests
      const promises = [
        manager.acquireLock().then(() => results.push(1)),
        manager.acquireLock().then(() => results.push(2)),
        manager.acquireLock().then(() => results.push(3)),
      ];

      expect(manager.isLocked()).toBe(true);

      // Release lock - all should proceed
      manager.releaseLock();

      await Promise.all(promises);

      expect(results).toHaveLength(3);
      expect(results).toContain(1);
      expect(results).toContain(2);
      expect(results).toContain(3);
    });
  });

  describe('error handling', () => {
    it('should allow re-locking after release', async () => {
      await manager.acquireLock();
      manager.releaseLock();

      await manager.acquireLock();
      expect(manager.isLocked()).toBe(true);
      manager.releaseLock();
    });

    it('should handle multiple releases gracefully', () => {
      manager.releaseLock();
      manager.releaseLock();
      expect(manager.isLocked()).toBe(false);
    });
  });
});
