'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteGlossaryApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';

interface UseDeleteGlossaryOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

/**
 * Hook to delete a glossary and all its terms (cascade).
 * Invalidates the glossary list cache on success.
 */
export function useDeleteGlossary(options?: UseDeleteGlossaryOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: (glossaryId: string) => deleteGlossaryApi(glossaryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: glossaryKeys.all });
      onSuccess?.();
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    deleteGlossary: mutation.mutate,
    deleteGlossaryAsync: mutation.mutateAsync,
    isDeleting: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
