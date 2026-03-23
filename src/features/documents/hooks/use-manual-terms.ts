'use client';

import { useCallback } from 'react';
import type { TranslationConfig } from '../types';

interface UseManualTermsOptions {
  manualTerms: TranslationConfig['manualTerms'];
  onConfigChange: (updates: Partial<TranslationConfig>) => void;
}

export function useManualTerms({
  manualTerms,
  onConfigChange,
}: UseManualTermsOptions) {
  const addManualTerm = useCallback(() => {
    if (manualTerms.length >= 20) return;

    onConfigChange({
      manualTerms: [
        ...manualTerms,
        { id: `term-${Date.now()}`, src: '', tgt: '' },
      ],
    });
  }, [manualTerms, onConfigChange]);

  const updateManualTerm = useCallback(
    (id: string, field: 'src' | 'tgt', value: string) => {
      onConfigChange({
        manualTerms: manualTerms.map((term) =>
          term.id === id ? { ...term, [field]: value } : term,
        ),
      });
    },
    [manualTerms, onConfigChange],
  );

  const removeManualTerm = useCallback(
    (id: string) => {
      onConfigChange({
        manualTerms: manualTerms.filter((term) => term.id !== id),
      });
    },
    [manualTerms, onConfigChange],
  );

  return {
    addManualTerm,
    updateManualTerm,
    removeManualTerm,
  };
}
