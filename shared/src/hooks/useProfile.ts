/**
 * Profile React Query Hook
 * Shared hook for profile data fetching and mutations with caching and persistence
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MockUserService } from '../services/mock/mockUser.service';
import { profilePersistenceService } from '../services/profilePersistence.service';
import type { User, ProfileUpdateRequest } from '../types/auth.types';

const userService = new MockUserService();

// Query keys for caching
export const profileKeys = {
  all: ['profile'] as const,
  detail: (userId: string) => [...profileKeys.all, userId] as const,
};

/**
 * Hook to fetch user profile with caching and persistence
 * @param userId - User ID to fetch profile for
 * @param enabled - Whether to enable the query (default: true)
 */
export function useProfile(
  userId: string | null,
  enabled = true
): ReturnType<typeof useQuery<User>> {
  return useQuery({
    queryKey: profileKeys.detail(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required');

      // Try to load from cache first
      const cachedProfile = await profilePersistenceService.loadProfile(userId);
      if (cachedProfile) {
        return cachedProfile;
      }

      // Fetch from network and save to cache
      const profile = await userService.getProfile(userId);
      await profilePersistenceService.saveProfile(userId, profile);
      return profile;
    },
    enabled: enabled && !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
  });
}

/**
 * Hook to update user profile with optimistic updates
 * @param userId - User ID to update
 */
export function useUpdateProfile(
  userId: string | null
): ReturnType<
  typeof useMutation<User, Error, ProfileUpdateRequest, { previousProfile?: User } | undefined>
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updates: ProfileUpdateRequest) => {
      if (!userId) throw new Error('User ID is required');
      return userService.updateProfile(userId, updates);
    },
    onMutate: async updates => {
      if (!userId) return;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: profileKeys.detail(userId) });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<User>(profileKeys.detail(userId));

      // Optimistically update to the new value
      if (previousProfile) {
        const optimisticProfile: User = {
          ...previousProfile,
          displayName: updates.displayName ?? previousProfile.displayName,
          homeCity: updates.homeCity ?? previousProfile.homeCity,
          updatedAt: new Date().toISOString(),
        };
        queryClient.setQueryData<User>(profileKeys.detail(userId), optimisticProfile);
      }

      // Return context with previous value
      return { previousProfile };
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousProfile && userId) {
        queryClient.setQueryData(profileKeys.detail(userId), context.previousProfile);
      }
    },
    onSuccess: async data => {
      // Update cache with server response and persist
      if (userId) {
        queryClient.setQueryData(profileKeys.detail(userId), data);
        await profilePersistenceService.saveProfile(userId, data);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      if (userId) {
        queryClient.invalidateQueries({ queryKey: profileKeys.detail(userId) });
      }
    },
  });
}

/**
 * Hook to prefetch profile data (useful for navigation)
 */
export function usePrefetchProfile(): (userId: string) => void {
  const queryClient = useQueryClient();

  return (userId: string): void => {
    queryClient.prefetchQuery({
      queryKey: profileKeys.detail(userId),
      queryFn: () => userService.getProfile(userId),
      staleTime: 5 * 60 * 1000,
    });
  };
}
