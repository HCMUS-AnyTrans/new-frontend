'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  requestGeneralUploadApi,
  uploadFileToPresignedUrl,
  processAvatarApi,
} from '../api/settings.api';
import { settingsKeys, authKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';
import { useAuthStore } from '@/features/auth';
import type { CropData } from '../types';

export interface UploadAvatarPayload {
  file: File;
  cropData: CropData;
}

interface UseUploadAvatarOptions {
  onSuccess?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to handle the full avatar upload + crop flow:
 * 1. Request presigned URL from backend (original file)
 * 2. Upload original file to presigned URL (MinIO/S3)
 * 3. POST /settings/avatar/process with storage_key + crop metadata
 *    → backend crops, resizes to 256×256 WebP, persists avatarUrl in DB
 * 4. Invalidate profile and auth caches
 */
export function useUploadAvatar(options?: UseUploadAvatarOptions) {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: async ({ file, cropData }: UploadAvatarPayload) => {
      // Step 1: Request presigned upload URL for the original file
      const { upload_url, storage_key } = await requestGeneralUploadApi({
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        group: 'avatars',
      });

      // Step 2: Upload original file directly to MinIO/S3
      await uploadFileToPresignedUrl(upload_url, file);

      // Step 3: Ask backend to crop, resize, convert to WebP and save
      const { avatarUrl } = await processAvatarApi({ storage_key, crop: cropData });

      return avatarUrl;
    },
    onSuccess: (avatarUrl) => {
      // Update Zustand store immediately so header avatar re-renders right away
      updateUser({ avatarUrl });
      // Invalidate caches to keep server state in sync
      queryClient.invalidateQueries({ queryKey: settingsKeys.profile() });
      queryClient.invalidateQueries({ queryKey: authKeys.user() });
      onSuccess?.(avatarUrl);
    },
    onError: (error) => {
      const message = getErrorMessage(error);
      onError?.(message);
    },
  });

  return {
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? getErrorMessage(mutation.error) : null,
    reset: mutation.reset,
  };
}
