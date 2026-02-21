'use client';

import { useQuery } from '@tanstack/react-query';
import { getCreditsChartApi } from '../api/dashboard.api';
import { dashboardKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { CreditsChartQuery } from '../types';

/**
 * Hook to fetch credit usage breakdown
 */
export function useCreditsChart(query?: CreditsChartQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: dashboardKeys.creditsChart(query),
    queryFn: () => getCreditsChartApi(query),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    creditsData: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
