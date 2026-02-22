'use client';

import { useQuery } from '@tanstack/react-query';
import { getRecentJobsApi } from '../api/dashboard.api';
import type { RecentJobsQuery } from '../api/dashboard.api';
import { translationKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';

/**
 * Hook to fetch recent translation jobs for dashboard
 */
export function useRecentJobs(params?: RecentJobsQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: translationKeys.list(params),
    queryFn: () => getRecentJobsApi(params),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
  });

  return {
    jobsData: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
