'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { usePreferences, useUpdatePreferences } from './use-preferences';
import type { Theme } from '../types';

/**
 * Unified theme hook that syncs next-themes (UI) ↔ backend (persistence).
 * - On mount: syncs backend preference → next-themes (one-time)
 * - changeTheme(): applies immediately + persists to backend
 * - toggleTheme(): quick light ↔ dark for header toggle
 */
export function useThemeSync() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { preferences } = usePreferences();
  const { updatePreferences } = useUpdatePreferences();
  const hasSynced = useRef(false);

  // Sync backend → next-themes on first load (once)
  useEffect(() => {
    if (preferences?.theme && !hasSynced.current) {
      hasSynced.current = true;
      if (preferences.theme !== theme) {
        setTheme(preferences.theme);
      }
    }
  }, [preferences?.theme, theme, setTheme]);

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    updatePreferences({ theme: newTheme });
  };

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    changeTheme(next);
  };

  return { theme, resolvedTheme, changeTheme, toggleTheme };
}
