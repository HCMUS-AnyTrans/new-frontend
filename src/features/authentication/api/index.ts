// Re-export shared API client and error utilities for backward compatibility
export { apiClient, default as apiClientDefault } from '@/lib/api-client';
export { isApiError, getErrorMessage } from '@/lib/api-error';

// Auth-specific API functions
export * from './auth.api';
