'use client';

import { useQuery } from '@tanstack/react-query';
import { getDashboardStatsApi } from '../api/dashboard.api';
import { dashboardKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { DashboardStatsQuery } from '../types';

/**
 * Hook to fetch dashboard statistics overview
 */
export function useDashboardStats(query?: DashboardStatsQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: dashboardKeys.stats(query),
    queryFn: () => getDashboardStatsApi(query),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
