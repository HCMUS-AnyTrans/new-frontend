'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateGlossaryApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import type { UpdateGlossaryDto, Glossary } from '../types';

interface UpdateGlossaryParams {
  glossaryId: string;
  dto: UpdateGlossaryDto;
}

interface UseUpdateGlossaryOptions {
  onSuccess?: (data: Glossary) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to update glossary metadata (domain, srcLang, tgtLang).
 * Invalidates both the list and detail caches on success.
 */
export function useUpdateGlossary(options?: UseUpdateGlossaryOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: ({ glossaryId, dto }: UpdateGlossaryParams) =>
      updateGlossaryApi(glossaryId, dto),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: glossaryKeys.list() });
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
    updateGlossary: mutation.mutate,
    updateGlossaryAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
