'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  requestGeneralUploadApi,
  uploadFileToPresignedUrl,
  buildStorageUrl,
  updateProfileApi,
} from '../api/settings.api';
import { settingsKeys, authKeys } from '@/lib/query-client';
import { getErrorMessage } from '@/lib/api-error';

interface UseUploadAvatarOptions {
  onSuccess?: (avatarUrl: string) => void;
  onError?: (error: string) => void;
}

/**
 * Hook to handle the full avatar upload flow:
 * 1. Request presigned URL from backend
 * 2. Upload file to presigned URL (MinIO/S3)
 * 3. Update profile with the new avatar URL
 * 4. Invalidate caches
 */
export function useUploadAvatar(options?: UseUploadAvatarOptions) {
  const queryClient = useQueryClient();
  const { onSuccess, onError } = options || {};

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      // Step 1: Request presigned upload URL
      const { upload_url, storage_key } = await requestGeneralUploadApi({
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        group: 'avatars',
      });

      // Step 2: Upload file to presigned URL
      await uploadFileToPresignedUrl(upload_url, file);

      // Step 3: Build public URL and update profile
      const avatarUrl = buildStorageUrl(storage_key);
      await updateProfileApi({ avatarUrl });

      return avatarUrl;
    },
    onSuccess: (avatarUrl) => {
      // Invalidate profile and auth user caches
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
