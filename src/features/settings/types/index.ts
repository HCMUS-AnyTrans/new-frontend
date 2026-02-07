// =====================================================================
// SETTINGS TYPES
// =====================================================================

// =============== USER & PROFILE ===============

export interface UserProfile {
  id: string
  email: string
  fullName: string
  phone: string | null
  avatarUrl: string | null
  isOAuthUser: boolean
  emailVerified: boolean
  createdAt: string
  lastLoginAt: string | null
}

export interface UpdateProfileDto {
  fullName?: string
  phone?: string | null
}

// =============== PREFERENCES ===============

export type UILanguage = "vi" | "en" | "ja" | "ko" | "zh"
export type Theme = "light" | "dark" | "system"
export type FileTTL = 7 | 14 | 30 | 60 | 90

export interface UserPreferences {
  uiLanguage: UILanguage
  theme: Theme
  sendResultViaEmail: boolean
  fileTtl: FileTTL
}

export interface UpdatePreferencesDto {
  uiLanguage?: UILanguage
  theme?: Theme
  sendResultViaEmail?: boolean
  fileTtl?: FileTTL
}

// =============== SECURITY ===============

export type AuthProvider = "google" | "facebook" | "github" | "credentials"

export interface AuthIdentity {
  id: string
  provider: AuthProvider
  providerId: string
  email: string | null
  linkedAt: string
}

export interface Session {
  id: string
  device: string
  browser: string
  os: string
  ip: string
  location: string | null
  lastActiveAt: string
  createdAt: string
  isCurrent: boolean
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
  read: boolean
  createdAt: string
  link?: string
}

export interface NotificationPreference {
  type: NotificationType
  label: string
  description: string
  emailEnabled: boolean
  pushEnabled: boolean
}

// =============== BILLING & WALLET ===============

export interface Wallet {
  id: string
  balance: number
  autoRechargeEnabled: boolean
  autoRechargeThreshold: number | null
  autoRechargePackageId: string | null
}

export type LedgerType = "credit" | "debit" | "refund" | "bonus"

export interface WalletLedger {
  id: string
  type: LedgerType
  amount: number
  balanceAfter: number
  description: string
  createdAt: string
  referenceId?: string
}

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded"
export type PaymentMethod = "vnpay" | "momo" | "stripe" | "bank_transfer"

export interface Payment {
  id: string
  amount: number
  credits: number
  status: PaymentStatus
  method: PaymentMethod
  createdAt: string
  completedAt: string | null
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  price: number
  currency: string
  discount: number | null
  isBestValue: boolean
  isPopular: boolean
}

// =============== FILES ===============

export type FileStatus = "active" | "expired" | "deleted"
export type FileType = "pdf" | "docx" | "pptx" | "txt" | "srt"

export interface UserFile {
  id: string
  name: string
  size: number
  type: FileType
  status: FileStatus
  createdAt: string
  expiresAt: string
  translatedUrl?: string
  originalUrl?: string
}

export interface StorageUsage {
  used: number
  total: number
  fileCount: number
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
  userAgent: string
  device: string
  browser: string
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
