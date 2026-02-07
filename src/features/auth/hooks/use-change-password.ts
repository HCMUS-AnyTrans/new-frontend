'use client';

import { useMutation } from '@tanstack/react-query';
import { changePasswordApi } from '../api/auth.api';
import { getErrorMessage } from '@/lib/api-error';
import type { ChangePasswordDto, MessageResponse } from '../types';

interface UseChangePasswordOptions {
  onSuccess?: (data: MessageResponse) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for changing password (authenticated users)
 */
export function useChangePassword(options?: UseChangePasswordOptions) {
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordDto) => changePasswordApi(data),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    changePassword: mutation.mutate,
    changePasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
