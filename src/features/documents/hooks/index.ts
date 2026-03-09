"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { io, type Socket } from "socket.io-client";
import { translationKeys } from "@/lib/query-client";
import { useAccessToken } from "@/features/auth/store";
import {
  requestDocUploadUrl,
  uploadFileToPresignedUrl,
  confirmFileUpload,
  createTranslationJob,
  getTranslationJob,
  getFileDownloadUrl,
  estimateTranslationCredits,
} from "../api/documents.api";
import type {
  TranslationFlowStatus,
  TranslationJobResponse,
  CreateTranslationJobDto,
  TranslationConfig,
  CreditEstimateResponse,
} from "../types";
import { LANGUAGE_CODE_TO_API_NAME } from "../types";

type SocketConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

interface JobStatusSocketEvent {
  jobId: string;
  status: TranslationJobResponse["status"];
  error?: string;
  resultFileId?: string;
  outputFileName?: string;
  finishedAt?: string;
  job: TranslationJobResponse;
}

interface UseTranslationJobSocketResult {
  connectionState: SocketConnectionState;
  socketError: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ============================================================================
// useUploadAndTranslate — orchestrates upload first, then create job
// ============================================================================

interface UploadAndTranslateState {
  /** Current async state in the document flow */
  flowStatus: TranslationFlowStatus;
  /** Upload progress percentage (0-100) during the upload phase */
  uploadProgress: number;
  /** The uploaded backend file ID returned after confirming upload */
  fileId: string | null;
  /** Credit estimate once the file has been analyzed */
  estimate: CreditEstimateResponse | null;
  /** The job ID returned after creating the translation job */
  jobId: string | null;
  /** Error message if any step fails */
  error: string | null;
}

interface UseUploadAndTranslateReturn extends UploadAndTranslateState {
  /**
   * Start the full upload + analyze flow:
   *   request presigned URL → upload file → confirm → poll estimate credits.
   * Called when user clicks "Continue" in Step 1.
   * Resolves with the file ID once the estimate is ready (or null on abort).
   */
  startUpload: (file: File) => Promise<string | null>;
  /**
   * Create the translation job for an already-uploaded file.
   * Called when user clicks "Start Translation" in Step 2.
   */
  startTranslation: (
    config: TranslationConfig,
    glossaryTerms?: Array<{ srcTerm: string; tgtTerm: string }>,
  ) => Promise<void>;
  /** Reset the flow state back to idle */
  reset: () => void;
}

const initialState: UploadAndTranslateState = {
  flowStatus: "idle",
  uploadProgress: 0,
  fileId: null,
  estimate: null,
  jobId: null,
  error: null,
};

const ESTIMATE_POLL_INTERVAL = 5000;
const ESTIMATE_MAX_ATTEMPTS = 20; // ~2 minutes

/**
 * Poll estimate-credits until the backend has finished parsing the file and
 * can return a valid estimate. Retries on any error (backend returns 400/500
 * while the file is still in "parsing" state) up to MAX_ATTEMPTS.
 */
async function pollEstimateCredits(
  fileId: string,
  abortRef: React.RefObject<boolean>,
): Promise<CreditEstimateResponse> {
  for (let attempt = 0; attempt < ESTIMATE_MAX_ATTEMPTS; attempt++) {
    if (abortRef.current) {
      throw new Error("Aborted");
    }

    try {
      const result = await estimateTranslationCredits({
        job_type: "doc-trans",
        file_id: fileId,
      });
      // Success — backend has parsed metadata and returned a valid estimate
      return result;
    } catch {
      // Backend is not ready yet (file still parsing). Wait and retry.
      if (attempt < ESTIMATE_MAX_ATTEMPTS - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, ESTIMATE_POLL_INTERVAL),
        );
      }
    }
  }

  throw new Error(
    "Document analysis timed out. Please try again or upload a different file.",
  );
}

