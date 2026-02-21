import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthStore, User } from '../types';

/**
 * Zustand store for authentication state
 * 
 * Security notes:
 * - Access token is stored in memory only (not persisted)
 * - User data is persisted to localStorage for better UX
 * - Refresh token is managed by httpOnly cookie (backend)
 */
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,

      // Actions
      setAuth: (user: User, accessToken: string) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isInitialized: true,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setAccessToken: (token: string) => {
        set({ accessToken: token });
      },

      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      },

      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      setInitialized: (initialized: boolean) => {
        set({ isInitialized: initialized });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not the access token (security)
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // Rehydrate callback — do NOT set isInitialized here.
      // AuthProvider is the sole owner of isInitialized, ensuring
      // the session is verified (via refresh) before rendering gated content.
      onRehydrateStorage: () => () => {
        // no-op: AuthProvider calls setInitialized(true) after refresh attempt
      },
    }
  )
);

/**
 * Selector hooks for better performance
 */
export const useUser = () => useAuthStore((state) => state.user);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsInitialized = () => useAuthStore((state) => state.isInitialized);

/**
 * Non-reactive getters for use outside React components
 * (e.g., in axios interceptors)
 */
export const getAuthState = () => useAuthStore.getState();
export const getAccessToken = () => useAuthStore.getState().accessToken;
export const setAccessToken = (token: string) => useAuthStore.getState().setAccessToken(token);
export const clearAuthState = () => useAuthStore.getState().clearAuth();
