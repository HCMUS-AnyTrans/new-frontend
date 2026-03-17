'use client';

import { useQuery } from '@tanstack/react-query';
import { getGlossaryApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';

/**
 * Hook to fetch a single glossary with its first 50 terms.
 * Pass glossaryId to enable the query; pass null/undefined to disable.
 */
export function useGlossaryDetail(glossaryId: string | null | undefined) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: glossaryKeys.detail(glossaryId!),
    queryFn: () => getGlossaryApi(glossaryId!),
    enabled: isAuthenticated && !!accessToken && !!glossaryId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    glossary: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
