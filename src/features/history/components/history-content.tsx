'use client';

import { useLocale } from 'next-intl';
import { AppCard, AppCardContent } from '@/components/ui/app-card';
import { useHistoryJobs } from '../hooks';
import { HistoryFilters } from './history-filters';
import { HistoryTable } from './history-table';
import { HistoryPagination } from './history-pagination';
import { HistoryEmptyState } from './history-empty-state';
import { HistoryTableSkeleton } from './history-table-skeleton';

/**
 * Top-level orchestrator for the history page.
 * Wires the useHistoryJobs hook to all presentational sub-components.
 */
export function HistoryContent() {
  const locale = useLocale();

  const {
    jobs,
    meta,
    isLoading,
    isError,
    search,
    statusFilter,
    hasFilters,
    handleSearchChange,
    handleStatusChange,
    setPage,
  } = useHistoryJobs();

  return (
    <>
      <HistoryFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {isLoading && jobs.length === 0 ? (
        <HistoryTableSkeleton showFilters={false} />
      ) : isError && jobs.length === 0 ? (
        <AppCard>
          <HistoryEmptyState hasFilters={hasFilters} />
        </AppCard>
      ) : jobs.length === 0 ? (
        <AppCard>
          <HistoryEmptyState hasFilters={hasFilters} />
        </AppCard>
      ) : (
        <AppCard className="overflow-hidden">
          <HistoryTable jobs={jobs} locale={locale} />
          {meta && meta.totalPages > 1 && (
            <AppCardContent padding="none" className="border-t px-4 py-3 lg:px-6">
              <HistoryPagination meta={meta} onPageChange={setPage} />
            </AppCardContent>
          )}
        </AppCard>
      )}
    </>
  );
}
