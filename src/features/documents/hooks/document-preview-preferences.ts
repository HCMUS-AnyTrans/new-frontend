'use client';

import { useCallback, useSyncExternalStore } from 'react';

export type DocumentPreviewDisplayMode = 'paged' | 'continuous';
export type PreviewZoomMode = 'fit-page' | 'fit-width' | 'custom';

type PreviewPreferences = {
  displayMode: DocumentPreviewDisplayMode;
  zoomMode: PreviewZoomMode;
  zoomScale: number;
};

const PREVIEW_DISPLAY_MODE_KEY = 'preview-display-mode';
const PREVIEW_ZOOM_MODE_KEY = 'preview-zoom-mode';
const PREVIEW_ZOOM_SCALE_KEY = 'preview-zoom-scale';
const PREVIEW_PREFERENCES_UPDATED_EVENT = 'document-preview-preferences-updated';

const MIN_ZOOM_SCALE = 0.5;
const MAX_ZOOM_SCALE = 2;
const ZOOM_STEP = 0.1;

export const defaultPreviewPreferences: PreviewPreferences = {
  displayMode: 'paged',
  zoomMode: 'fit-page',
  zoomScale: 1,
};

let cachedPreviewPreferences: PreviewPreferences = defaultPreviewPreferences;

function clampZoomScale(scale: number): number {
  return Math.min(Math.max(scale, MIN_ZOOM_SCALE), MAX_ZOOM_SCALE);
}

function roundZoomScale(scale: number): number {
  return Number(scale.toFixed(2));
}

function normalizeZoomScale(scale: number): number {
  return roundZoomScale(clampZoomScale(scale));
}

function isDisplayMode(value: string | null): value is DocumentPreviewDisplayMode {
  return value === 'paged' || value === 'continuous';
}

function isZoomMode(value: string | null): value is PreviewZoomMode {
  return value === 'fit-page' || value === 'fit-width' || value === 'custom';
}

function readStoredDisplayMode(): DocumentPreviewDisplayMode {
  const storedValue = window.localStorage.getItem(PREVIEW_DISPLAY_MODE_KEY);

  return isDisplayMode(storedValue) ? storedValue : defaultPreviewPreferences.displayMode;
}

function readStoredZoomMode(): PreviewZoomMode {
  const storedValue = window.localStorage.getItem(PREVIEW_ZOOM_MODE_KEY);

  return isZoomMode(storedValue) ? storedValue : defaultPreviewPreferences.zoomMode;
}

function readStoredZoomScale(): number {
  const storedValue = window.localStorage.getItem(PREVIEW_ZOOM_SCALE_KEY);
  const parsedValue = storedValue ? Number.parseFloat(storedValue) : Number.NaN;

  if (!Number.isFinite(parsedValue)) {
    return defaultPreviewPreferences.zoomScale;
  }

  return normalizeZoomScale(parsedValue);
}

function readStoredPreviewPreferences(): PreviewPreferences {
  if (typeof window === 'undefined') {
    return defaultPreviewPreferences;
  }

  try {
    const nextPreferences = {
      displayMode: readStoredDisplayMode(),
      zoomMode: readStoredZoomMode(),
      zoomScale: readStoredZoomScale(),
    };

    if (
      cachedPreviewPreferences.displayMode === nextPreferences.displayMode &&
      cachedPreviewPreferences.zoomMode === nextPreferences.zoomMode &&
      cachedPreviewPreferences.zoomScale === nextPreferences.zoomScale
    ) {
      return cachedPreviewPreferences;
    }

    cachedPreviewPreferences = nextPreferences;

    return cachedPreviewPreferences;
  } catch {
    return defaultPreviewPreferences;
  }
}

function notifyPreviewPreferenceSubscribers() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event(PREVIEW_PREFERENCES_UPDATED_EVENT));
}

function persistPreviewPreferences(preferences: PreviewPreferences) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    cachedPreviewPreferences = preferences;
    window.localStorage.setItem(PREVIEW_DISPLAY_MODE_KEY, preferences.displayMode);
    window.localStorage.setItem(PREVIEW_ZOOM_MODE_KEY, preferences.zoomMode);
    window.localStorage.setItem(PREVIEW_ZOOM_SCALE_KEY, String(preferences.zoomScale));
    notifyPreviewPreferenceSubscribers();
  } catch {
    // Ignore storage failures so preview state remains usable.
  }
}

function subscribeToPreviewPreferenceStorage(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === PREVIEW_DISPLAY_MODE_KEY ||
      event.key === PREVIEW_ZOOM_MODE_KEY ||
      event.key === PREVIEW_ZOOM_SCALE_KEY
    ) {
      onStoreChange();
    }
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(PREVIEW_PREFERENCES_UPDATED_EVENT, onStoreChange);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener(PREVIEW_PREFERENCES_UPDATED_EVENT, onStoreChange);
  };
}

function updatePreviewPreferences(
  updater: (currentPreferences: PreviewPreferences) => PreviewPreferences,
) {
  const currentPreferences = readStoredPreviewPreferences();
  const nextPreferences = updater(currentPreferences);

  if (
    nextPreferences.displayMode === currentPreferences.displayMode &&
    nextPreferences.zoomMode === currentPreferences.zoomMode &&
    nextPreferences.zoomScale === currentPreferences.zoomScale
  ) {
    return;
  }

  persistPreviewPreferences(nextPreferences);
}

export function useDocumentPreviewPreferences() {
  const preferences = useSyncExternalStore(
    subscribeToPreviewPreferenceStorage,
    readStoredPreviewPreferences,
    () => defaultPreviewPreferences,
  );

  const setDisplayMode = useCallback((displayMode: DocumentPreviewDisplayMode) => {
    updatePreviewPreferences((currentPreferences) => ({
      ...currentPreferences,
      displayMode,
    }));
  }, []);

  const setZoomMode = useCallback((zoomMode: PreviewZoomMode) => {
    updatePreviewPreferences((currentPreferences) => ({
      ...currentPreferences,
      zoomMode,
    }));
  }, []);

  const setZoomScale = useCallback((zoomScale: number) => {
    const nextZoomScale = normalizeZoomScale(zoomScale);

    updatePreviewPreferences((currentPreferences) => ({
      ...currentPreferences,
      zoomMode: 'custom',
      zoomScale: nextZoomScale,
    }));
  }, []);

  const incrementZoom = useCallback(() => {
    updatePreviewPreferences((currentPreferences) => ({
      ...currentPreferences,
      zoomMode: 'custom',
      zoomScale: normalizeZoomScale(currentPreferences.zoomScale + ZOOM_STEP),
    }));
  }, []);

  const decrementZoom = useCallback(() => {
    updatePreviewPreferences((currentPreferences) => ({
      ...currentPreferences,
      zoomMode: 'custom',
      zoomScale: normalizeZoomScale(currentPreferences.zoomScale - ZOOM_STEP),
    }));
  }, []);

  const resetZoom = useCallback(() => {
    updatePreviewPreferences((currentPreferences) => ({
      ...currentPreferences,
      zoomMode: 'custom',
      zoomScale: 1,
    }));
  }, []);

  return {
    ...preferences,
    setDisplayMode,
    setZoomMode,
    setZoomScale,
    incrementZoom,
    decrementZoom,
    resetZoom,
  };
}
