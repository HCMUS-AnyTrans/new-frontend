'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileApi } from '../api/settings.api';
import { settingsKeys } from '@/lib/query-client';
import { authKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import type { UpdateProfileDto, UserProfile } from '../types';

interface UseUpdateProfileOptions {
  onSuccess?: (data: UserProfile) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to update current user profile (fullName, phone, avatarUrl)
 * Automatically invalidates profile + auth user cache on success
 */
export function useUpdateProfile(options?: UseUpdateProfileOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: (dto: UpdateProfileDto) => updateProfileApi(dto),
    onSuccess: (data) => {
      // Update profile cache with returned data
      queryClient.setQueryData(settingsKeys.profile(), data);
      // Also invalidate auth user since name/avatar may have changed
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
