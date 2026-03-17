'use client';

import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { listGlossariesApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { GlossaryQueryParams } from '../types';

/**
 * Hook to fetch paginated list of glossaries for the current user.
 * Supports filtering by domain, srcLang, tgtLang, and free-text search.
 */
export function useGlossaries(params?: GlossaryQueryParams) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: glossaryKeys.list(params),
    queryFn: () => listGlossariesApi(params),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });

  return {
    glossaries: result.data?.items,
    pagination: result.data?.pagination,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
