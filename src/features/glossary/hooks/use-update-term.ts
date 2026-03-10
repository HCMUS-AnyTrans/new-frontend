'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTermApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import type { UpdateTermDto, Term } from '../types';

interface UpdateTermParams {
  glossaryId: string;
  termId: string;
  dto: UpdateTermDto;
}

interface UseUpdateTermOptions {
  onSuccess?: (data: Term) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to update a single term (srcTerm and/or tgtTerm).
 * Invalidates the terms list and glossary detail caches on success.
 */
export function useUpdateTerm(options?: UseUpdateTermOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: ({ glossaryId, termId, dto }: UpdateTermParams) =>
      updateTermApi(glossaryId, termId, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.terms(variables.glossaryId),
      });
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.detail(variables.glossaryId),
      });
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    updateTerm: mutation.mutate,
    updateTermAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
