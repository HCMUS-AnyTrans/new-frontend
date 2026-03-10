'use client';

import { useState, useCallback, useRef } from 'react';
import {
  requestDocUploadUrl,
  uploadFileToPresignedUrl,
  confirmFileUpload,
  createTranslationJob,
  estimateTranslationCredits,
} from '../api/documents.api';
import type {
  TranslationFlowStatus,
  CreateTranslationJobDto,
  TranslationConfig,
  CreditEstimateResponse,
} from '../types';
import { LANGUAGE_CODE_TO_API_NAME } from '../types';
import { extractErrorMessage } from './utils';

interface UploadAndTranslateState {
  flowStatus: TranslationFlowStatus;
  uploadProgress: number;
  fileId: string | null;
  estimate: CreditEstimateResponse | null;
  jobId: string | null;
  error: string | null;
}

interface UseUploadAndTranslateReturn extends UploadAndTranslateState {
  startUpload: (file: File) => Promise<string | null>;
  startTranslation: (
    config: TranslationConfig,
    glossaryTerms?: Array<{ srcTerm: string; tgtTerm: string }>,
  ) => Promise<void>;
  reset: () => void;
}

const initialState: UploadAndTranslateState = {
  flowStatus: 'idle',
  uploadProgress: 0,
  fileId: null,
  estimate: null,
  jobId: null,
  error: null,
};

const ESTIMATE_POLL_INTERVAL = 5000;
const ESTIMATE_MAX_ATTEMPTS = 20;

async function pollEstimateCredits(
  fileId: string,
  abortRef: React.RefObject<boolean>,
): Promise<CreditEstimateResponse> {
  for (let attempt = 0; attempt < ESTIMATE_MAX_ATTEMPTS; attempt++) {
    if (abortRef.current) {
      throw new Error('Aborted');
    }

    try {
      return await estimateTranslationCredits({
        job_type: 'doc-trans',
        file_id: fileId,
      });
    } catch {
      if (attempt < ESTIMATE_MAX_ATTEMPTS - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, ESTIMATE_POLL_INTERVAL),
        );
      }
    }
  }

  throw new Error(
    'Document analysis timed out. Please try again or upload a different file.',
  );
}

function buildJobDto(
  fileId: string,
  config: TranslationConfig,
  glossaryTerms: Array<{ srcTerm: string; tgtTerm: string }> = [],
): CreateTranslationJobDto {
  const dto: CreateTranslationJobDto = {
    file_id: fileId,
    src_lang: LANGUAGE_CODE_TO_API_NAME[config.srcLang],
    tgt_lang: LANGUAGE_CODE_TO_API_NAME[config.tgtLang],
    doc_tone: config.tone || undefined,
    doc_domain:
      config.domain === 'auto' ? undefined : config.domain || undefined,
  };

  const mergedTerms = new Map<string, { src: string; tgt: string }>();

  glossaryTerms.forEach((term) => {
    const src = term.srcTerm.trim();
    const tgt = term.tgtTerm.trim();
    if (!src || !tgt) return;
    mergedTerms.set(src.toLowerCase(), { src, tgt });
  });

  config.manualTerms.forEach((term) => {
    const src = term.src.trim();
    const tgt = term.tgt.trim();
    if (!src || !tgt) return;
    mergedTerms.set(src.toLowerCase(), { src, tgt });
  });

  if (mergedTerms.size > 0) {
    dto.user_glossary = Array.from(mergedTerms.values()).map((term) => ({
      src_lang: term.src.trim(),
      tgt_lang: term.tgt.trim(),
    }));
  }

  return dto;
}

export function useUploadAndTranslate(): UseUploadAndTranslateReturn {
  const [state, setState] = useState<UploadAndTranslateState>(initialState);
  const abortRef = useRef(false);

  const reset = useCallback(() => {
    abortRef.current = true;
    setState(initialState);
  }, []);

  const startUpload = useCallback(async (file: File) => {
    abortRef.current = false;

    let uploadFileId: string | null = null;

    try {
      setState((prev) => ({
        ...prev,
        flowStatus: 'uploading',
        uploadProgress: 0,
        fileId: null,
        estimate: null,
        jobId: null,
        error: null,
      }));

      const uploadResponse = await requestDocUploadUrl({
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        file_type: 'doc',
      });

      uploadFileId = uploadResponse.file_id;

      if (abortRef.current) return null;

      await uploadFileToPresignedUrl(
        uploadResponse.upload_url,
        file,
        (percent) => {
          if (!abortRef.current) {
            setState((prev) => ({ ...prev, uploadProgress: percent }));
          }
        },
      );

      if (abortRef.current) return null;

      setState((prev) => ({ ...prev, flowStatus: 'confirming' }));

      await confirmFileUpload(uploadResponse.file_id, {
        status: 'uploaded',
      });

      if (abortRef.current) return null;

      setState((prev) => ({
        ...prev,
        flowStatus: 'analyzing',
        uploadProgress: 100,
        fileId: uploadResponse.file_id,
      }));

      const estimateResult = await pollEstimateCredits(
        uploadResponse.file_id,
        abortRef,
      );

      if (abortRef.current) return null;

      setState((prev) => ({
        ...prev,
        flowStatus: 'idle',
        estimate: estimateResult,
        error: null,
      }));

      return uploadResponse.file_id;
    } catch (err: unknown) {
      if (abortRef.current) return null;

      if (uploadFileId) {
        try {
          await confirmFileUpload(uploadFileId, { status: 'failed' });
        } catch {
          // Ignore cleanup failure and preserve the original upload error.
        }
      }

      const errorMessage = extractErrorMessage(err);

      setState((prev) => ({
        ...prev,
        flowStatus: 'failed',
        uploadProgress: 0,
        fileId: null,
        estimate: null,
        error: errorMessage,
      }));

      throw err;
    }
  }, []);

  const startTranslation = useCallback(
    async (
      config: TranslationConfig,
      glossaryTerms: Array<{ srcTerm: string; tgtTerm: string }> = [],
    ) => {
      abortRef.current = false;

      if (!state.fileId) {
        const errorMessage =
          'Please upload a document before starting translation';
        setState((prev) => ({
          ...prev,
          flowStatus: 'failed',
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      try {
        setState((prev) => ({ ...prev, flowStatus: 'creating' }));

        const jobDto = buildJobDto(state.fileId, config, glossaryTerms);
        const idempotencyKey = `doc-${state.fileId}-${Date.now()}`;
        const jobResponse = await createTranslationJob(jobDto, idempotencyKey);

        if (abortRef.current) return;

        setState((prev) => ({
          ...prev,
          flowStatus: 'translating',
          jobId: jobResponse.job_id,
          error: null,
        }));
      } catch (err: unknown) {
        if (abortRef.current) return;

        const errorMessage = extractErrorMessage(err);

        setState((prev) => ({
          ...prev,
          flowStatus: 'failed',
          error: errorMessage,
        }));
      }
    },
    [state.fileId],
  );

  return {
    ...state,
    startUpload,
    startTranslation,
    reset,
  };
}
