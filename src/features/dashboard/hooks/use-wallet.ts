'use client';

import { useQuery } from '@tanstack/react-query';
import { getWalletApi } from '../api/dashboard.api';
import { walletKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';

/**
 * Hook to fetch current user wallet balance
 */
export function useWallet() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: walletKeys.balance(),
    queryFn: getWalletApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000, // 30 seconds (balance can change frequently)
    gcTime: 5 * 60 * 1000,
  });

  return {
    wallet: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
