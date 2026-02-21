import type { TranslationJobResponse } from '@/features/dashboard/api/dashboard.api';

// ============================================================================
// Component Prop Types
// ============================================================================

export interface HistoryFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export interface HistoryTableProps {
  jobs: TranslationJobResponse[];
  locale: string;
}

export interface HistoryPaginationProps {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange: (page: number) => void;
}

export interface HistoryEmptyStateProps {
  hasFilters: boolean;
}
