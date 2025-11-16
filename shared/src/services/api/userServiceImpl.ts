/**
 * Real UserService Implementation for GSS Client
 * Uses ky HTTP client to communicate with backend API
 */

import { UserService } from './user.service';
import { httpClient, getApiError } from '../http/client';
import type { User, ProfileUpdateRequest } from '../../types/auth.types';

export class UserServiceImpl extends UserService {
  constructor(baseURL: string = '') {
    super(baseURL);
  }

  async getProfile(userId: string): Promise<User> {
    try {
      const response = await httpClient.get(`users/${userId}/profile`).json<{ user: User }>();
      return response.user;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User> {
    try {
      const response = await httpClient
        .patch(`users/${userId}/profile`, {
          json: updates,
        })
        .json<{ user: User }>();
      return response.user;
    } catch (error) {
      throw getApiError(error);
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await httpClient
        .post(`users/${userId}/avatar`, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          body: formData as any, // FormData type differs between web and RN
          headers: {}, // Let browser set Content-Type with boundary
        })
        .json<{ avatarUrl: string }>();

      return response;
    } catch (error) {
      throw getApiError(error);
    }
  }
}
