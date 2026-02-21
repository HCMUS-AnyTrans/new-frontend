import axios from 'axios';
import { apiClient } from '@/lib/api-client';
import type {
  UserProfile,
  UpdateProfileDto,
  GeneralUploadRequest,
  GeneralUploadResponse,
  UserPreferences,
  UpdatePreferencesDto,
  ChangePasswordDto,
  AuthIdentity,
  Notification,
  NotificationsQuery,
  NotificationPreference,
  UpdateNotificationPreferencesDto,
  PaginatedResponse,
  Wallet,
  WalletLedgerResponse,
  LedgerQuery,
  CreditPackage,
  Payment,
  PaymentsQuery,
  CreateVnpayPaymentDto,
  CreateVnpayPaymentResponse,
  UserFile,
  FilesQuery,
  FileDownloadResponse,
  StorageUsage,
  AuditLog,
  ActivityQuery,
} from '../types';

// ============================================================================
// Profile API Functions
// ============================================================================

/**
 * Get current user profile
 * GET /settings/profile
 */
export async function getProfileApi(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>('/settings/profile');
  return response.data;
}

/**
 * Update current user profile
 * PATCH /settings/profile
 */
export async function updateProfileApi(
  dto: UpdateProfileDto
): Promise<UserProfile> {
  const response = await apiClient.patch<UserProfile>(
    '/settings/profile',
    dto
  );
  return response.data;
}

// ============================================================================
// File Upload API Functions (for avatar)
// ============================================================================

/**
 * Request a presigned upload URL for general purpose files (avatars, etc.)
 * POST /files/upload/general
 */
export async function requestGeneralUploadApi(
  dto: GeneralUploadRequest
): Promise<GeneralUploadResponse> {
  const response = await apiClient.post<GeneralUploadResponse>(
    '/files/upload/general',
    dto
  );
  return response.data;
}

/**
 * Upload a file directly to the presigned URL (MinIO/S3)
 * This bypasses apiClient since it goes directly to the storage service
 */
export async function uploadFileToPresignedUrl(
  uploadUrl: string,
  file: File
): Promise<void> {
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });
}

/**
 * Build the public URL for an uploaded file from its storage key
 * Uses NEXT_PUBLIC_STORAGE_URL env var, falls back to API base + /storage/
 */
export function buildStorageUrl(storageKey: string): string {
  const storageBase =
    process.env.NEXT_PUBLIC_STORAGE_URL ||
    `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/storage`;
  return `${storageBase}/${storageKey}`;
}

// ============================================================================
// Preferences API Functions
// ============================================================================

/**
 * Get user preferences
 * GET /settings/preferences
 */
export async function getPreferencesApi(): Promise<UserPreferences> {
  const response = await apiClient.get<UserPreferences>(
    '/settings/preferences'
  );
  return response.data;
}

/**
 * Update user preferences
 * PATCH /settings/preferences
 */
export async function updatePreferencesApi(
  dto: UpdatePreferencesDto
): Promise<UserPreferences> {
  const response = await apiClient.patch<UserPreferences>(
    '/settings/preferences',
    dto
  );
  return response.data;
}

// ============================================================================
// Security API Functions
// ============================================================================

/**
 * Change password
 * POST /auth/change-password
 * Backend only accepts currentPassword + newPassword (no confirmPassword)
 */
export async function changePasswordApi(
  dto: ChangePasswordDto
): Promise<void> {
  await apiClient.post('/auth/change-password', {
    currentPassword: dto.currentPassword,
    newPassword: dto.newPassword,
  });
}

/**
 * Link an OAuth provider to the current account
 * POST /settings/security/identities/:provider/link
 * Returns a redirect URL that the frontend should navigate to via window.location.href
 */
export async function linkIdentityApi(
  provider: string,
  returnUrl?: string
): Promise<{ redirectUrl: string }> {
  const response = await apiClient.post<{ redirectUrl: string }>(
    `/settings/security/identities/${provider}/link`,
    null,
    { params: returnUrl ? { returnUrl } : undefined }
  );
  return response.data;
}

/**
 * Get linked authentication providers
 * GET /settings/security/identities
 */
export async function getIdentitiesApi(): Promise<AuthIdentity[]> {
  const response = await apiClient.get<AuthIdentity[]>(
    '/settings/security/identities'
  );
  return response.data;
}

/**
 * Unlink an authentication provider
 * DELETE /settings/security/identities/:identityId
 */
export async function unlinkIdentityApi(
  identityId: string
): Promise<void> {
  await apiClient.delete(`/settings/security/identities/${identityId}`);
}

// ============================================================================
// Notifications API Functions
// ============================================================================

/**
 * List user notifications
 * GET /notifications
 */
