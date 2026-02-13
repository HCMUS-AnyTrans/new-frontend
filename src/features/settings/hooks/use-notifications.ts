'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  deleteNotificationApi,
  getNotificationPreferencesApi,
  updateNotificationPreferencesApi,
} from '../api/settings.api';
import { settingsKeys, notificationKeys } from '@/lib/query-client';
import { useAuthStore } from '@/features/auth';
import type {
  NotificationsQuery,
  UpdateNotificationPreferencesDto,
} from '../types';

/**
 * Hook to fetch notifications
 */
export function useNotifications(query?: NotificationsQuery) {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: () => getNotificationsApi(query),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    notifications: result.data?.items,
    pagination: result.data?.pagination,
    unreadCount: result.data?.unreadCount ?? 0,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => markNotificationReadApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  return {
    markRead: mutation.mutate,
    isMarking: mutation.isPending,
  };
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => markAllNotificationsReadApi(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  return {
    markAllRead: mutation.mutate,
    isMarking: mutation.isPending,
  };
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNotificationApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });

  return {
    deleteNotification: mutation.mutate,
    isDeleting: mutation.isPending,
  };
}

/**
 * Hook to fetch notification preferences
 */
export function useNotificationPreferences() {
  const { isAuthenticated, accessToken } = useAuthStore();

  const result = useQuery({
    queryKey: settingsKeys.notificationPreferences(),
    queryFn: getNotificationPreferencesApi,
    enabled: isAuthenticated && !!accessToken,
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    preferences: result.data,
    isLoading: result.isLoading,
    isFetching: result.isFetching,
    isError: result.isError,
    error: result.error,
    refetch: result.refetch,
  };
}

/**
 * Hook to update notification preferences
 */
export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (dto: UpdateNotificationPreferencesDto) =>
      updateNotificationPreferencesApi(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: settingsKeys.notificationPreferences(),
      });
    },
  });

  return {
    updatePreferences: mutation.mutate,
    isUpdating: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
