'use client';

import { useQuery } from '@tanstack/react-query';
import { listTermsApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { TermQueryParams } from '../types';

/**
 * Hook to fetch a paginated list of terms within a glossary.
 * Supports search across srcTerm and tgtTerm.
 * Pass glossaryId to enable; pass null/undefined to disable.
 */
export function useTerms(
  glossaryId: string | null | undefined,
  params?: TermQueryParams,
) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: glossaryKeys.terms(glossaryId!, params),
    queryFn: () => listTermsApi(glossaryId!, params),
    enabled: isAuthenticated && !!accessToken && !!glossaryId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    terms: result.data?.items,
    pagination: result.data?.pagination,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
