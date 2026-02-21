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
