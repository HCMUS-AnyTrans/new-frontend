import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';
import {
  getAccessToken,
  setAccessToken,
  clearAuthState,
} from '@/features/auth/store';
import type { ApiError } from '@/types';

// Environment configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const IS_DEV = process.env.NODE_ENV === 'development';

/**
 * Create axios instance with default configuration
 * This is the central API client used by all feature modules
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true, // Important: enables cookie handling for refresh token
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Track if we're currently refreshing the token
let isRefreshing = false;
// Queue of requests waiting for token refresh
let failedQueue: Array<{
  resolve: (token: string | null) => void;
  reject: (error: Error) => void;
}> = [];

/**
 * Process the queue of failed requests after token refresh
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Get current locale from URL path
 * - /en/dashboard -> 'en'
 * - /dashboard -> 'vi' (default locale has no prefix)
 */
const getLocaleFromPath = (): string => {
  if (typeof window === 'undefined') return 'vi';
  const pathLocale = window.location.pathname.split('/')[1];
  return ['en'].includes(pathLocale) ? pathLocale : 'vi';
};

/**
 * Request interceptor - adds authorization header, Accept-Language, and logging
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authorization header if token exists
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add Accept-Language header for backend localization
    if (config.headers) {
      config.headers['Accept-Language'] = getLocaleFromPath();
    }

    // Development logging
    if (IS_DEV) {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`,
        config.data ? { data: config.data } : ''
      );
    }

    return config;
  },
  (error) => {
    if (IS_DEV) {
      console.error('[API Request Error]', error);
    }
    return Promise.reject(error);
  }
);

// Type for auth refresh response
interface AuthRefreshResponse {
  accessToken: string;
  user: unknown;
}

/**
 * Response interceptor - handles errors and token refresh
 */
apiClient.interceptors.response.use(
  (response) => {
    // Development logging
    if (IS_DEV) {
      console.log(
        `[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`,
        { status: response.status, data: response.data }
      );
    }
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Development logging
    if (IS_DEV) {
      console.error(
        `[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`,
        {
          status: error.response?.status,
          data: error.response?.data,
        }
      );
    }

    // Handle 401 Unauthorized - attempt token refresh
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Don't retry if this is already a refresh request or login request
      const isAuthEndpoint =
        originalRequest.url?.includes('/auth/refresh') ||
        originalRequest.url?.includes('/auth/login');

      if (isAuthEndpoint) {
        // Don't clear auth state for login failures (user might just have wrong credentials)
        if (!originalRequest.url?.includes('/auth/login')) {
          clearAuthState();
        }
        // Transform to ApiError format before rejecting
        const apiError: ApiError = {
          message:
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred',
          statusCode: error.response?.status || 500,
          error: error.response?.data?.error,
          errors: error.response?.data?.errors,
        };
        return Promise.reject(apiError);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject: (err) => {
              reject(err);
            },
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Attempt to refresh the token
        const response = await apiClient.post<AuthRefreshResponse>('/auth/refresh');
        const { accessToken } = response.data;

        // Update the store with new token
        setAccessToken(accessToken);

        // Update the authorization header for the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Process queued requests
        processQueue(null, accessToken);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear auth state and redirect to login
        processQueue(refreshError as Error, null);
        clearAuthState();

        // Redirect to login (only in browser)
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (!currentPath.includes('/login')) {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Transform error to consistent format
    const apiError: ApiError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      error: error.response?.data?.error,
      errors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
