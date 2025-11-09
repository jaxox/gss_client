/**
 * HTTP Client Configuration for GSS Client
 * Ky-based HTTP client with auth interceptors and error handling
 */

import ky, { type Options, type KyInstance } from 'ky';
import type { ApiError } from '../../types/api.types';

interface RefreshTokenResponse {
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  };
}

/**
 * Mutex and request queue for handling concurrent token refresh
 */
export class TokenRefreshManager {
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<void> | null = null;
  private requestQueue: Array<() => void> = [];

  async acquireLock(): Promise<void> {
    if (this.isRefreshing && this.refreshPromise) {
      // Wait for the ongoing refresh to complete
      await this.refreshPromise;
      return;
    }

    // Acquire the lock
    this.isRefreshing = true;
    this.refreshPromise = new Promise(resolve => {
      this.requestQueue.push(resolve);
    });
  }

  releaseLock(): void {
    this.isRefreshing = false;
    this.refreshPromise = null;

    // Process all waiting requests
    const queue = [...this.requestQueue];
    this.requestQueue = [];
    queue.forEach(resolve => resolve());
  }

  isLocked(): boolean {
    return this.isRefreshing;
  }
}

const refreshManager = new TokenRefreshManager();

interface ErrorResponse {
  code?: string;
  message?: string;
  details?: Record<string, unknown>;
}

// Environment-specific base URL
// In real app, this would come from process.env or React Native Config
const getBaseURL = (): string => {
  // Check if we're in a Node.js/web environment with process.env
  if (
    typeof (globalThis as unknown as { process?: { env?: Record<string, string> } }).process !==
    'undefined'
  ) {
    const env = (globalThis as unknown as { process: { env?: Record<string, string> } }).process
      .env;
    if (env && env.REACT_APP_API_URL) {
      return env.REACT_APP_API_URL;
    }
  }
  return 'http://localhost:3000/api';
};

/**
 * Token storage interface for cross-platform compatibility
 * Will be implemented differently for web vs mobile
 */
export interface TokenStorage {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(accessToken: string, refreshToken: string, expiresAt: number): Promise<void>;
  clearTokens(): Promise<void>;
}

let tokenStorage: TokenStorage | null = null;

/**
 * Set the token storage implementation
 * Must be called during app initialization
 */
export function setTokenStorage(storage: TokenStorage): void {
  tokenStorage = storage;
}

/**
 * Check if running in production environment
 */
const isProduction = (): boolean => {
  if (
    typeof (globalThis as unknown as { process?: { env?: Record<string, string> } }).process !==
    'undefined'
  ) {
    const env = (globalThis as unknown as { process: { env?: Record<string, string> } }).process
      .env;
    return env?.NODE_ENV === 'production';
  }
  return false;
};

/**
 * Enforce HTTPS in production
 */
const enforceHTTPS = (url: string): void => {
  if (isProduction() && url.startsWith('http://')) {
    throw new Error('HTTPS is required in production. HTTP connections are not allowed.');
  }
};

/**
 * Create a ky instance with authentication interceptors and security headers
 */
