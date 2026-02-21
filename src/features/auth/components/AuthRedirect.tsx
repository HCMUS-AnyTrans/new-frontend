'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';

interface AuthRedirectProps {
  children: React.ReactNode;
  /** Where to redirect authenticated users (default: /dashboard) */
  redirectTo?: string;
}

/**
 * AuthRedirect component (inverse of ProtectedRoute)
 * 
 * Wraps auth pages (login, register) to redirect already-authenticated
 * users away to the dashboard. Prevents seeing login form while logged in.
 */
export function AuthRedirect({
  children,
  redirectTo = '/dashboard',
}: AuthRedirectProps) {
  const router = useRouter();
  const { isAuthenticated, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isInitialized, router, redirectTo]);

  // Still initializing — show nothing to avoid flash
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Authenticated — will redirect, show nothing
  if (isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated — render the auth page
  return <>{children}</>;
}
