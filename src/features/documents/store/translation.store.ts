import { create } from 'zustand';

export type TranslationSocketConnectionState =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

interface TranslationStore {
  activeJobId: string | null;
  connectionState: TranslationSocketConnectionState;
  setActiveJobId: (id: string | null) => void;
  setConnectionState: (state: TranslationSocketConnectionState) => void;
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
  connectionState: 'idle',
  setActiveJobId: (id) => set({ activeJobId: id }),
  setConnectionState: (connectionState) => set({ connectionState }),
}));

export const getActiveJobId = () => useTranslationStore.getState().activeJobId;

export const setActiveJobId = (id: string | null) =>
  useTranslationStore.getState().setActiveJobId(id);

export const setTranslationConnectionState = (
  state: TranslationSocketConnectionState,
) => useTranslationStore.getState().setConnectionState(state);