const createHTTPClient = (): KyInstance => {
  const baseURL = getBaseURL();

  // Enforce HTTPS in production
  enforceHTTPS(baseURL);

  return ky.create({
    prefixUrl: baseURL,
    timeout: 30000, // 30 seconds
    retry: {
      limit: 2,
      methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        async (request): Promise<void> => {
          // Enforce HTTPS for each request in production
          enforceHTTPS(request.url);

          // Add auth token if available
          if (tokenStorage) {
            const accessToken = await tokenStorage.getAccessToken();
            if (accessToken) {
              request.headers.set('Authorization', `Bearer ${accessToken}`);
            }
          }

          // Add common headers
          request.headers.set('Content-Type', 'application/json');
          request.headers.set('Accept', 'application/json');

          // Add security headers
          request.headers.set('X-Content-Type-Options', 'nosniff');
          request.headers.set('X-Frame-Options', 'DENY');
          request.headers.set('X-XSS-Protection', '1; mode=block');
        },
      ],
      afterResponse: [
        async (_request, _options, response): Promise<Response> => {
          // Handle token refresh on 401
          if (response.status === 401 && tokenStorage) {
            // Use mutex to prevent concurrent refresh requests
            if (refreshManager.isLocked()) {
              // Wait for ongoing refresh to complete
              await refreshManager.acquireLock();

              // Try the original request again with (hopefully) new token
              const accessToken = await tokenStorage.getAccessToken();
              if (accessToken) {
                return ky(_request, {
                  ..._options,
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                });
              }
            } else {
              // Acquire lock and perform refresh
              await refreshManager.acquireLock();

              try {
                const refreshToken = await tokenStorage.getRefreshToken();

                if (refreshToken) {
                  // Attempt to refresh the token with exponential backoff
                  let retryCount = 0;
                  const maxRetries = 3;
                  let lastError: Error | null = null;

                  while (retryCount < maxRetries) {
                    try {
                      const refreshResponse = await ky.post('auth/refresh', {
                        prefixUrl: getBaseURL(),
                        json: { refreshToken },
                        retry: 0,
                        timeout: 10000,
                      });

                      const data = (await refreshResponse.json()) as RefreshTokenResponse;

                      if (data.tokens) {
                        await tokenStorage.setTokens(
                          data.tokens.accessToken,
                          data.tokens.refreshToken,
                          data.tokens.expiresAt
                        );

                        // Release lock before retrying
                        refreshManager.releaseLock();

                        // Retry the original request with new token
                        return ky(_request, {
                          ..._options,
                          headers: {
                            Authorization: `Bearer ${data.tokens.accessToken}`,
                          },
                        });
                      }
                      break; // Success, exit retry loop
                    } catch (error) {
                      lastError = error as Error;
                      retryCount++;

                      if (retryCount < maxRetries) {
                        // Exponential backoff: 1s, 2s, 4s
                        const delay = Math.pow(2, retryCount - 1) * 1000;
                        await new Promise<void>(resolve => setTimeout(() => resolve(), delay));
                      }
                    }
                  }

                  // All retries failed
                  if (lastError) {
                    throw lastError;
                  }
                }
              } catch (error) {
                // Refresh failed, clear tokens
                await tokenStorage.clearTokens();

                // Dispatch logout action if available (will be handled by Redux middleware)
                const globalWindow = globalThis as unknown as {
                  window?: { dispatchEvent: (event: { type: string }) => void };
                };
                if (
                  typeof globalWindow.window !== 'undefined' &&
                  globalWindow.window.dispatchEvent
                ) {
                  globalWindow.window.dispatchEvent({ type: 'auth:token-refresh-failed' });
                }

                throw error;
              } finally {
                // Always release lock
                refreshManager.releaseLock();
              }
            }
          }

          return response;
        },
      ],
      beforeError: [
        async (error): Promise<typeof error> => {
          const { response } = error;

          if (response) {
            try {
              const errorData = (await response.json()) as ErrorResponse;

              // Transform to ApiError format
              const apiError: ApiError = {
                code: errorData.code || `HTTP_${response.status}`,
                message: errorData.message || error.message || 'An error occurred',
                details: errorData.details || {},
                retryable: response.status >= 500 || response.status === 429,
              };

              // Attach to error for easier handling
              (error as unknown as { apiError: ApiError }).apiError = apiError;
            } catch (jsonError) {
              // Response is not JSON, create generic error
              const apiError: ApiError = {
                code: `HTTP_${response.status}`,
                message: `HTTP ${response.status}: ${response.statusText}`,
                details: {},
                retryable: response.status >= 500,
              };

              (error as unknown as { apiError: ApiError }).apiError = apiError;
            }
          }

          return error;
        },
      ],
    },
  });
};

/**
 * Main HTTP client instance
 */
export const httpClient = createHTTPClient();

/**
 * Helper to extract ApiError from HTTP error
 */
export function getApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'apiError' in error) {
    return (error as { apiError: ApiError }).apiError;
  }

  // Fallback for unexpected errors
  return {
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    details: {},
    retryable: false,
  };
}

/**
 * Type-safe API request helper
 */
export async function apiRequest<T>(endpoint: string, options?: Options): Promise<T> {
  try {
    const response = await httpClient(endpoint, options);
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw getApiError(error);
  }
}
