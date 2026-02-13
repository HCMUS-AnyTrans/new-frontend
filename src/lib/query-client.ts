'use client';

import { QueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 1 minute
        staleTime: 60 * 1000,
        // Cache data for 5 minutes
        gcTime: 5 * 60 * 1000,
        // Retry failed requests up to 3 times
        retry: (failureCount, error) => {
          // Don't retry on 401, 403, 404 errors
          if (error && typeof error === 'object' && 'status' in error) {
            const status = (error as { status: number }).status;
            if ([401, 403, 404].includes(status)) {
              return false;
            }
          }
          return failureCount < 3;
        },
        // Refetch on window focus (good for auth state)
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect automatically
        refetchOnReconnect: true,
      },
      mutations: {
        // Don't retry mutations by default
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
  }
}

// Auth-related query keys
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

// Dashboard-related query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: (query?: unknown) =>
    [...dashboardKeys.all, 'stats', query] as const,
  jobsChart: (query?: unknown) =>
    [...dashboardKeys.all, 'jobs-chart', query] as const,
  creditsChart: (query?: unknown) =>
    [...dashboardKeys.all, 'credits-chart', query] as const,
  storage: () => [...dashboardKeys.all, 'storage'] as const,
};

// Wallet-related query keys
export const walletKeys = {
  all: ['wallet'] as const,
  balance: () => [...walletKeys.all, 'balance'] as const,
};

// Translation-related query keys
export const translationKeys = {
  all: ['translations'] as const,
  list: (params?: unknown) =>
    [...translationKeys.all, 'list', params] as const,
  detail: (id: string) =>
    [...translationKeys.all, 'detail', id] as const,
};

// Settings-related query keys
export const settingsKeys = {
  all: ['settings'] as const,
  profile: () => [...settingsKeys.all, 'profile'] as const,
  preferences: () => [...settingsKeys.all, 'preferences'] as const,
  identities: () => [...settingsKeys.all, 'identities'] as const,
  sessions: () => [...settingsKeys.all, 'sessions'] as const,
  notificationPreferences: () =>
    [...settingsKeys.all, 'notification-preferences'] as const,
  activity: (params?: unknown) =>
    [...settingsKeys.all, 'activity', params] as const,
};

// Notification-related query keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (params?: unknown) =>
    [...notificationKeys.all, 'list', params] as const,
};

// Billing-related query keys
export const billingKeys = {
  all: ['billing'] as const,
  ledger: (params?: unknown) =>
    [...billingKeys.all, 'ledger', params] as const,
  creditPackages: () =>
    [...billingKeys.all, 'credit-packages'] as const,
  payments: (params?: unknown) =>
    [...billingKeys.all, 'payments', params] as const,
};

// File-related query keys
export const fileKeys = {
  all: ['files'] as const,
  list: (params?: unknown) =>
    [...fileKeys.all, 'list', params] as const,
  storage: () => [...fileKeys.all, 'storage'] as const,
};
