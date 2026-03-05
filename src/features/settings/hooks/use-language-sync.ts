'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { settingsKeys } from '@/lib/query-client';
import { usePreferences, useUpdatePreferences } from './use-preferences';
import type { UILanguage, UserPreferences } from '../types';

/**
 * Unified language hook that syncs next-intl locale (UI) ↔ backend (persistence).
 * - On mount: syncs backend preference → URL locale (one-time)
 * - changeLanguage(): navigates to new locale + persists to backend
 * - toggleLanguage(): quick vi ↔ en for header toggle
 */
export function useLanguageSync() {
  const locale = useLocale() as UILanguage;
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { preferences } = usePreferences();
  const { updatePreferences } = useUpdatePreferences();
  const hasSynced = useRef(false);

  // Navigate to a new locale (preserves query params like ?tab=preferences)
  const navigateToLocale = useCallback(
    (newLocale: UILanguage) => {
      const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, '');
      const search = typeof window !== 'undefined' ? window.location.search : '';
      const newPath = `/${newLocale}${pathnameWithoutLocale || ''}${search}`;
      router.push(newPath);
    },
    [pathname, router]
  );

  // Sync backend → URL locale on first load (once)
  useEffect(() => {
    if (preferences?.uiLanguage && !hasSynced.current) {
      hasSynced.current = true;
      if (preferences.uiLanguage !== locale) {
        navigateToLocale(preferences.uiLanguage);
      }
    }
  }, [preferences?.uiLanguage, locale, navigateToLocale]);

  const changeLanguage = useCallback(
    (newLanguage: UILanguage) => {
      const previousPreferences = queryClient.getQueryData<UserPreferences>(
        settingsKeys.preferences()
      );

      queryClient.setQueryData<UserPreferences | undefined>(
        settingsKeys.preferences(),
        (current) => {
          if (!current) return current;
          return { ...current, uiLanguage: newLanguage };
        }
      );

      navigateToLocale(newLanguage);

      updatePreferences(
        { uiLanguage: newLanguage },
        {
          onError: () => {
            if (previousPreferences) {
              queryClient.setQueryData(
                settingsKeys.preferences(),
                previousPreferences
              );
            }
          },
        }
      );
    },
    [navigateToLocale, queryClient, updatePreferences]
  );

  const toggleLanguage = useCallback(() => {
    const next: UILanguage = locale === 'vi' ? 'en' : 'vi';
    changeLanguage(next);
  }, [locale, changeLanguage]);

  return { locale, changeLanguage, toggleLanguage };
}
