'use client';

import { useQuery } from '@tanstack/react-query';
import { getProfileApi } from '../api/settings.api';
import { settingsKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';

/**
 * Hook to fetch current user profile
 */
export function useProfile() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: settingsKeys.profile(),
    queryFn: getProfileApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    profile: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
