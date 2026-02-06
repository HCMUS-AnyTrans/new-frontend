'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/auth.store';
import { refreshTokenApi } from '../api/auth.api';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider component
 * 
 * Handles automatic session refresh on app initialization.
 * Attempts to refresh the access token if user appears to be authenticated
 * but doesn't have an access token (e.g., after page refresh).
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, accessToken, setAuth, clearAuth, setInitialized } = useAuthStore();

  const initializeAuth = useCallback(async () => {
    // If we have user data but no access token, try to refresh
    if (isAuthenticated && !accessToken) {
      try {
        const response = await refreshTokenApi();
        setAuth(response.user, response.accessToken);
      } catch {
        // Refresh failed - clear auth state
        clearAuth();
      }
    }
    setInitialized(true);
  }, [isAuthenticated, accessToken, setAuth, clearAuth, setInitialized]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return <>{children}</>;
}
