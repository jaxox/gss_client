/**
 * User Service Interface for GSS Client
 * Handles user profile operations (view, edit, avatar management)
 */

import type { User, ProfileUpdateRequest } from '../../types/auth.types';

export abstract class UserService {
  protected baseURL: string;

  constructor(baseURL: string = '') {
    this.baseURL = baseURL;
  }

  /**
   * Get user profile by ID
   * @param userId - User ID to fetch profile for
   * @returns Promise resolving to User object
   */
  abstract getProfile(userId: string): Promise<User>;

  /**
   * Update user profile
   * @param userId - User ID to update
   * @param updates - Profile fields to update (displayName, homeCity)
   * @returns Promise resolving to updated User object
   */
  abstract updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User>;

  /**
   * Upload user avatar (DISABLED IN MVP - placeholder for future implementation)
   * @param userId - User ID
   * @param file - Avatar image file
   * @returns Promise resolving to avatar URL
   */
  abstract uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }>;
}
