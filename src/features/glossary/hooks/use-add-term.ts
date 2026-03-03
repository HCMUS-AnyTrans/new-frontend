'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTermApi } from '../api/glossary.api';
import { glossaryKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import type { CreateTermDto, Term, TermListResponse, GlossaryDetail } from '../types';

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
 * Uses optimistic update to show the new term immediately in the UI,
 * then syncs with server data on success/error.
 */
export function useAddTerm(options?: UseAddTermOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: ({ glossaryId, dto }: AddTermParams) =>
      addTermApi(glossaryId, dto),

    onMutate: async ({ glossaryId, dto }) => {
      // 1. Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: glossaryKeys.terms(glossaryId),
      });
      await queryClient.cancelQueries({
        queryKey: glossaryKeys.detail(glossaryId),
      });

      // 2. Snapshot previous data for rollback
      const previousTermsQueries = queryClient.getQueriesData<TermListResponse>({
        queryKey: glossaryKeys.terms(glossaryId),
      });
      const previousDetail = queryClient.getQueryData<GlossaryDetail>(
        glossaryKeys.detail(glossaryId)
      );

      // 3. Create optimistic term
      const optimisticTerm: Term = {
        id: `optimistic-${Date.now()}`,
        glossaryId,
        srcTerm: dto.srcTerm,
        tgtTerm: dto.tgtTerm,
      };

      // 4. Optimistically update all matching terms queries (any page/params)
      queryClient.setQueriesData<TermListResponse>(
        { queryKey: glossaryKeys.terms(glossaryId) },
        (old) => {
          if (!old) return old;
          // Insert at correct alphabetical position (matching server sort: srcTerm ASC)
          const newItems = [...old.items];
          const insertIndex = newItems.findIndex(
            (t) => t.srcTerm.localeCompare(optimisticTerm.srcTerm) > 0
          );
          if (insertIndex === -1) {
            newItems.push(optimisticTerm);
          } else {
            newItems.splice(insertIndex, 0, optimisticTerm);
          }
          return {
            ...old,
            items: newItems,
            pagination: {
              ...old.pagination,
              total: old.pagination.total + 1,
            },
          };
        }
      );

      // 5. Optimistically update termCount in glossary detail
      if (previousDetail) {
        queryClient.setQueryData<GlossaryDetail>(
          glossaryKeys.detail(glossaryId),
          {
            ...previousDetail,
            termCount: previousDetail.termCount + 1,
          }
        );
      }

      return { previousTermsQueries, previousDetail };
    },

    onError: (error, variables, context) => {
      // Rollback terms queries
      if (context?.previousTermsQueries) {
        for (const [queryKey, data] of context.previousTermsQueries) {
          queryClient.setQueryData(queryKey, data);
        }
      }
      // Rollback glossary detail
      if (context?.previousDetail) {
        queryClient.setQueryData(
          glossaryKeys.detail(variables.glossaryId),
          context.previousDetail
        );
      }

      const message = getErrorMessage(error);
      onError?.(message);
    },

    onSuccess: (data, variables) => {
      onSuccess?.(data);
    },

    onSettled: (_data, _error, variables) => {
      // Always refetch to sync with server (replace optimistic data with real data)
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.terms(variables.glossaryId),
      });
      queryClient.invalidateQueries({
        queryKey: glossaryKeys.detail(variables.glossaryId),
      });
      queryClient.invalidateQueries({ queryKey: glossaryKeys.list() });
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
