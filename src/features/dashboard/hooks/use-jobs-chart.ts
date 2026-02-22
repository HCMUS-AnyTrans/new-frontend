'use client';

import { useQuery } from '@tanstack/react-query';
import { getJobsChartApi } from '../api/dashboard.api';
import { dashboardKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { JobsChartQuery } from '../types';

/**
 * Hook to fetch jobs chart data grouped by day
 */
export function useJobsChart(query?: JobsChartQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: dashboardKeys.jobsChart(query),
    queryFn: () => getJobsChartApi(query),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    chartData: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
