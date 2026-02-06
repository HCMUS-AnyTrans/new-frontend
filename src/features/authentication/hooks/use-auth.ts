'use client';

import { useAuthStore } from '../store/auth.store';
import { useLogin } from './use-login';
import { useLogout } from './use-logout';
import { useRegister } from './use-register';
import { useCurrentUser } from './use-current-user';
import { initiateGoogleAuth } from '../api/auth.api';

/**
 * Main authentication hook that combines all auth functionality
 * Provides a single interface for authentication operations
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    isInitialized,
    accessToken,
  } = useAuthStore();

  const login = useLogin();
  const logout = useLogout();
  const register = useRegister();
  const currentUser = useCurrentUser();

  return {
    // State
    user,
    isAuthenticated,
    isInitialized,
    hasAccessToken: !!accessToken,

    // Login
    login: login.login,
    loginAsync: login.loginAsync,
    isLoggingIn: login.isLoading,
    loginError: login.error,
    resetLoginError: login.reset,

    // Logout
    logout: logout.logout,
    logoutAsync: logout.logoutAsync,
    isLoggingOut: logout.isLoading,

    // Register
    register: register.register,
    registerAsync: register.registerAsync,
    isRegistering: register.isLoading,
    registerError: register.error,
    registerSuccess: register.isSuccess,
    resetRegisterError: register.reset,

    // Current user
    refetchUser: currentUser.refetch,
    isFetchingUser: currentUser.isFetching,

    // Social auth
    loginWithGoogle: initiateGoogleAuth,

    // Loading states
    isLoading: login.isLoading || logout.isLoading || register.isLoading,
  };
}
