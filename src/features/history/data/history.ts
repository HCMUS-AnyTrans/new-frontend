import {
  HISTORY_DOMAIN_FILTER_OPTIONS,
  type HistoryDomainFilterValue,
} from '@/shared/constants/domains';

// ============================================================================
// History Page Constants
// ============================================================================

export const ITEMS_PER_PAGE = 10;

export const STATUS_OPTIONS = [
  'all',
  'pending',
  'processing',
  'succeeded',
  'failed',
] as const;

export type StatusFilterValue = (typeof STATUS_OPTIONS)[number];

/** History domain filter options (includes "auto"). Re-export from shared. */
export const DOMAIN_OPTIONS = HISTORY_DOMAIN_FILTER_OPTIONS;
export type DomainFilterValue = HistoryDomainFilterValue;

// ============================================================================
// Helpers
// ============================================================================

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
