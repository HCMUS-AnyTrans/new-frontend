import { apiClient } from '@/lib/api-client';
import type {
  DashboardStats,
  DashboardStatsQuery,
  JobChartDataPoint,
  JobsChartQuery,
  CreditsChartResponse,
  CreditsChartQuery,
  StorageResponse,
  WalletResponse,
} from '../types';

// ============================================================================
// Dashboard API Functions
// ============================================================================

/**
 * Get dashboard statistics overview
 * GET /dashboard/stats
 */
export async function getDashboardStatsApi(
  query?: DashboardStatsQuery
): Promise<DashboardStats> {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats', {
    params: query,
  });
  return response.data;
}

/**
 * Get jobs chart data grouped by day
 * GET /dashboard/charts/jobs
 */
export async function getJobsChartApi(
  query?: JobsChartQuery
): Promise<JobChartDataPoint[]> {
  const response = await apiClient.get<JobChartDataPoint[]>(
    '/dashboard/charts/jobs',
    { params: query }
  );
  return response.data;
}

/**
 * Get credit usage breakdown by category
 * GET /dashboard/charts/credits
 */
export async function getCreditsChartApi(
  query?: CreditsChartQuery
): Promise<CreditsChartResponse> {
  const response = await apiClient.get<CreditsChartResponse>(
    '/dashboard/charts/credits',
    { params: query }
  );
  return response.data;
}

/**
 * Get storage usage information
 * GET /dashboard/storage
 */
export async function getStorageApi(): Promise<StorageResponse> {
  const response = await apiClient.get<StorageResponse>('/dashboard/storage');
  return response.data;
}

/**
 * Get current user wallet balance
 * GET /wallet
 */
export async function getWalletApi(): Promise<WalletResponse> {
  const response = await apiClient.get<WalletResponse>('/wallet');
  return response.data;
}

// ============================================================================
// Translation Job Types (for recent jobs)
// ============================================================================

export interface TranslationJobFile {
  id: string;
  name: string;
  mime: string;
  size_bytes: number;
  sha256: string;
  status: string;
  type: string;
  created_at: string;
  store_until: string;
  is_expired: boolean;
}

export interface TranslationJobResponse {
  job_id: string;
  job_type: string;
  status: string;
  src_lang: string;
  tgt_lang: string;
  input_file?: TranslationJobFile;
  output_file?: TranslationJobFile;
  error?: string;
  created_at: string;
  completed_at?: string;
}

export interface TranslationJobsListResponse {
  data: TranslationJobResponse[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface RecentJobsQuery {
  page?: number;
  limit?: number;
  job_type?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

/**
 * Get translation jobs with pagination
 * GET /translations
 */
export async function getRecentJobsApi(
  params?: RecentJobsQuery
): Promise<TranslationJobsListResponse> {
  const response = await apiClient.get<TranslationJobsListResponse>(
    '/translations',
    { params }
  );
  return response.data;
}
