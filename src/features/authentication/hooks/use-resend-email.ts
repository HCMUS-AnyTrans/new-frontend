'use client';

import { useMutation } from '@tanstack/react-query';
import { resendEmailApi } from '../api/auth.api';
import { getErrorMessage } from '@/lib/api-error';
import type { ResendEmailDto, MessageResponse } from '../types';

interface UseResendEmailOptions {
  onSuccess?: (data: MessageResponse) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for resending verification or password reset email
 */
export function useResendEmail(options?: UseResendEmailOptions) {
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: (data: ResendEmailDto) => resendEmailApi(data),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    resendEmail: mutation.mutate,
    resendEmailAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
