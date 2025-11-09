/**
 * Profile Persistence Service
 * Handles caching profile data to AsyncStorage for offline access and performance
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth.types';

const PROFILE_CACHE_KEY = 'gss_profile_cache';
const PROFILE_TIMESTAMP_KEY = 'gss_profile_timestamp';
const CACHE_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export class ProfilePersistenceService {
  /**
   * Save profile to local storage
   */
  async saveProfile(userId: string, profile: User): Promise<void> {
    try {
      const cacheData = {
        [userId]: profile,
      };
      await AsyncStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cacheData));
      await AsyncStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString());
    } catch (error) {
      console.error('Failed to save profile to cache:', error);
    }
  }

  /**
   * Load profile from local storage
   * Returns null if not found or expired
   */
  async loadProfile(userId: string): Promise<User | null> {
    try {
      const cached = await AsyncStorage.getItem(PROFILE_CACHE_KEY);
      const timestamp = await AsyncStorage.getItem(PROFILE_TIMESTAMP_KEY);

      if (!cached || !timestamp) {
        return null;
      }

      const cacheAge = Date.now() - parseInt(timestamp, 10);
      if (cacheAge > CACHE_EXPIRATION_MS) {
        // Cache expired, clear it
        await this.clearProfile();
        return null;
      }

      const cacheData = JSON.parse(cached);
      return cacheData[userId] || null;
    } catch (error) {
      console.error('Failed to load profile from cache:', error);
      return null;
    }
  }

  /**
   * Clear cached profile data
   */
  async clearProfile(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([PROFILE_CACHE_KEY, PROFILE_TIMESTAMP_KEY]);
    } catch (error) {
      console.error('Failed to clear profile cache:', error);
    }
  }

  /**
   * Check if cached profile exists and is valid
   */
  async hasCachedProfile(userId: string): Promise<boolean> {
    const profile = await this.loadProfile(userId);
    return profile !== null;
  }
}

export const profilePersistenceService = new ProfilePersistenceService();