export async function getNotificationsApi(
  query?: NotificationsQuery
): Promise<PaginatedResponse<Notification> & { unreadCount: number }> {
  const response = await apiClient.get<
    PaginatedResponse<Notification> & { unreadCount: number }
  >('/notifications', { params: query });
  return response.data;
}

/**
 * Mark a notification as read
 * PATCH /notifications/:id/read
 */
export async function markNotificationReadApi(
  id: string
): Promise<{ id: string; isRead: boolean; readAt: string }> {
  const response = await apiClient.patch<{
    id: string;
    isRead: boolean;
    readAt: string;
  }>(`/notifications/${id}/read`);
  return response.data;
}

/**
 * Mark all notifications as read
 * PATCH /notifications/read-all
 */
export async function markAllNotificationsReadApi(): Promise<{
  updatedCount: number;
}> {
  const response = await apiClient.patch<{ updatedCount: number }>(
    '/notifications/read-all'
  );
  return response.data;
}

/**
 * Delete a notification
 * DELETE /notifications/:id
 */
export async function deleteNotificationApi(id: string): Promise<void> {
  await apiClient.delete(`/notifications/${id}`);
}

/**
 * Get notification preferences
 * GET /settings/notification-preferences
 */
export async function getNotificationPreferencesApi(): Promise<
  NotificationPreference[]
> {
  const response = await apiClient.get<NotificationPreference[]>(
    '/settings/notification-preferences'
  );
  return response.data;
}

/**
 * Update notification preferences
 * PATCH /settings/notification-preferences
 */
export async function updateNotificationPreferencesApi(
  dto: UpdateNotificationPreferencesDto
): Promise<void> {
  await apiClient.patch('/settings/notification-preferences', dto);
}

// ============================================================================
// Wallet & Billing API Functions
// ============================================================================

/**
 * Get current user wallet balance
 * GET /wallet
 */
export async function getWalletApi(): Promise<Wallet> {
  const response = await apiClient.get<Wallet>('/wallet');
  return response.data;
}

/**
 * Get wallet transaction history
 * GET /wallet/ledger
 */
export async function getWalletLedgerApi(
  query?: LedgerQuery
): Promise<WalletLedgerResponse> {
  const response = await apiClient.get<WalletLedgerResponse>(
    '/wallet/ledger',
    { params: query }
  );
  return response.data;
}

/**
 * List available credit packages
 * GET /credit-packages
 */
export async function getCreditPackagesApi(): Promise<CreditPackage[]> {
  const response = await apiClient.get<CreditPackage[]>('/credit-packages');
  return response.data;
}

/**
 * Create VNPay payment for credit purchase
 * POST /payments/vnpay/create
 */
export async function createVnpayPaymentApi(
  dto: CreateVnpayPaymentDto
): Promise<CreateVnpayPaymentResponse> {
  const response = await apiClient.post<CreateVnpayPaymentResponse>(
    '/payments/vnpay/create',
    dto
  );
  return response.data;
}

/**
 * List payment history
 * GET /payments
 */
export async function getPaymentsApi(
  query?: PaymentsQuery
): Promise<PaginatedResponse<Payment>> {
  const response = await apiClient.get<PaginatedResponse<Payment>>(
    '/payments',
    { params: query }
  );
  return response.data;
}

// ============================================================================
// Files API Functions
// ============================================================================

/**
 * List user files
 * GET /files
 */
export async function getFilesApi(
  query?: FilesQuery
): Promise<PaginatedResponse<UserFile>> {
  const response = await apiClient.get<PaginatedResponse<UserFile>>('/files', {
    params: query,
  });
  return response.data;
}

/**
 * Get file download URL
 * GET /files/:fileId/download
 */
export async function getFileDownloadApi(
  fileId: string
): Promise<FileDownloadResponse> {
  const response = await apiClient.get<FileDownloadResponse>(
    `/files/${fileId}/download`
  );
  return response.data;
}

/**
 * Delete a file
 * DELETE /files/:fileId
 */
export async function deleteFileApi(fileId: string): Promise<void> {
  await apiClient.delete(`/files/${fileId}`);
}

/**
 * Get storage usage
 * GET /dashboard/storage
 */
export async function getStorageUsageApi(): Promise<StorageUsage> {
  const response = await apiClient.get<StorageUsage>('/dashboard/storage');
  return response.data;
}

// ============================================================================
// Activity API Functions
// ============================================================================

/**
 * Get user activity/audit log
 * GET /settings/activity
 */
export async function getActivityApi(
  query?: ActivityQuery
): Promise<PaginatedResponse<AuditLog>> {
  const response = await apiClient.get<PaginatedResponse<AuditLog>>(
    '/settings/activity',
    { params: query }
  );
  return response.data;
}
