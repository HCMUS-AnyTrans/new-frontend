'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signupApi } from '../api/auth.api';
import { getErrorMessage } from '@/lib/api-error';
import type { SignupDto, MessageResponse } from '../types';

interface UseRegisterOptions {
  onSuccess?: (data: MessageResponse) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

/**
 * Hook for user registration
 */
export function useRegister(options?: UseRegisterOptions) {
  const router = useRouter();
  const { onSuccess, onError, redirectTo = '/login' } = options || {};

  const mutation = useMutation({
    mutationFn: (data: SignupDto) => signupApi(data),
    onSuccess: (data) => {
      // Call custom success handler
      onSuccess?.(data);

      // Redirect to login page (user needs to verify email first)
      router.push(redirectTo);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    register: mutation.mutate,
    registerAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
