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

export const DOMAIN_OPTIONS = [
  'all',
  'general',
  'technology',
  'medical',
  'legal',
  'finance',
  'marketing',
  'education',
  'engineering',
  'science',
] as const;

export type DomainFilterValue = (typeof DOMAIN_OPTIONS)[number];

// ============================================================================
// Helpers
// ============================================================================

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
