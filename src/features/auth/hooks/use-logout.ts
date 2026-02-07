'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logoutApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { getErrorMessage } from '@/lib/api-error';
import type { MessageResponse } from '../types';

interface UseLogoutOptions {
  onSuccess?: (data: MessageResponse) => void;
  onError?: (error: string) => void;
  redirectTo?: string;
}

/**
 * Hook for user logout
 */
export function useLogout(options?: UseLogoutOptions) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const { onSuccess, onError, redirectTo = '/login' } = options || {};

  const mutation = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: (data) => {
      // Clear auth state
      clearAuth();

      // Clear all cached queries
      queryClient.clear();

      // Call custom success handler
      onSuccess?.(data);

      // Redirect to login
      router.push(redirectTo);
    },
    onError: (error) => {
      // Even on error, clear local auth state
      clearAuth();
      queryClient.clear();

      const message = getErrorMessage(error);
      onError?.(message);

      // Still redirect to login
      router.push(redirectTo);
    },
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
