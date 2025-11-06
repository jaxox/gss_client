/**
 * MockAuthService for GSS Client
 * Mock implementation for development and testing
 */

import { AuthService } from '../api/auth.service';
import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  SSOLoginRequest,  
  User,
  ProfileUpdateRequest,
} from '../../types/auth.types';

export class MockAuthService extends AuthService {
  private mockUsers: User[] = [];
  private mockTokens: Map<string, AuthTokens> = new Map();
  
  constructor() {
    super('mock://api');
    
    // Pre-populate with test users
    this.mockUsers.push({
      id: '1',
      email: 'test@example.com',
      displayName: 'Test User',
      homeCity: 'San Francisco',
      reliabilityScore: 0.85,
      level: 3,
      xp: 2500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await this.simulateNetworkDelay();
    
    const user = this.mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const tokens = this.generateMockTokens();
    this.mockTokens.set(user.id, tokens);
    
    return { user, tokens };
  }
  
  async loginSSO(request: SSOLoginRequest): Promise<AuthResponse> {
    await this.simulateNetworkDelay();
    
    // Simulate Google SSO login
    if (request.provider === 'google') {
      const user: User = {
        id: Date.now().toString(),
        email: 'google.user@gmail.com',
        displayName: 'Google User',
        avatar: 'https://lh3.googleusercontent.com/a/default-user',
        homeCity: '', // Will be filled by user
        reliabilityScore: 0.0, // New user
        level: 1,
        xp: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      this.mockUsers.push(user);
      const tokens = this.generateMockTokens();
      this.mockTokens.set(user.id, tokens);
      
      return { user, tokens };
    }
    
    throw new Error('SSO provider not supported');
  }
  
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await this.simulateNetworkDelay();
    
    const existingUser = this.mockUsers.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    
    const user: User = {
      id: Date.now().toString(),
      email: userData.email,
      displayName: userData.displayName,
      homeCity: userData.homeCity,
      reliabilityScore: 0.0,
      level: 1,
      xp: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    this.mockUsers.push(user);
    const tokens = this.generateMockTokens();
    this.mockTokens.set(user.id, tokens);
    
    return { user, tokens };
  }
  
  async logout(): Promise<void> {
    await this.simulateNetworkDelay();
    // In real implementation, would invalidate tokens on server
  }
  
  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    await this.simulateNetworkDelay();
    return this.generateMockTokens();
  }
  
  async getCurrentUser(): Promise<User> {
    await this.simulateNetworkDelay();
    return this.mockUsers[0]; // Return first user for simplicity
  }
  
  async forgotPassword(email: string): Promise<void> {
    await this.simulateNetworkDelay();
    console.log(`Mock: Password reset email sent to ${email}`);
  }
  
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.simulateNetworkDelay();
    console.log('Mock: Password reset successfully');
  }
  
  async getProfile(userId: string): Promise<User> {
    await this.simulateNetworkDelay();
    const user = this.mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
  
  async updateProfile(userId: string, updates: ProfileUpdateRequest): Promise<User> {
    await this.simulateNetworkDelay();
    
    const userIndex = this.mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    this.mockUsers[userIndex] = {
      ...this.mockUsers[userIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return this.mockUsers[userIndex];
  }
  
  async uploadAvatar(userId: string, file: File): Promise<{ avatarUrl: string }> {
    await this.simulateNetworkDelay();
    
    // Simulate avatar upload
    const mockUrl = `https://api.gss.example.com/avatars/${userId}_${Date.now()}.jpg`;
    
    // Update user's avatar
    const userIndex = this.mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      this.mockUsers[userIndex].avatar = mockUrl;
    }
    
    return { avatarUrl: mockUrl };
  }
  
  private generateMockTokens(): AuthTokens {
    return {
      accessToken: 'mock_access_token_' + Date.now(),
      refreshToken: 'mock_refresh_token_' + Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
  }
  
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
