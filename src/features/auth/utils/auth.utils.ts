import { getAuthState } from '../store/auth.store';

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  const state = getAuthState();
  return state.isAuthenticated && !!state.accessToken;
}

/**
 * Get the current user
 */
export function getCurrentUser() {
  return getAuthState().user;
}

/**
 * Check if user has a specific role
 */
export function hasRole(role: string): boolean {
  const user = getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(roles: string[]): boolean {
  const user = getCurrentUser();
  return user ? roles.includes(user.role) : false;
}

/**
 * Build login URL with redirect parameter
 */
export function buildLoginUrl(redirectTo?: string): string {
  const loginPath = '/login';
  if (!redirectTo || redirectTo === loginPath) {
    return loginPath;
  }
  return `${loginPath}?redirect=${encodeURIComponent(redirectTo)}`;
}

/**
 * Get redirect URL from query parameters
 */
export function getRedirectUrl(searchParams: URLSearchParams): string {
  return searchParams.get('redirect') || '/';
}
