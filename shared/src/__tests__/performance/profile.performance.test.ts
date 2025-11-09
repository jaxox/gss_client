/**
 * Performance Tests for Profile Loading
 * Validates that profile operations meet NFR requirement of <800ms
 */

import { MockUserService } from '../../services/mock/mockUser.service';

describe('Profile Performance Tests', () => {
  let userService: MockUserService;

  beforeEach(() => {
    userService = new MockUserService();
  });

  it('should load profile in under 800ms', async () => {
    const startTime = Date.now();

    await userService.getProfile('1'); // Using pre-populated test user

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(800);
  });

  it('should update profile in under 800ms', async () => {
    const startTime = Date.now();

    await userService.updateProfile('1', {
      displayName: 'Updated Name',
      homeCity: 'New York',
    });

    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(800);
  });

  it('should handle repeated profile loads efficiently', async () => {
    const iterations = 5;
    const durations: number[] = [];

    for (let i = 0; i < iterations; i++) {
      const startTime = Date.now();
      await userService.getProfile('1');
      durations.push(Date.now() - startTime);
    }

    const averageDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const maxDuration = Math.max(...durations);

    expect(averageDuration).toBeLessThan(800);
    expect(maxDuration).toBeLessThan(800);
  });
});
