'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createGlossaryApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import type { CreateGlossaryDto, Glossary } from '../types';

interface UseCreateGlossaryOptions {
  onSuccess?: (data: Glossary) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to create a new glossary.
 * Invalidates the glossary list cache on success.
 */
export function useCreateGlossary(options?: UseCreateGlossaryOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: (dto: CreateGlossaryDto) => createGlossaryApi(dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: glossaryKeys.all });
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    createGlossary: mutation.mutate,
    createGlossaryAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