/**
 * Build the CreateTranslationJobDto from frontend config + fileId.
 * Maps language codes to full names, filters empty manual terms.
 */
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
      config.domain === "auto" ? undefined : config.domain || undefined,
  };

  // Merge selected glossary terms + manual terms and remove duplicate source terms.
  // Manual entries win when the same source appears.
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
    dto.user_glossary = Array.from(mergedTerms.values()).map((t) => ({
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

  const startUpload = useCallback(async (file: File) => {
    abortRef.current = false;

    let uploadFileId: string | null = null;

    try {
      setState((prev) => ({
        ...prev,
        flowStatus: "uploading",
        uploadProgress: 0,
        fileId: null,
        estimate: null,
        jobId: null,
        error: null,
      }));

      // --- Phase 1: request presigned URL ---
      const uploadResponse = await requestDocUploadUrl({
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        file_type: "doc",
      });

      uploadFileId = uploadResponse.file_id;

      if (abortRef.current) return null;

      // --- Phase 2: upload to storage ---
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

      // --- Phase 3: confirm upload ---
      setState((prev) => ({ ...prev, flowStatus: "confirming" }));

      await confirmFileUpload(uploadResponse.file_id, {
        status: "uploaded",
      });

      if (abortRef.current) return null;

      // --- Phase 4: poll estimate credits until backend has parsed metadata ---
      setState((prev) => ({
        ...prev,
        flowStatus: "analyzing",
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
        flowStatus: "idle",
        estimate: estimateResult,
        error: null,
      }));

      return uploadResponse.file_id;
    } catch (err: unknown) {
      if (abortRef.current) return null;

      if (uploadFileId) {
        try {
          await confirmFileUpload(uploadFileId, { status: "failed" });
        } catch {
          // Ignore cleanup failure and preserve the original upload error.
        }
      }

      const errorMessage = extractErrorMessage(err);

      setState((prev) => ({
        ...prev,
        flowStatus: "failed",
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
          "Please upload a document before starting translation";
        setState((prev) => ({
          ...prev,
          flowStatus: "failed",
          error: errorMessage,
        }));
        throw new Error(errorMessage);
      }

      try {
        // Step 1: Create translation job for the uploaded file
        setState((prev) => ({ ...prev, flowStatus: "creating" }));

        const jobDto = buildJobDto(state.fileId, config, glossaryTerms);
        const idempotencyKey = `doc-${state.fileId}-${Date.now()}`;
        const jobResponse = await createTranslationJob(jobDto, idempotencyKey);

        if (abortRef.current) return;

        // Step 2: Job created — transition to "translating" (polling handled by useTranslationJob)
        setState((prev) => ({
          ...prev,
          flowStatus: "translating",
          jobId: jobResponse.job_id,
          error: null,
        }));
      } catch (err: unknown) {
        if (abortRef.current) return;

        const errorMessage = extractErrorMessage(err);

        setState((prev) => ({
          ...prev,
          flowStatus: "failed",
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

// ============================================================================
// useTranslationJob — polls job status until terminal state
// ============================================================================

export function useTranslationJobSocket(
  jobId: string | null,
  options: { enabled?: boolean } = {},
): UseTranslationJobSocketResult {
  const { enabled = true } = options;
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] =
    useState<SocketConnectionState>("idle");
  const [socketError, setSocketError] = useState<string | null>(null);

  // Subscribe reactively so the effect re-runs when the token is refreshed.
  const accessToken = useAccessToken();
  const activeToken = enabled && jobId ? accessToken : null;

  useEffect(() => {
    if (!enabled || !jobId || !activeToken) {
      return;
    }

    const socket: Socket = io(API_BASE_URL, {
      path: "/ws",
      transports: ["websocket"],
      autoConnect: true,
      auth: { token: activeToken },
    });

    const handleConnect = () => {
      setConnectionState("connected");
      setSocketError(null);
      socket.emit("translation:watch", { jobId });
      void queryClient.invalidateQueries({
        queryKey: translationKeys.detail(jobId),
      });
    };

    const handleDisconnect = () => {
      setConnectionState("disconnected");
    };

    const handleConnectError = (error: Error) => {
      setConnectionState("error");
      setSocketError(error.message || "Socket connection failed");
    };

    const handleJobStatus = (event: JobStatusSocketEvent) => {
      if (event.jobId !== jobId) {
        return;
      }
      queryClient.setQueryData(translationKeys.detail(jobId), event.job);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleConnectError);
    socket.on("job:status", handleJobStatus);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
      socket.off("job:status", handleJobStatus);
      socket.disconnect();
    };
  }, [activeToken, enabled, jobId, queryClient]);

  if (!enabled || !jobId) {
    return { connectionState: "idle", socketError: null };
  }

  if (!activeToken) {
    return {
      connectionState: "error",
      socketError: "Missing access token for live translation updates",
    };
  }

  return {
    connectionState:
      connectionState === "idle" ? "connecting" : connectionState,
    socketError,
  };
}

interface UseTranslationJobOptions {
  /** Poll interval in milliseconds. Use false to disable polling. */
  pollInterval?: number | false;
  /** Whether polling is enabled. Set to false to pause. */
  enabled?: boolean;
}

export function useTranslationJob(
  jobId: string | null,
  options: UseTranslationJobOptions = {},
) {
  const { pollInterval = 3000, enabled = true } = options;

  const query = useQuery<TranslationJobResponse>({
    queryKey: translationKeys.detail(jobId ?? ""),
    queryFn: () => getTranslationJob(jobId!),
    enabled: enabled && jobId !== null,
    refetchInterval: (query) => {
      if (pollInterval === false) {
        return false;
      }

      const data = query.state.data;
      // Stop polling when job reaches terminal state
      if (data?.status === "succeeded" || data?.status === "failed") {
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

  const download = useCallback(async (fileId: string, fileName?: string) => {
    setIsDownloading(true);
    setError(null);

    try {
      const { download_url } = await getFileDownloadUrl(fileId);

      // Trigger browser download via invisible anchor
      const a = document.createElement("a");
      a.href = download_url;
      a.download = fileName || "";
      // For cross-origin presigned URLs, we need target=_blank
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: unknown) {
      if (!mountedRef.current) return;
      const errorMessage = extractErrorMessage(err, "Download failed");
      setError(errorMessage);
    } finally {
      if (mountedRef.current) {
        setIsDownloading(false);
      }
    }
  }, []);

  return { download, isDownloading, error };
}

function extractErrorMessage(
  err: unknown,
  fallback = "An unexpected error occurred",
): string {
  if (!err || typeof err !== "object") return fallback;

  if ("message" in err) {
    const message = (err as { message?: string | string[] }).message;
    if (Array.isArray(message)) return message.join(", ");
    if (typeof message === "string" && message.length > 0) return message;
  }

  return fallback;
}
