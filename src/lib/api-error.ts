import type { ApiError } from '@/types';

/**
 * Helper function to check if an error is an ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error
  );
}

/**
 * Get error message from unknown error
 * Useful for displaying user-friendly error messages
 */
export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

/**
 * Get validation errors from API error response
 * Returns a record of field names to error messages
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isApiError(error) && error.errors) {
    return error.errors;
  }
  return null;
}

/**
 * Check if error is a specific HTTP status code
 */
export function isHttpError(error: unknown, statusCode: number): boolean {
  return isApiError(error) && error.statusCode === statusCode;
}

/**
 * Check if error is an authentication error (401)
 */
export function isUnauthorizedError(error: unknown): boolean {
  return isHttpError(error, 401);
}

/**
 * Check if error is a forbidden error (403)
 */
export function isForbiddenError(error: unknown): boolean {
  return isHttpError(error, 403);
}

/**
 * Check if error is a not found error (404)
 */
export function isNotFoundError(error: unknown): boolean {
  return isHttpError(error, 404);
}
