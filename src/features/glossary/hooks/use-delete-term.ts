'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTermApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';

interface DeleteTermParams {
  glossaryId: string;
  termId: string;
}

interface UseDeleteTermOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook to delete a single term from a glossary.
 * Invalidates terms list, glossary detail, and glossary list caches on success
 * (termCount changes).
 */
export function useDeleteTerm(options?: UseDeleteTermOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: ({ glossaryId, termId }: DeleteTermParams) =>
      deleteTermApi(glossaryId, termId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.terms(variables.glossaryId),
      });
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.detail(variables.glossaryId),
      });
      // Also invalidate list since termCount changed
      queryClient.invalidateQueries({ queryKey: glossaryKeys.list() });
      onSuccess?.();
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    deleteTerm: mutation.mutate,
    deleteTermAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
