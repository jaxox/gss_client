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
 * Create a ky instance with authentication interceptors
 */
const createHTTPClient = (): KyInstance => {
  return ky.create({
    prefixUrl: getBaseURL(),
    timeout: 30000, // 30 seconds
    retry: {
      limit: 2,
      methods: ['get', 'put', 'head', 'delete', 'options', 'trace'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
    },
    hooks: {
      beforeRequest: [
        async (request): Promise<void> => {
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
        },
      ],
      afterResponse: [
        async (_request, _options, response): Promise<Response> => {
          // Handle token refresh on 401
          if (response.status === 401 && tokenStorage) {
            const refreshToken = await tokenStorage.getRefreshToken();

            if (refreshToken) {
              try {
                // Attempt to refresh the token
                const refreshResponse = await ky.post('auth/refresh', {
                  prefixUrl: getBaseURL(),
                  json: { refreshToken },
                  retry: 0,
                });

                const data = (await refreshResponse.json()) as RefreshTokenResponse;

                if (data.tokens) {
                  await tokenStorage.setTokens(
                    data.tokens.accessToken,
                    data.tokens.refreshToken,
                    data.tokens.expiresAt
                  );

                  // Retry the original request with new token
                  return ky(_request, {
                    ..._options,
                    headers: {
                      ..._request.headers,
                      Authorization: `Bearer ${data.tokens.accessToken}`,
                    },
                  });
                }
              } catch (error) {
                // Refresh failed, clear tokens and redirect to login
                await tokenStorage.clearTokens();
                throw error;
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
