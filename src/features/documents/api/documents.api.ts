import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import type {
  RequestUploadUrlDto,
  UploadUrlResponse,
  UpdateFileStatusDto,
  FileResponse,
  CreateTranslationJobDto,
  TranslationJobResponse,
  FileDownloadUrlResponse,
} from '../types';

// ============================================================================
// File Upload API Functions
// ============================================================================

/**
 * Request a presigned upload URL for a document file.
 * POST /files/upload/request
 */
export async function requestDocUploadUrl(
  dto: RequestUploadUrlDto
): Promise<UploadUrlResponse> {
  const response = await apiClient.post<UploadUrlResponse>(
    '/files/upload/request',
    dto
  );
  return response.data;
}

/**
 * Upload a file directly to the presigned URL (MinIO/S3).
 * This bypasses apiClient since it goes directly to the storage service.
 * Returns upload progress via onProgress callback.
 */
export async function uploadFileToPresignedUrl(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      }
    },
  });
}

/**
 * Confirm file upload status after uploading to presigned URL.
 * PATCH /files/:file_id/status
 */
export async function confirmFileUpload(
  fileId: string,
  dto: UpdateFileStatusDto
): Promise<FileResponse> {
  const response = await apiClient.patch<FileResponse>(
    `/files/${fileId}/status`,
    dto
  );
  return response.data;
}

// ============================================================================
// Translation API Functions
// ============================================================================

/**
 * Create a document translation job (async via RabbitMQ).
 * POST /translations/doc
 * Supports Idempotency-Key header to prevent duplicates.
 */
export async function createTranslationJob(
  dto: CreateTranslationJobDto,
  idempotencyKey?: string
): Promise<TranslationJobResponse> {
  const headers: Record<string, string> = {};
  if (idempotencyKey) {
    headers['Idempotency-Key'] = idempotencyKey;
  }
  const response = await apiClient.post<TranslationJobResponse>(
    '/translations/doc',
    dto,
    { headers }
  );
  return response.data;
}

/**
 * Get a translation job by ID (used for polling status).
 * GET /translations/:job_id
 */
export async function getTranslationJob(
  jobId: string
): Promise<TranslationJobResponse> {
  const response = await apiClient.get<TranslationJobResponse>(
    `/translations/${jobId}`
  );
  return response.data;
}

// ============================================================================
// File Download API Functions
// ============================================================================

/**
 * Get a presigned download URL for a file (24h TTL).
 * GET /files/:file_id/download
 */
export async function getFileDownloadUrl(
  fileId: string
): Promise<FileDownloadUrlResponse> {
  const response = await apiClient.get<FileDownloadUrlResponse>(
    `/files/${fileId}/download`
  );
  return response.data;
}
