/**
 * MockUserService for GSS Client
 * Mock implementation for development and testing
 */

import { UserService } from '../api/user.service';
import type { User, ProfileUpdateRequest } from '../../types/auth.types';

export class MockUserService extends UserService {
  private mockProfiles: Map<string, User> = new Map();

  constructor() {
    super('mock://api');

    // Pre-populate with test user
    this.mockProfiles.set('1', {
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User',
      avatar: undefined,
      homeCity: 'San Francisco',
      reliabilityScore: 0.85,
      level: 3,
      xp: 2500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  private simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 500 + 300; // 300-800ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  async getProfile(userId: string): Promise<User> {
    await this.simulateNetworkDelay();

    const profile = this.mockProfiles.get(userId);
    if (!profile) {
      throw new Error('User not found');
    }

    return { ...profile }; // Return copy
  }

  async updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User> {
    await this.simulateNetworkDelay();

    const profile = this.mockProfiles.get(userId);
    if (!profile) {
      throw new Error('User not found');
    }

    // Apply updates
    const updatedProfile: User = {
      ...profile,
      ...(updates.displayName && { displayName: updates.displayName }),
      ...(updates.homeCity && { homeCity: updates.homeCity }),
      ...(updates.avatar && { avatar: updates.avatar as string }),
      updatedAt: new Date().toISOString(),
    };

    this.mockProfiles.set(userId, updatedProfile);
    return { ...updatedProfile };
  }

  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    await this.simulateNetworkDelay();

    const profile = this.mockProfiles.get(userId);
    if (!profile) {
      throw new Error('User not found');
    }

    // Simulate avatar upload by generating a mock URL
    const avatarUrl = `https://example.com/avatars/${userId}/${file.name}`;

    // Update profile with new avatar
    profile.avatar = avatarUrl;
    profile.updatedAt = new Date().toISOString();

    return { avatarUrl };
  }
}
