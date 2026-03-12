import { create } from 'zustand';

interface TranslationStore {
  activeJobId: string | null;
  setActiveJobId: (id: string | null) => void;
}

/**
 * Zustand store for tracking the currently active translation job.
 *
 * Kept in memory only (not persisted) since jobs are managed server-side.
 * Used by TranslationSocketProvider to maintain a persistent socket connection
 * across dashboard page navigations.
 */
export const useTranslationStore = create<TranslationStore>()((set) => ({
  activeJobId: null,
  setActiveJobId: (id) => set({ activeJobId: id }),
}));

export const getActiveJobId = () =>
  useTranslationStore.getState().activeJobId;

export const setActiveJobId = (id: string | null) =>
  useTranslationStore.getState().setActiveJobId(id);
