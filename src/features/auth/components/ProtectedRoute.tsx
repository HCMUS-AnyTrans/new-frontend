'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/auth.store';
import { buildLoginUrl } from '../utils/auth.utils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Required role(s) to access this route
   */
  allowedRoles?: string[];
  /**
   * Custom fallback component while checking auth
   */
  fallback?: React.ReactNode;
  /**
   * Custom redirect path instead of login
   */
  redirectTo?: string;
}

/**
 * Loading skeleton for protected content
 */
function LoadingSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );
}

/**
 * ProtectedRoute component
 * 
 * Wraps content that requires authentication.
 * Redirects to login page with return URL if not authenticated.
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <DashboardContent />
 * </ProtectedRoute>
 * 
 * // With role restriction
 * <ProtectedRoute allowedRoles={['admin']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 */
export function ProtectedRoute({
  children,
  allowedRoles,
  fallback,
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isInitialized, user } = useAuthStore();

  useEffect(() => {
    // Wait for auth state to be initialized (hydrated from localStorage)
    if (!isInitialized) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      const loginUrl = redirectTo || buildLoginUrl(pathname);
      router.replace(loginUrl);
      return;
    }

    // Check role-based access
    if (allowedRoles && allowedRoles.length > 0 && user) {
      if (!allowedRoles.includes(user.role)) {
        // User doesn't have required role - redirect to home or 403 page
        router.replace('/');
      }
    }
  }, [isAuthenticated, isInitialized, user, allowedRoles, pathname, router, redirectTo]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return <>{fallback || <LoadingSkeleton />}</>;
  }

  // Not authenticated - will redirect, show nothing
  if (!isAuthenticated) {
    return <>{fallback || <LoadingSkeleton />}</>;
  }

  // Check role access
  if (allowedRoles && allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      return <>{fallback || <LoadingSkeleton />}</>;
    }
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
}
