'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { loginApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { getErrorMessage } from '@/lib/api-error';
import { authKeys } from '@/lib/query-client';
import type { LoginDto, AuthResponse } from '../types';

interface UseLoginOptions {
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: string) => void;
}

/**
 * Hook for user login
 * After successful login, always redirects to /dashboard
 */
export function useLogin(options?: UseLoginOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAuth } = useAuthStore();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: (credentials: LoginDto) => loginApi(credentials),
    onSuccess: (data) => {
      // Update auth store with user and token
      setAuth(data.user, data.accessToken);

      // Invalidate any cached user queries
      queryClient.invalidateQueries({ queryKey: authKeys.user() });

      // Call custom success handler
      onSuccess?.(data);

      // Always redirect to dashboard after login
      router.push('/dashboard');
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
