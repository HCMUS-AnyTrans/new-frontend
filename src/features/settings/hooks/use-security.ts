'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getIdentitiesApi,
  unlinkIdentityApi,
  getSessionsApi,
  revokeSessionApi,
  revokeAllSessionsApi,
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
 * Hook to fetch active sessions
 */
export function useSessions() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: settingsKeys.sessions(),
    queryFn: getSessionsApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    sessions: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to revoke a session
 */
export function useRevokeSession() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (sessionId: string) => revokeSessionApi(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() });
    },
  });

  return {
    revokeSession: mutation.mutate,
    isRevoking: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

/**
 * Hook to revoke all other sessions
 */
export function useRevokeAllSessions() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => revokeAllSessionsApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.sessions() });
    },
  });

  return {
    revokeAllSessions: mutation.mutate,
    isRevoking: mutation.isPending,
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
