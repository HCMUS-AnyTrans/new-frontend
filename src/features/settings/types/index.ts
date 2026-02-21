// =====================================================================
// SETTINGS TYPES — aligned with backend API
// =====================================================================

// =============== COMMON / PAGINATION ===============

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

// =============== USER & PROFILE ===============

/**
 * Matches backend ProfileResponseDto
 * GET /settings/profile
 */
export interface UserProfile {
  id: string
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  emailVerified: boolean
  isOAuthUser: boolean
  createdAt: string
  lastLoginAt: string | null
}

/**
 * Matches backend UpdateProfileDto
 * PATCH /settings/profile
 */
export interface UpdateProfileDto {
  fullName?: string
  phone?: string | null
  avatarUrl?: string
}

// =============== FILE UPLOAD (for avatars) ===============

/**
 * Request body for POST /files/upload/general
 */
export interface GeneralUploadRequest {
  file_name: string
  file_size: number
  mime_type: string
  group?: string
}

/**
 * Response from POST /files/upload/general
 */
export interface GeneralUploadResponse {
  upload_url: string
  storage_key: string
  expires_in: number
}

// =============== PREFERENCES ===============

export type UILanguage = "vi" | "en" | "ja" | "ko" | "zh"
export type Theme = "light" | "dark" | "system"
// fileTtl is stored in minutes: 10080=7d, 20160=14d, 43200=30d, 86400=60d, 129600=90d
export type FileTTL = 10080 | 20160 | 43200 | 86400 | 129600

export interface UserPreferences {
  uiLanguage: UILanguage
  theme: Theme
  fileTtl: FileTTL
}

export interface UpdatePreferencesDto {
  uiLanguage?: UILanguage
  theme?: Theme
  fileTtl?: FileTTL
}

// =============== SECURITY ===============

export type AuthProvider = "google" | "credentials"

export interface AuthIdentity {
  id: string
  provider: AuthProvider
  email: string | null
  linkedAt: string
  canUnlink: boolean
}

export interface ChangePasswordDto {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// =============== NOTIFICATIONS ===============

export type NotificationType =
  | "translation_complete"
  | "credit_purchase"
  | "file_expiring"
  | "security_alert"
  | "promotion"
  | "system"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  data?: Record<string, unknown>
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export interface NotificationPreference {
  type: NotificationType
  label: string
  description: string
  emailEnabled: boolean
  pushEnabled: boolean
}

export interface UpdateNotificationPreferencesDto {
  preferences: Array<{
    type: NotificationType
    emailEnabled: boolean
    pushEnabled: boolean
  }>
}

// =============== BILLING & WALLET ===============

export interface Wallet {
  id: string
  balance: number
  updatedAt: string
}

export type LedgerType = "topup" | "spend" | "refund"

export interface WalletLedger {
  id: string
  ledgerType: LedgerType
  delta: number
  refTable: string
  refId: string
  note: string
  createdAt: string
}

export interface LedgerSummary {
  totalTopup: number
  totalSpend: number
  totalRefund: number
  netChange: number
}

export interface WalletLedgerResponse extends PaginatedResponse<WalletLedger> {
  summary: LedgerSummary
}

export type PaymentStatus = "pending" | "succeeded" | "failed" | "cancelled"

export interface PaymentPackage {
  id: string
  name: string
  credits: number
}

export interface Payment {
  id: string
  provider: string
  providerPaymentId: string
  amount: number
  currency: string
  status: PaymentStatus
  createdAt: string
  paidAt: string | null
  package: PaymentPackage
}

export type CreditPackageType = "personal" | "business"

export interface CreditPackage {
  id: string
  name: string
  description: string[]
  credits: number
  price: number
  currency: string
  type: CreditPackageType
  active: boolean
  bonus: number | null
  discount: number | null
  tags: string[]
}

export interface CreateVnpayPaymentDto {
  packageId: string
  returnUrl: string
}

export interface CreateVnpayPaymentResponse {
  paymentId: string
  paymentUrl: string
  expiresAt: string
}

// =============== FILES ===============

export type FileStatus = "pending" | "uploaded" | "parsed" | "failed"
export type FileType = "doc" | "sub" | "doc-result" | "sub-result"

export interface UserFile {
  id: string
  name: string
  mime: string
  sizeBytes: number
  status: FileStatus
  type: FileType
  createdAt: string
  storeUntil: string
}

export interface FileDetail extends UserFile {
  sha256: string
  metadata?: {
    pageCount?: number
    wordCount?: number
    detectedLanguage?: string
  }
}

export interface FileDownloadResponse {
  downloadUrl: string
  expiresAt: string
  fileName: string
}

export interface StorageUsage {
  used: number
  total: number
  unit: string
  percentage: number
  fileCount: number
  breakdown: {
    documents: { count: number; size: number }
    subtitles: { count: number; size: number }
  }
}

// =============== ACTIVITY & AUDIT ===============

export type AuditAction =
  | "login"
  | "logout"
  | "password_change"
  | "profile_update"
  | "provider_link"
  | "provider_unlink"
  | "session_revoke"
  | "file_upload"
  | "file_delete"
  | "translation_start"
  | "translation_complete"
  | "credit_purchase"
  | "settings_change"

export interface AuditLog {
  id: string
  action: AuditAction
  description: string
  ip: string
  userAgent?: string
  device?: string
  browser?: string
  location: string | null
  createdAt: string
  metadata?: Record<string, unknown>
}

// =============== SETTINGS TAB ===============

export type SettingsTab =
  | "profile"
  | "preferences"
  | "security"
  | "notifications"
  | "billing"
  | "files"
  | "activity"

export interface SettingsTabConfig {
  id: SettingsTab
  label: string
  icon: string
  description: string
}

// =============== QUERY PARAMS ===============

export interface NotificationsQuery {
  page?: number
  limit?: number
  isRead?: boolean
  type?: NotificationType
}

export interface LedgerQuery {
  page?: number
  limit?: number
  type?: LedgerType
  from?: string
  to?: string
}

export interface PaymentsQuery {
  page?: number
  limit?: number
  status?: PaymentStatus
}

export interface FilesQuery {
  page?: number
  limit?: number
  type?: FileType
  status?: FileStatus
  search?: string
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export interface ActivityQuery {
  page?: number
  limit?: number
  action?: AuditAction
  from?: string
  to?: string
}
