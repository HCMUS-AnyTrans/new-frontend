'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWalletApi,
  getWalletLedgerApi,
  getCreditPackagesApi,
  getPaymentsApi,
  createVnpayPaymentApi,
} from '../api/settings.api';
import { walletKeys, billingKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type {
  LedgerQuery,
  PaymentsQuery,
  CreateVnpayPaymentDto,
} from '../types';

/**
 * Hook to fetch wallet balance
 */
export function useWallet() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: walletKeys.balance(),
    queryFn: getWalletApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000,
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

/**
 * Hook to fetch wallet ledger (transaction history)
 */
export function useWalletLedger(query?: LedgerQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: billingKeys.ledger(query),
    queryFn: () => getWalletLedgerApi(query),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    ledger: result.data?.items,
    pagination: result.data?.pagination,
    summary: result.data?.summary,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to fetch credit packages
 */
export function useCreditPackages() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: billingKeys.creditPackages(),
    queryFn: getCreditPackagesApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    packages: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to fetch payment history
 */
export function usePayments(query?: PaymentsQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: billingKeys.payments(query),
    queryFn: () => getPaymentsApi(query),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    payments: result.data?.items,
    pagination: result.data?.pagination,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to create a VNPay payment
 */
export function useCreateVnpayPayment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dto: CreateVnpayPaymentDto) => createVnpayPaymentApi(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: billingKeys.payments() });
    },
  });

  return {
    createPayment: mutation.mutate,
    createPaymentAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
}
