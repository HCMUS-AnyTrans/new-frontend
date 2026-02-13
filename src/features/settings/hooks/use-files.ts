'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFilesApi,
  getFileDownloadApi,
  deleteFileApi,
  getStorageUsageApi,
} from '../api/settings.api';
import { fileKeys, dashboardKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type { FilesQuery } from '../types';

/**
 * Hook to fetch user files
 */
export function useFiles(query?: FilesQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: fileKeys.list(query),
    queryFn: () => getFilesApi(query),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    files: result.data?.items,
    pagination: result.data?.pagination,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to get a file download URL
 */
export function useFileDownload() {
  const mutation = useMutation({
    mutationFn: (fileId: string) => getFileDownloadApi(fileId),
    onSuccess: (data) => {
      // Open download URL in new tab
      window.open(data.downloadUrl, '_blank');
    },
  });

  return {
    download: mutation.mutate,
    isDownloading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

/**
 * Hook to delete a file
 */
export function useDeleteFile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (fileId: string) => deleteFileApi(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileKeys.all });
      queryClient.invalidateQueries({ queryKey: dashboardKeys.storage() });
    },
  });

  return {
    deleteFile: mutation.mutate,
    isDeleting: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

/**
 * Hook to fetch storage usage
 */
export function useStorageUsage() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: fileKeys.storage(),
    queryFn: getStorageUsageApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    storage: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}
