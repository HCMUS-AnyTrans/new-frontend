'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { verifyEmailApi } from '../api/auth.api';
import { getErrorMessage } from '@/lib/api-error';
import type { VerifyEmailDto, MessageResponse } from '../types';

interface UseVerifyEmailOptions {
  onSuccess?: (data: MessageResponse) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

/**
 * Hook for email verification
 */
export function useVerifyEmail(options?: UseVerifyEmailOptions) {
  const router = useRouter();
  const { onSuccess, onError, redirectTo = '/login' } = options || {};

  const mutation = useMutation({
    mutationFn: (data: VerifyEmailDto) => verifyEmailApi(data),
    onSuccess: (data) => {
      onSuccess?.(data);
      // Redirect to login after successful verification
      router.push(redirectTo);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    verifyEmail: mutation.mutate,
    verifyEmailAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
