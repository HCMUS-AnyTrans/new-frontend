'use client';

import { useQuery } from '@tanstack/react-query';
import { getCurrentUserApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { authKeys } from '@/lib/query-client';
import type { User } from '../types';
import { useEffect } from 'react';

/**
 * Hook to fetch and sync current user data
 */
export function useCurrentUser() {
  const { isAuthenticated, setUser, accessToken } = useAuthStore();

  const query = useQuery({
    queryKey: authKeys.user(),
    queryFn: getCurrentUserApi,
    // Only fetch if we have an access token
    enabled: isAuthenticated && !!accessToken,
    // User data is relatively stable
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    // Don't retry on auth errors
    retry: (failureCount, error) => {
      if (error && typeof error === 'object' && 'statusCode' in error) {
        const statusCode = (error as { statusCode: number }).statusCode;
        if (statusCode === 401 || statusCode === 403) {
          return false;
        }
      }
      return failureCount < 2;
    },
  });

  // Sync fetched user data with store
  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return {
    user: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
