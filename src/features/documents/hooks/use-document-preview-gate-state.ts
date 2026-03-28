'use client';

import { useMemo } from 'react';
import type { TranslationJobResponse } from '../types';
import { canPreviewTranslationJob } from '../utils/preview-capabilities';

interface UseDocumentPreviewGateStateParams {
  jobId: string | null;
  job: TranslationJobResponse | undefined;
  isLoading: boolean;
  isError: boolean;
  t: (key: string) => string;
}

export function useDocumentPreviewGateState({
  jobId,
  job,
  isLoading,
  isError,
  t,
}: UseDocumentPreviewGateStateParams) {
  return useMemo(() => {
    if (!jobId) {
      return {
        title: t('missingJobTitle'),
        description: t('missingJobDescription'),
      };
    }

    if (isLoading) {
      return null;
    }

    if (isError || !job) {
      return {
        title: t('loadErrorTitle'),
        description: t('loadErrorDescription'),
      };
    }

    if (job.status !== 'succeeded' || !job.input_file || !job.output_file) {
      return {
        title: t('notReadyTitle'),
        description: t('notReadyDescription'),
      };
    }

    if (
      !canPreviewTranslationJob({
        inputFile: job.input_file,
        outputFile: job.output_file,
      })
    ) {
      return {
        title: t('unsupportedTitle'),
        description: t('unsupportedDescription'),
      };
    }

    return null;
  }, [isError, isLoading, job, jobId, t]);
}
