'use client';

import { useTranslations, useLocale } from 'next-intl';
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
  const t = useTranslations('dashboard.history');
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

  if (isLoading || isError) {
    return <HistoryTableSkeleton />;
  }

  return (
    <>
      <HistoryFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
      />

      {jobs.length === 0 ? (
        <HistoryEmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <HistoryTable jobs={jobs} locale={locale} />
          {meta && (
            <HistoryPagination meta={meta} onPageChange={setPage} />
          )}
        </>
      )}
    </>
  );
}
