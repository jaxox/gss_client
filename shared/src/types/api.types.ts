/**
 * API Response Types for GSS Client
 * Standard response wrappers and error handling
 */

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  meta?: {
    timestamp: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  retryable: boolean;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: PaginationMeta;
    timestamp: string;
  };
}

export type ApiErrorResponse = {
  error: ApiError;
  success: false;
};

export type ApiSuccessResponse<T> = {
  data: T;
  success: true;
  message?: string;
};

export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;
