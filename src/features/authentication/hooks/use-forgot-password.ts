'use client';

import { useMutation } from '@tanstack/react-query';
import { forgotPasswordApi } from '../api/auth.api';
import { getErrorMessage } from '@/lib/api-error';
import type { ForgotPasswordDto, MessageResponse } from '../types';

interface UseForgotPasswordOptions {
  onSuccess?: (data: MessageResponse) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for password reset request
 */
export function useForgotPassword(options?: UseForgotPasswordOptions) {
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordDto) => forgotPasswordApi(data),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    forgotPassword: mutation.mutate,
    forgotPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
