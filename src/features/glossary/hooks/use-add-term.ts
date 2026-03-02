'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTermApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import type { CreateTermDto, Term } from '../types';

interface AddTermParams {
  glossaryId: string;
  dto: CreateTermDto;
}

interface UseAddTermOptions {
  onSuccess?: (data: Term) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to add a single term to a glossary.
 * Invalidates both the terms list and glossary detail caches on success
 * (detail cache includes termCount which changes).
 */
export function useAddTerm(options?: UseAddTermOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: ({ glossaryId, dto }: AddTermParams) =>
      addTermApi(glossaryId, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.terms(variables.glossaryId),
      });
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.detail(variables.glossaryId),
      });
      // Also invalidate list since termCount changed
      queryClient.invalidateQueries({ queryKey: glossaryKeys.list() });
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    addTerm: mutation.mutate,
    addTermAsync: mutation.mutateAsync,
    isAdding: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
