'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { resetPasswordApi } from '../api/auth.api';
import { getErrorMessage } from '@/lib/api-error';
import type { ResetPasswordDto, MessageResponse } from '../types';

interface UseResetPasswordOptions {
  onSuccess?: (data: MessageResponse) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

/**
 * Hook for resetting password with token
 */
export function useResetPassword(options?: UseResetPasswordOptions) {
  const router = useRouter();
  const { onSuccess, onError, redirectTo = '/login' } = options || {};

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordDto) => resetPasswordApi(data),
    onSuccess: (data) => {
      onSuccess?.(data);
      // Redirect to login after successful password reset
      router.push(redirectTo);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    resetPassword: mutation.mutate,
    resetPasswordAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
