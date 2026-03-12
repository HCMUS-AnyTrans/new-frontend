'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { logoutApi } from '../api/auth.api';
import { useAuthStore } from '../store/auth.store';
import { getErrorMessage } from '@/lib/api-error';
import type { MessageResponse } from '../types';

const MARKETING_PATHS = ['/', '/pricing', '/about', '/contact'];

function isMarketingPath(pathname: string) {
  // Strip locale prefix (e.g. /en/pricing -> /pricing)
  const stripped =
    pathname.replace(/^\/[a-z]{2}(\/|$)/, '/').replace(/\/$/, '') || '/';
  return MARKETING_PATHS.some(
    (p) => stripped === p || stripped.startsWith(p + '/'),
  );
}

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
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { clearAuth } = useAuthStore();
  const { onSuccess, onError, redirectTo = '/' } = options || {};

  const handleRedirect = () => {
    if (isMarketingPath(pathname)) {
      router.refresh();
    } else {
      router.push(redirectTo);
    }
  };

  const mutation = useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: (data) => {
      clearAuth();
      queryClient.clear();
      onSuccess?.(data);
      handleRedirect();
    },
    onError: (error) => {
      clearAuth();
      queryClient.clear();
      const message = getErrorMessage(error);
      onError?.(message);
      handleRedirect();
    },
  });

  return {
    logout: mutation.mutate,
    logoutAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
}
