'use client';

import { useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '@/lib/query-client';
import { AuthProvider } from '@/features/authentication';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * App Providers component
 * 
 * Wraps the app with necessary providers:
 * - React Query for data fetching
 * - Auth Provider for session management
 */
export function Providers({ children }: ProvidersProps) {
  // Create query client once per component lifetime
  const [queryClient] = useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
      {/* React Query DevTools - only in development */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
