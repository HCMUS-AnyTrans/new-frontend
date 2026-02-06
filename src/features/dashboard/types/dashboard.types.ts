// ============================================================================
// Dashboard Types - Matching Backend Prisma Schema
// ============================================================================

/**
 * Job status matching TranslationJob.status in backend
 */
export type JobStatus = "pending" | "processing" | "succeeded" | "failed"

/**
 * Job type matching TranslationJob.jobType in backend
 */
export type JobType = "document" | "subtitle"

/**
 * Supported language codes (ISO 639-1)
 */
export type LanguageCode = "vi" | "en" | "ja" | "ko" | "zh" | "fr" | "de"

/**
 * Activity/notification types
 */
export type ActivityType = "job_complete" | "job_failed" | "payment" | "warning"

/**
 * Trend direction for stats
 */
export type TrendDirection = "up" | "down" | "neutral"

// ============================================================================
// Dashboard Stats
// ============================================================================

export interface DashboardStats {
  totalCredits: number
  creditsChange: string
  creditsTrend: TrendDirection

  totalJobs: number
  documentJobs: number
  subtitleJobs: number
  jobsChange: string
  jobsTrend: TrendDirection

  processingJobs: number
  processingChange: string
  processingTrend: TrendDirection

  completedThisMonth: number
  completedChange: string
  completedTrend: TrendDirection
  successRate: number
}

// ============================================================================
// Recent Job - Matches TranslationJob + File from backend
// ============================================================================

export interface RecentJob {
  id: string
  fileName: string
  jobType: JobType
  srcLang: string
  tgtLang: string
  status: JobStatus
  costCredits: number
  createdAt: string
}

// ============================================================================
// Activity Item - Matches Notification + WalletLedger from backend
// ============================================================================

export interface ActivityItem {
  id: string
  type: ActivityType
  title: string
  description: string
  createdAt: string
}

// ============================================================================
// Chart Data
// ============================================================================

export interface JobsChartDataPoint {
  day: string
  document: number
  subtitle: number
}

export interface CreditUsageDataPoint {
  name: string
  value: number
  fill: string
}

// ============================================================================
// Storage
// ============================================================================

export interface StorageInfo {
  used: number // in GB
  total: number // in GB
}

// ============================================================================
// User Context (for sidebar/header)
// ============================================================================

export interface UserInfo {
  id: string
  fullName: string
  email: string
  avatarUrl: string | null
  initials: string
}

export interface WalletInfo {
  balance: number
}
