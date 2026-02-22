'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getIdentitiesApi,
  unlinkIdentityApi,
  linkIdentityApi,
  changePasswordApi,
} from '../api/settings.api';
import { settingsKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { ChangePasswordDto } from '../types';

/**
 * Hook to fetch linked auth identities
 */
export function useIdentities() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: settingsKeys.identities(),
    queryFn: getIdentitiesApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    identities: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to unlink an auth provider
 */
export function useUnlinkIdentity() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (identityId: string) => unlinkIdentityApi(identityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.identities() });
    },
  });

  return {
    unlinkIdentity: mutation.mutate,
    isUnlinking: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

/**
 * Hook to link an OAuth provider.
 * Calls the backend to get a redirect URL, then navigates to it.
 * The backend returns JSON { redirectUrl } which points to /auth/google?state=<token>.
 * The frontend must build the full URL using the API base URL and navigate via window.location.href.
 */
export function useLinkIdentity() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  const mutation = useMutation({
    mutationFn: (provider: string) =>
      linkIdentityApi(provider, '/settings?tab=security'),
    onSuccess: (data) => {
      // Navigate to the OAuth provider - this is a full page redirect
      // The redirectUrl is relative (e.g. /auth/google?state=abc), so prepend API base
      window.location.href = `${API_BASE_URL}${data.redirectUrl}`;
    },
  });

  return {
    linkIdentity: mutation.mutate,
    isLinking: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  const mutation = useMutation({
    mutationFn: (dto: ChangePasswordDto) => changePasswordApi(dto),
  });

  return {
    changePassword: mutation.mutate,
    changePasswordAsync: mutation.mutateAsync,
    isChanging: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}
