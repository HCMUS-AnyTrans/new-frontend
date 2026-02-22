'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPreferencesApi,
  updatePreferencesApi,
} from '../api/settings.api';
import { settingsKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { UserPreferences, UpdatePreferencesDto } from '../types';

/**
 * Hook to fetch user preferences
 */
export function usePreferences() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: settingsKeys.preferences(),
    queryFn: getPreferencesApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    preferences: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to update user preferences
 */
export function useUpdatePreferences() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dto: UpdatePreferencesDto) => updatePreferencesApi(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(settingsKeys.preferences(), data);
    },
  });

  return {
    updatePreferences: mutation.mutate,
    updatePreferencesAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
