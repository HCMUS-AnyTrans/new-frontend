'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkImportTermsApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import type { BulkCreateTermsDto, BulkImportResult } from '../types';

interface BulkImportParams {
  glossaryId: string;
  dto: BulkCreateTermsDto;
}

interface UseBulkImportOptions {
  onSuccess?: (data: BulkImportResult) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to bulk import terms into a glossary (max 500 per request).
 * Invalidates terms list, glossary detail, and glossary list caches on success.
 */
export function useBulkImport(options?: UseBulkImportOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: ({ glossaryId, dto }: BulkImportParams) =>
      bulkImportTermsApi(glossaryId, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.terms(variables.glossaryId),
      });
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.detail(variables.glossaryId),
      });
      queryClient.invalidateQueries({ queryKey: glossaryKeys.list() });
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    bulkImport: mutation.mutate,
    bulkImportAsync: mutation.mutateAsync,
    isImporting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
