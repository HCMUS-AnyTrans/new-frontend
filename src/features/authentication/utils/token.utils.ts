import { getAccessToken, setAccessToken, clearAuthState } from '../store/auth.store';

/**
 * Token utility functions for use outside React components
 */

/**
 * Get the current access token
 */
export function getToken(): string | null {
  return getAccessToken();
}

/**
 * Set a new access token
 */
export function setToken(token: string): void {
  setAccessToken(token);
}

/**
 * Clear all authentication data
 */
export function clearTokens(): void {
  clearAuthState();
}

/**
 * Check if a JWT token is expired
 * Note: This is a basic check - the server is the source of truth
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp;
    if (!exp) return true;
    
    // Check if token expires in the next 30 seconds
    const bufferTime = 30;
    return Date.now() >= (exp - bufferTime) * 1000;
  } catch {
    return true;
  }
}

/**
 * Parse JWT token payload
 */
export function parseToken(token: string): Record<string, unknown> | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
}
