'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { translationKeys } from '@/lib/query-client';
import {
  requestDocUploadUrl,
  uploadFileToPresignedUrl,
  confirmFileUpload,
  createTranslationJob,
  getTranslationJob,
  getFileDownloadUrl,
} from '../api/documents.api';
import type {
  TranslationFlowStatus,
  TranslationJobResponse,
  CreateTranslationJobDto,
  TranslationConfig,
  LanguageCode,
} from '../types';
import { LANGUAGE_CODE_TO_API_NAME } from '../types';

// ============================================================================
// useUploadAndTranslate — orchestrates upload → confirm → create job
// ============================================================================

interface UploadAndTranslateState {
  /** Current step in the multi-step flow */
  flowStatus: TranslationFlowStatus;
  /** Upload progress percentage (0-100) during the "uploading" phase */
  uploadProgress: number;
  /** The job ID returned after creating the translation job */
  jobId: string | null;
  /** Error message if any step fails */
  error: string | null;
}

interface UseUploadAndTranslateReturn extends UploadAndTranslateState {
  /**
   * Start the full flow: request presigned URL → upload file → confirm → create job.
   * Called when user clicks "Start Translation" in Step 2.
   */
  startTranslation: (file: File, config: TranslationConfig) => Promise<void>;
  /** Reset the flow state back to idle */
  reset: () => void;
}

const initialState: UploadAndTranslateState = {
  flowStatus: 'idle',
  uploadProgress: 0,
  jobId: null,
  error: null,
};

/**
 * Build the CreateTranslationJobDto from frontend config + fileId.
 * Maps language codes to full names, filters empty manual terms.
 */
function buildJobDto(
  fileId: string,
  config: TranslationConfig
): CreateTranslationJobDto {
  const dto: CreateTranslationJobDto = {
    file_id: fileId,
    src_lang:
      config.srcLang === 'auto'
        ? 'auto'
        : LANGUAGE_CODE_TO_API_NAME[config.srcLang as Exclude<LanguageCode, 'auto'>],
    tgt_lang:
      LANGUAGE_CODE_TO_API_NAME[config.tgtLang as Exclude<LanguageCode, 'auto'>],
    doc_tone: config.tone || undefined,
    doc_domain: config.domain || undefined,
  };

  // Filter out empty manual terms and map to backend format
  const validTerms = config.manualTerms.filter(
    (t) => t.src.trim() !== '' && t.tgt.trim() !== ''
  );
  if (validTerms.length > 0) {
    dto.user_glossary = validTerms.map((t) => ({
      src_lang: t.src.trim(),
      tgt_lang: t.tgt.trim(),
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

  const startTranslation = useCallback(
    async (file: File, config: TranslationConfig) => {
      abortRef.current = false;

      try {
        // Step 1: Request presigned upload URL
        setState({
          flowStatus: 'uploading',
          uploadProgress: 0,
          jobId: null,
          error: null,
        });

        const uploadResponse = await requestDocUploadUrl({
          file_name: file.name,
          mime_type: file.type,
          file_size: file.size,
          file_type: 'doc',
        });

        if (abortRef.current) return;

        // Step 2: Upload file to presigned URL
        await uploadFileToPresignedUrl(
          uploadResponse.upload_url,
          file,
          (percent) => {
            if (!abortRef.current) {
              setState((prev) => ({ ...prev, uploadProgress: percent }));
            }
          }
        );

        if (abortRef.current) return;

        // Step 3: Confirm upload
        setState((prev) => ({ ...prev, flowStatus: 'confirming' }));

        await confirmFileUpload(uploadResponse.file_id, {
          status: 'uploaded',
        });

        if (abortRef.current) return;

        // Step 4: Create translation job
        setState((prev) => ({ ...prev, flowStatus: 'creating' }));

        const jobDto = buildJobDto(uploadResponse.file_id, config);
        const idempotencyKey = `doc-${uploadResponse.file_id}-${Date.now()}`;
        const jobResponse = await createTranslationJob(jobDto, idempotencyKey);

        if (abortRef.current) return;

        // Step 5: Job created — transition to "translating" (polling handled by useTranslationJob)
        setState({
          flowStatus: 'translating',
          uploadProgress: 100,
          jobId: jobResponse.job_id,
          error: null,
        });
      } catch (err: unknown) {
        if (abortRef.current) return;

        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : 'An unexpected error occurred';

        setState((prev) => ({
          ...prev,
          flowStatus: 'failed',
          error: errorMessage,
        }));
      }
    },
    []
  );

  return {
    ...state,
    startTranslation,
    reset,
  };
}

// ============================================================================
// useTranslationJob — polls job status until terminal state
// ============================================================================

interface UseTranslationJobOptions {
  /** Poll interval in milliseconds. Default: 3000 (3s) */
  pollInterval?: number;
  /** Whether polling is enabled. Set to false to pause. */
  enabled?: boolean;
}

export function useTranslationJob(
  jobId: string | null,
  options: UseTranslationJobOptions = {}
) {
  const { pollInterval = 3000, enabled = true } = options;

  const query = useQuery<TranslationJobResponse>({
    queryKey: translationKeys.detail(jobId ?? ''),
    queryFn: () => getTranslationJob(jobId!),
    enabled: enabled && jobId !== null,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling when job reaches terminal state
      if (data?.status === 'succeeded' || data?.status === 'failed') {
        return false;
      }
      return pollInterval;
    },
    // Don't use stale cache for job status — always want fresh data
    staleTime: 0,
  });

  return query;
}

// ============================================================================
// useDownloadFile — fetches presigned download URL and triggers browser download
// ============================================================================

interface UseDownloadFileReturn {
  download: (fileId: string, fileName?: string) => Promise<void>;
  isDownloading: boolean;
  error: string | null;
}

export function useDownloadFile(): UseDownloadFileReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const download = useCallback(
    async (fileId: string, fileName?: string) => {
      setIsDownloading(true);
      setError(null);

      try {
        const { download_url } = await getFileDownloadUrl(fileId);

        // Trigger browser download via invisible anchor
        const a = document.createElement('a');
        a.href = download_url;
        a.download = fileName || '';
        // For cross-origin presigned URLs, we need target=_blank
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err: unknown) {
        if (!mountedRef.current) return;
        const errorMessage =
          err && typeof err === 'object' && 'message' in err
            ? (err as { message: string }).message
            : 'Download failed';
        setError(errorMessage);
      } finally {
        if (mountedRef.current) {
          setIsDownloading(false);
        }
      }
    },
    []
  );

  return { download, isDownloading, error };
}
