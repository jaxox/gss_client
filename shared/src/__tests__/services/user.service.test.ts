/**
 * User Service Tests
 * Tests for MockUserService implementation
 */

import { MockUserService } from '../../services/mock/mockUser.service';

describe('MockUserService', () => {
  let userService: MockUserService;

  beforeEach(() => {
    userService = new MockUserService();
  });

  describe('getProfile', () => {
    it('should return user profile for valid user ID', async () => {
      const profile = await userService.getProfile('1');

      expect(profile).toBeDefined();
      expect(profile.id).toBe('1');
      expect(profile.displayName).toBe('Test User');
      expect(profile.email).toBe('test@example.com');
      expect(profile.homeCity).toBe('San Francisco');
      expect(profile.reliabilityScore).toBe(0.85);
      expect(profile.level).toBe(3); // Actual mock data has level 3
      expect(profile.xp).toBe(2500); // Actual mock data has xp 2500
    });
    it('should throw error for non-existent user ID', async () => {
      await expect(userService.getProfile('999')).rejects.toThrow('User not found');
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await userService.getProfile('1');
      const endTime = Date.now();

      // Should take at least 300ms (minimum delay)
      expect(endTime - startTime).toBeGreaterThanOrEqual(300);
    });
  });

  describe('updateProfile', () => {
    it('should update display name', async () => {
      const updates = { displayName: 'Updated Name' };
      const updatedProfile = await userService.updateProfile('1', updates);

      expect(updatedProfile.displayName).toBe('Updated Name');
      expect(updatedProfile.homeCity).toBe('San Francisco'); // Should remain unchanged
    });

    it('should update home city', async () => {
      const updates = { homeCity: 'New York' };
      const updatedProfile = await userService.updateProfile('1', updates);

      expect(updatedProfile.homeCity).toBe('New York');
      expect(updatedProfile.displayName).toBe('Test User'); // Should remain unchanged
    });

    it('should update both display name and home city', async () => {
      const updates = {
        displayName: 'Jane Doe',
        homeCity: 'Los Angeles',
      };
      const updatedProfile = await userService.updateProfile('1', updates);

      expect(updatedProfile.displayName).toBe('Jane Doe');
      expect(updatedProfile.homeCity).toBe('Los Angeles');
    });

    it('should update the updatedAt timestamp', async () => {
      const beforeUpdate = new Date().toISOString();
      const updates = { displayName: 'Updated Name' };
      const updatedProfile = await userService.updateProfile('1', updates);

      expect(new Date(updatedProfile.updatedAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeUpdate).getTime()
      );
    });

    it('should throw error for non-existent user ID', async () => {
      const updates = { displayName: 'Test' };
      await expect(userService.updateProfile('999', updates)).rejects.toThrow('User not found');
    });

    it('should persist changes across getProfile calls', async () => {
      const updates = { displayName: 'Persistent Name' };
      await userService.updateProfile('1', updates);

      const profile = await userService.getProfile('1');
      expect(profile.displayName).toBe('Persistent Name');
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      const updates = { displayName: 'Test' };
      await userService.updateProfile('1', updates);
      const endTime = Date.now();

      // Should take at least 300ms (minimum delay)
      expect(endTime - startTime).toBeGreaterThanOrEqual(300);
    });
  });

  describe('uploadAvatar', () => {
    it('should return avatar URL for uploaded file', async () => {
      const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
      const result = await userService.uploadAvatar('1', mockFile);

      expect(result).toBeDefined();
      expect(result.avatarUrl).toContain('https://example.com/avatars/1/avatar.png');
    });

    it('should throw error for non-existent user', async () => {
      const mockFile = new File([''], 'avatar.png', { type: 'image/png' });
      await expect(userService.uploadAvatar('999', mockFile)).rejects.toThrow('User not found');
    });
  });
});
